type ZipEntry = {
    name: string;
    data: Uint8Array;
};

const encoder = new TextEncoder();

function makeCrc32Table() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
        let c = n;
        for (let k = 0; k < 8; k += 1) {
            c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
}

const crcTable = makeCrc32Table();

function crc32(input: Uint8Array) {
    let crc = 0xffffffff;
    for (let i = 0; i < input.length; i += 1) {
        crc = crcTable[(crc ^ input[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(view: DataView, offset: number, value: number) {
    view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
    view.setUint32(offset, value, true);
}

export async function createZipBlob(files: Array<{ name: string; blob: Blob }>) {
    const entries: ZipEntry[] = await Promise.all(
        files.map(async (file) => ({
            name: file.name,
            data: new Uint8Array(await file.blob.arrayBuffer()),
        })),
    );

    const localChunks: Uint8Array[] = [];
    const centralChunks: Uint8Array[] = [];
    let offset = 0;

    entries.forEach((entry) => {
        const nameBytes = encoder.encode(entry.name);
        const crc = crc32(entry.data);
        const size = entry.data.length;

        const localHeader = new Uint8Array(30 + nameBytes.length);
        const localView = new DataView(localHeader.buffer);
        writeUint32(localView, 0, 0x04034b50);
        writeUint16(localView, 4, 20);
        writeUint16(localView, 6, 0);
        writeUint16(localView, 8, 0);
        writeUint16(localView, 10, 0);
        writeUint16(localView, 12, 0);
        writeUint32(localView, 14, crc);
        writeUint32(localView, 18, size);
        writeUint32(localView, 22, size);
        writeUint16(localView, 26, nameBytes.length);
        writeUint16(localView, 28, 0);
        localHeader.set(nameBytes, 30);

        localChunks.push(localHeader, entry.data);

        const centralHeader = new Uint8Array(46 + nameBytes.length);
        const centralView = new DataView(centralHeader.buffer);
        writeUint32(centralView, 0, 0x02014b50);
        writeUint16(centralView, 4, 20);
        writeUint16(centralView, 6, 20);
        writeUint16(centralView, 8, 0);
        writeUint16(centralView, 10, 0);
        writeUint16(centralView, 12, 0);
        writeUint16(centralView, 14, 0);
        writeUint32(centralView, 16, crc);
        writeUint32(centralView, 20, size);
        writeUint32(centralView, 24, size);
        writeUint16(centralView, 28, nameBytes.length);
        writeUint16(centralView, 30, 0);
        writeUint16(centralView, 32, 0);
        writeUint16(centralView, 34, 0);
        writeUint16(centralView, 36, 0);
        writeUint32(centralView, 38, 0);
        writeUint32(centralView, 42, offset);
        centralHeader.set(nameBytes, 46);

        centralChunks.push(centralHeader);

        offset += localHeader.length + entry.data.length;
    });

    const centralSize = centralChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const centralOffset = offset;

    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    writeUint32(endView, 0, 0x06054b50);
    writeUint16(endView, 4, 0);
    writeUint16(endView, 6, 0);
    writeUint16(endView, 8, entries.length);
    writeUint16(endView, 10, entries.length);
    writeUint32(endView, 12, centralSize);
    writeUint32(endView, 16, centralOffset);
    writeUint16(endView, 20, 0);

    return new Blob([...localChunks, ...centralChunks, end], { type: "application/zip" });
}
