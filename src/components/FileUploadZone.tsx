import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  accept: Record<string, string[]>;
  multiple?: boolean;
  disabled?: boolean;
}

export function FileUploadZone({ onFilesAdded, accept, multiple = true, disabled = false }: FileUploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept,
    multiple,
    disabled,
    onDrop: onFilesAdded,
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  const getIcon = () => {
    if (accept['application/pdf']) return FileText;
    if (accept['image/jpeg'] || accept['image/png']) return Image;
    return Upload;
  };

  const Icon = getIcon();

  const getBorderColor = () => {
    if (disabled) return 'border-gray-200';
    if (isDragReject) return 'border-red-400';
    if (isDragAccept) return 'border-green-400';
    if (isDragActive) return 'border-blue-400';
    return 'border-gray-300';
  };

  const getBgColor = () => {
    if (disabled) return 'bg-gray-50';
    if (isDragReject) return 'bg-red-50';
    if (isDragAccept) return 'bg-green-50';
    if (isDragActive) return 'bg-blue-50';
    return 'bg-white/50';
  };

  return (
    <div
      {...getRootProps()}
      className={`
        border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-200 backdrop-blur-sm
        ${getBorderColor()} ${getBgColor()}
        ${!disabled && 'hover:border-blue-400 hover:bg-blue-50/50'}
        ${disabled && 'cursor-not-allowed opacity-50'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDragActive ? 'bg-blue-100' : 'bg-gray-100'
        } transition-colors duration-200`}>
          <Icon className={`h-8 w-8 ${
            isDragActive ? 'text-blue-600' : 'text-gray-600'
          }`} />
        </div>
        
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-600">
            or <span className="text-blue-600 font-medium">browse files</span>
          </p>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>Supported formats: {Object.values(accept).flat().join(', ')}</p>
          <p>Maximum file size: 10MB per file</p>
          {multiple && <p>Multiple files supported</p>}
        </div>
      </div>
    </div>
  );
}