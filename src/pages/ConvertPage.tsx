import React, { useState } from 'react';
import { FileUploadZone } from '../components/FileUploadZone';
import { ToolLayout } from '../components/ToolLayout';
import { usePDFStore } from '../store/pdfStore';
import { ProcessButton } from '../components/ProcessButton';

export function ConvertPage() {
  const { files, addFiles, isProcessing, processFiles } = usePDFStore();
  const [conversionType, setConversionType] = useState('pdf-to-jpg');

  const conversionOptions = [
    { value: 'pdf-to-jpg', label: 'PDF to JPG', accept: { 'application/pdf': ['.pdf'] } },
    { value: 'pdf-to-png', label: 'PDF to PNG', accept: { 'application/pdf': ['.pdf'] } },
    { value: 'jpg-to-pdf', label: 'JPG to PDF', accept: { 'image/jpeg': ['.jpg', '.jpeg'] } },
    { value: 'png-to-pdf', label: 'PNG to PDF', accept: { 'image/png': ['.png'] } },
  ];

  const currentOption = conversionOptions.find(opt => opt.value === conversionType);

  const handleConvert = async () => {
    if (files.length === 0) return;
    await processFiles('convert', { type: conversionType });
  };

  return (
    <ToolLayout
      title="Convert Files"
      description="Convert between PDF and image formats with high-quality results."
    >
      <div className="space-y-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Type</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conversionOptions.map((option) => (
              <label
                key={option.value}
                className={`relative cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 text-center ${
                  conversionType === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="conversion"
                  value={option.value}
                  checked={conversionType === option.value}
                  onChange={(e) => setConversionType(e.target.value)}
                  className="sr-only"
                />
                <div className="font-medium text-gray-900">
                  {option.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <FileUploadZone
          onFilesAdded={addFiles}
          accept={currentOption?.accept || { 'application/pdf': ['.pdf'] }}
          multiple={conversionType.includes('to-pdf')}
          disabled={isProcessing}
        />

        {files.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
            <h4 className="font-medium text-gray-900 mb-2">Files to convert:</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <ProcessButton
            onClick={handleConvert}
            isProcessing={isProcessing}
            disabled={files.length === 0}
            label={`Convert ${files.length} file${files.length > 1 ? 's' : ''}`}
          />
        )}
      </div>
    </ToolLayout>
  );
}