import React from 'react';
import { FileUploadZone } from '../components/FileUploadZone';
import { ToolLayout } from '../components/ToolLayout';
import { usePDFStore } from '../store/pdfStore';
import { FileList } from '../components/FileList';
import { ProcessButton } from '../components/ProcessButton';

export function MergePage() {
  const { files, addFiles, removeFile, reorderFiles, isProcessing, processFiles } = usePDFStore();

  const handleMerge = async () => {
    if (files.length < 2) return;
    await processFiles('merge');
  };

  return (
    <ToolLayout
      title="Merge PDFs"
      description="Combine multiple PDF files into one document. Drag and drop to reorder files before merging."
    >
      <div className="space-y-8">
        <FileUploadZone
          onFilesAdded={addFiles}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple={true}
          disabled={isProcessing}
        />

        {files.length > 0 && (
          <FileList
            files={files}
            onRemove={removeFile}
            onReorder={reorderFiles}
            showReorder={true}
          />
        )}

        {files.length >= 2 && (
          <ProcessButton
            onClick={handleMerge}
            isProcessing={isProcessing}
            disabled={files.length < 2}
            label={`Merge ${files.length} PDFs`}
          />
        )}
      </div>
    </ToolLayout>
  );
}