import React from 'react';
import { X, GripVertical, FileText } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showReorder?: boolean;
}

export function FileList({ files, onRemove, onReorder, showReorder = false }: FileListProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && onReorder) {
      onReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Selected Files ({files.length})
      </h3>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div
            key={index}
            draggable={showReorder}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200
              transition-all duration-200 hover:shadow-md
              ${showReorder ? 'cursor-move hover:bg-gray-50' : ''}
              ${draggedIndex === index ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center space-x-3">
              {showReorder && (
                <GripVertical className="h-5 w-5 text-gray-400" />
              )}
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onRemove(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}