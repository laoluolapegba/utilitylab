export const INPUT_FORMATS = [
    "png",
    "jpg",
    "jpeg",
    "webp",
    "gif",
    "bmp",
    "tiff",
    "svg",
    "ico",
    "heic",
    "heif",
] as const;

export const OUTPUT_FORMATS = ["png", "jpeg", "webp", "bmp", "gif", "tiff", "ico", "avif", "svg"] as const;

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

const MIME_TYPE_MAP: Record<Exclude<OutputFormat, "svg">, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
    bmp: "image/bmp",
    gif: "image/gif",
    tiff: "image/tiff",
    ico: "image/x-icon",
    avif: "image/avif",
};

export type ConversionOptions = {
    outputFormat: OutputFormat;
    quality: number;
    maxWidth?: number;
    maxHeight?: number;
};

export type ConversionResult = {
    fileName: string;
    blob: Blob;
    outputFormat: OutputFormat;
    sourceFileName: string;
    width: number;
    height: number;
    sourceSize: number;
    outputSize: number;
    warning?: string;
};

export function getFileExtension(fileName: string) {
    return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = "async";

        const objectUrl = URL.createObjectURL(file);
        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(image);
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error(`Unable to decode image: ${file.name}. Your browser may not support this format.`));
        };

        image.src = objectUrl;
    });
}

function calcTargetDimensions(width: number, height: number, maxWidth?: number, maxHeight?: number) {
    if (!maxWidth && !maxHeight) return { width, height };

    const widthRatio = maxWidth ? maxWidth / width : Number.POSITIVE_INFINITY;
    const heightRatio = maxHeight ? maxHeight / height : Number.POSITIVE_INFINITY;
    const ratio = Math.min(widthRatio, heightRatio, 1);

    return {
        width: Math.max(1, Math.round(width * ratio)),
        height: Math.max(1, Math.round(height * ratio)),
    };
}

async function canvasToBlob(canvas: HTMLCanvasElement, format: Exclude<OutputFormat, "svg">, quality: number) {
    const mime = MIME_TYPE_MAP[format];

    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, mime, quality);
    });

    if (blob) return { blob, warning: undefined };

    const pngFallback = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, MIME_TYPE_MAP.png, quality);
    });

    if (!pngFallback) {
        throw new Error("Canvas export failed for this image.");
    }

    return {
        blob: pngFallback,
        warning: `Your browser does not support ${format.toUpperCase()} export directly, so PNG was generated instead.`,
    };
}

export async function convertImage(file: File, options: ConversionOptions): Promise<ConversionResult> {
    const extension = getFileExtension(file.name);
    const outputFormat = options.outputFormat;
    const quality = Math.min(1, Math.max(0.1, options.quality));

    if (outputFormat === "svg") {
        if (extension !== "svg") {
            throw new Error("SVG output is passthrough-only. Upload an SVG to keep vector quality.");
        }

        const svgText = await file.text();
        const svgBlob = new Blob([svgText], { type: "image/svg+xml" });

        return {
            fileName: file.name.replace(/\.[^.]+$/, ".svg"),
            blob: svgBlob,
            outputFormat,
            sourceFileName: file.name,
            width: 0,
            height: 0,
            sourceSize: file.size,
            outputSize: svgBlob.size,
        };
    }

    const image = await loadImage(file);
    const target = calcTargetDimensions(image.naturalWidth, image.naturalHeight, options.maxWidth, options.maxHeight);

    const canvas = document.createElement("canvas");
    canvas.width = target.width;
    canvas.height = target.height;

    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Canvas context is not available in this browser.");
    }

    context.drawImage(image, 0, 0, target.width, target.height);

    const { blob, warning } = await canvasToBlob(canvas, outputFormat, quality);

    return {
        fileName: file.name.replace(/\.[^.]+$/, `.${outputFormat === "jpeg" ? "jpg" : outputFormat}`),
        blob,
        outputFormat,
        sourceFileName: file.name,
        width: target.width,
        height: target.height,
        sourceSize: file.size,
        outputSize: blob.size,
        warning,
    };
}
