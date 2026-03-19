'use client';

import { useCallback, useState } from 'react';
import { FileText, Upload } from 'lucide-react';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

export function UploadZone({ onUpload, isProcessing }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) onUpload(e.dataTransfer.files[0]);
  }, [onUpload]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div
        className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          disabled={isProcessing}
        />
        <div className="flex flex-col items-center gap-4">
          <Upload className="h-12 w-12 text-gray-400" />
          <div>
            <label htmlFor="file-upload" className="cursor-pointer font-medium text-blue-600 hover:text-blue-700">Upload invoice</label>
            <span className="text-gray-600"> or drag and drop</span>
          </div>
          <p className="text-sm text-gray-500">PDF or image (PNG, JPG) up to 10MB</p>
          <label htmlFor="file-upload" className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
            <FileText className="h-5 w-5" />
            <span>Choose File</span>
          </label>
        </div>
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Processing invoice...</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        🔒 <strong>Privacy first:</strong> Your invoice is processed in-memory and immediately deleted. We never store your files.
      </div>
    </div>
  );
}
