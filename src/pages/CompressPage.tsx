import React, { useState } from 'react';
import { FileUploadZone } from '../components/FileUploadZone';
import { ToolLayout } from '../components/ToolLayout';
import { usePDFStore } from '../store/pdfStore';
import { ProcessButton } from '../components/ProcessButton';

export function CompressPage() {
  const { files, addFiles, isProcessing, processFiles } = usePDFStore();
  const [compressionLevel, setCompressionLevel] = useState('balanced');

  const compressionOptions = [
    {
      value: 'high',
      label: 'High Quality',
      description: 'Minimal compression, best quality',
      reduction: '10-30%'
    },
    {
      value: 'balanced',
      label: 'Balanced',
      description: 'Good balance of quality and size',
      reduction: '30-60%'
    },
    {
      value: 'smallest',
      label: 'Smallest File',
      description: 'Maximum compression',
      reduction: '60-80%'
    }
  ];

  const handleCompress = async () => {
    if (files.length !== 1) return;
    await processFiles('compress', { level: compressionLevel });
  };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce your PDF file size while maintaining quality with our smart compression algorithms."
    >
      <div className="space-y-8">
        <FileUploadZone
          onFilesAdded={addFiles}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          disabled={isProcessing}
        />

        {files.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Quality</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compressionOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
                    compressionLevel === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="compression"
                    value={option.value}
                    checked={compressionLevel === option.value}
                    onChange={(e) => setCompressionLevel(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-1">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {option.description}
                    </div>
                    <div className="text-xs font-medium text-blue-600">
                      {option.reduction} smaller
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {files.length === 1 && (
          <ProcessButton
            onClick={handleCompress}
            isProcessing={isProcessing}
            disabled={files.length !== 1}
            label="Compress PDF"
          />
        )}
      </div>
    </ToolLayout>
  );
}