import React from 'react';
import { FileUploadZone } from '../components/FileUploadZone';
import { ToolLayout } from '../components/ToolLayout';
import { usePDFStore } from '../store/pdfStore';
import { ProcessButton } from '../components/ProcessButton';

export function ReorderPage() {
  const { files, addFiles, isProcessing, processFiles } = usePDFStore();

  const handleReorder = async () => {
    if (files.length !== 1) return;
    await processFiles('reorder');
  };

  return (
    <ToolLayout
      title="Reorder Pages"
      description="Rearrange or delete pages in your PDF with an intuitive thumbnail interface."
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Preview</h3>
            <div className="text-center py-12 text-gray-500">
              <div className="bg-gray-100 rounded-lg p-8 mx-auto max-w-md">
                <p className="text-sm">
                  Page thumbnails and reordering interface will be displayed here.
                  This feature requires PDF rendering capabilities.
                </p>
              </div>
            </div>
          </div>
        )}

        {files.length === 1 && (
          <ProcessButton
            onClick={handleReorder}
            isProcessing={isProcessing}
            disabled={files.length !== 1}
            label="Save Reordered PDF"
          />
        )}
      </div>
    </ToolLayout>
  );
}