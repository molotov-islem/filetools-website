import React, { useState } from 'react';
import { FileUploadZone } from '../components/FileUploadZone';
import { ToolLayout } from '../components/ToolLayout';
import { usePDFStore } from '../store/pdfStore';
import { ProcessButton } from '../components/ProcessButton';

export function SplitPage() {
  const { files, addFiles, isProcessing, processFiles } = usePDFStore();
  const [splitOptions, setSplitOptions] = useState({
    method: 'pages',
    pageRanges: '1-3, 5-7',
    pagesPerFile: 1
  });

  const handleSplit = async () => {
    if (files.length !== 1) return;
    await processFiles('split', splitOptions);
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages or split your PDF into multiple documents with precise control."
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Split Method
                </label>
                <select
                  value={splitOptions.method}
                  onChange={(e) => setSplitOptions({ ...splitOptions, method: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pages">Extract specific pages</option>
                  <option value="intervals">Split every N pages</option>
                  <option value="ranges">Custom page ranges</option>
                </select>
              </div>

              {splitOptions.method === 'pages' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Ranges (e.g., 1-3, 5-7, 10)
                  </label>
                  <input
                    type="text"
                    value={splitOptions.pageRanges}
                    onChange={(e) => setSplitOptions({ ...splitOptions, pageRanges: e.target.value })}
                    placeholder="1-3, 5-7, 10"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {splitOptions.method === 'intervals' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages per file
                  </label>
                  <input
                    type="number"
                    value={splitOptions.pagesPerFile}
                    onChange={(e) => setSplitOptions({ ...splitOptions, pagesPerFile: parseInt(e.target.value) })}
                    min="1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {files.length === 1 && (
          <ProcessButton
            onClick={handleSplit}
            isProcessing={isProcessing}
            disabled={files.length !== 1}
            label="Split PDF"
          />
        )}
      </div>
    </ToolLayout>
  );
}