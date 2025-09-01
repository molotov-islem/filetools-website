import { create } from 'zustand';
import { PDFDocument } from 'pdf-lib';

interface PDFStore {
  files: File[];
  isProcessing: boolean;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  clearFiles: () => void;
  processFiles: (operation: string, options?: any) => Promise<void>;
}

export const usePDFStore = create<PDFStore>((set, get) => ({
  files: [],
  isProcessing: false,

  addFiles: (newFiles: File[]) => {
    const { files } = get();
    set({ files: [...files, ...newFiles] });
  },

  removeFile: (index: number) => {
    const { files } = get();
    const newFiles = files.filter((_, i) => i !== index);
    set({ files: newFiles });
  },

  reorderFiles: (fromIndex: number, toIndex: number) => {
    const { files } = get();
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    set({ files: newFiles });
  },

  clearFiles: () => {
    set({ files: [] });
  },

  processFiles: async (operation: string, options?: any) => {
    set({ isProcessing: true });
    
    try {
      const { files } = get();
      
      switch (operation) {
        case 'merge':
          await mergePDFs(files);
          break;
        case 'split':
          await splitPDF(files[0], options);
          break;
        case 'compress':
          await compressPDF(files[0], options);
          break;
        case 'convert':
          await convertFiles(files, options);
          break;
        case 'reorder':
          await reorderPDF(files[0]);
          break;
        default:
          console.log(`Operation ${operation} not implemented yet`);
      }
    } catch (error) {
      console.error('Processing error:', error);
      alert('An error occurred while processing your files. Please try again.');
    } finally {
      set({ isProcessing: false });
    }
  }
}));

// PDF processing functions (simplified for demo)
async function mergePDFs(files: File[]) {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }
    
    const pdfBytes = await pdfDoc.save();
    downloadFile(pdfBytes, 'merged.pdf', 'application/pdf');
  } catch (error) {
    throw new Error(`Failed to merge PDFs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function splitPDF(file: File, options: any) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    if (options.method === 'pages') {
      // Parse page ranges like "1-3, 5-7, 10"
      const ranges = options.pageRanges.split(',').map((range: string) => range.trim());
      
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const newPdf = await PDFDocument.create();
        
        if (range.includes('-')) {
          // Handle range like "1-3"
          const [start, end] = range.split('-').map((n: string) => parseInt(n.trim()) - 1);
          if (start >= 0 && end < totalPages && start <= end) {
            const pages = await newPdf.copyPages(pdfDoc, Array.from({ length: end - start + 1 }, (_, i) => start + i));
            pages.forEach(page => newPdf.addPage(page));
          }
        } else {
          // Handle single page like "10"
          const pageNum = parseInt(range) - 1;
          if (pageNum >= 0 && pageNum < totalPages) {
            const [page] = await newPdf.copyPages(pdfDoc, [pageNum]);
            newPdf.addPage(page);
          }
        }
        
        const pdfBytes = await newPdf.save();
        downloadFile(pdfBytes, `split_${i + 1}.pdf`, 'application/pdf');
      }
    } else if (options.method === 'intervals') {
      // Split every N pages
      const pagesPerFile = options.pagesPerFile;
      const numFiles = Math.ceil(totalPages / pagesPerFile);
      
      for (let i = 0; i < numFiles; i++) {
        const newPdf = await PDFDocument.create();
        const startPage = i * pagesPerFile;
        const endPage = Math.min(startPage + pagesPerFile - 1, totalPages - 1);
        
        const pageIndices = Array.from({ length: endPage - startPage + 1 }, (_, j) => startPage + j);
        const pages = await newPdf.copyPages(pdfDoc, pageIndices);
        pages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        downloadFile(pdfBytes, `split_part_${i + 1}.pdf`, 'application/pdf');
      }
    }
  } catch (error) {
    throw new Error(`Failed to split PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function compressPDF(file: File, options: any) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Apply compression based on level
    let compressionOptions = {};
    
    switch (options.level) {
      case 'high':
        // Minimal compression for high quality
        compressionOptions = { useObjectStreams: false };
        break;
      case 'balanced':
        // Balanced compression
        compressionOptions = { useObjectStreams: true };
        break;
      case 'smallest':
        // Maximum compression
        compressionOptions = { 
          useObjectStreams: true,
          addDefaultPage: false
        };
        break;
      default:
        compressionOptions = { useObjectStreams: true };
    }
    
    // Save with compression options
    const pdfBytes = await pdfDoc.save(compressionOptions);
    
    // Calculate compression ratio
    const originalSize = file.size;
    const compressedSize = pdfBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    const filename = file.name.replace('.pdf', '_compressed.pdf');
    downloadFile(pdfBytes, filename, 'application/pdf');
    
    // Show compression results
    alert(`PDF compressed successfully!\nOriginal: ${(originalSize / 1024 / 1024).toFixed(2)} MB\nCompressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB\nReduction: ${compressionRatio}%`);
  } catch (error) {
    throw new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function convertFiles(files: File[], options: any) {
  console.log('Converting files with type:', options.type);
  alert('File conversion functionality will be implemented with proper format handling.');
}

async function reorderPDF(file: File) {
  console.log('Reordering PDF pages');
  alert('Page reordering functionality will be implemented with thumbnail interface.');
}

function downloadFile(data: Uint8Array, filename: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}