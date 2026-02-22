import { convertImage, type ConversionOptions, type ConversionResult } from "@/lib/image-converter/converter";

export type BatchProgress = {
    total: number;
    completed: number;
    currentFile?: string;
    percent: number;
};

export type BatchProcessResult = {
    successful: ConversionResult[];
    failed: Array<{ fileName: string; error: string }>;
};

export async function processBatch(
    files: File[],
    options: ConversionOptions,
    onProgress?: (progress: BatchProgress) => void,
): Promise<BatchProcessResult> {
    const successful: ConversionResult[] = [];
    const failed: Array<{ fileName: string; error: string }> = [];

    for (let index = 0; index < files.length; index += 1) {
        const file = files[index];

        onProgress?.({
            total: files.length,
            completed: index,
            currentFile: file.name,
            percent: Math.round((index / files.length) * 100),
        });

        try {
            const result = await convertImage(file, options);
            successful.push(result);
        } catch (error) {
            failed.push({
                fileName: file.name,
                error: error instanceof Error ? error.message : "Unknown conversion error",
            });
        }
    }

    onProgress?.({
        total: files.length,
        completed: files.length,
        percent: 100,
    });

    return { successful, failed };
}
