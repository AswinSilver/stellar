import { useStore } from '../store/useStore';
import type { UploadedFile } from '../store/useStore';
import { UploadCloud, Folder, File as FileIcon, Download, Trash2 } from 'lucide-react';
import { useRef } from 'react';

interface FilesViewProps {
  onUploadFile: (file: File) => Promise<any>;
  onDeleteFile: (file: UploadedFile, type: 'image' | 'file') => Promise<void>;
}

export default function FilesView({ onUploadFile, onDeleteFile }: FilesViewProps) {
  const { files } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadFile(file);
    e.target.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 flex flex-col h-full p-4 sm:p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Folder className="w-6 h-6 text-purple-500" />
          Files & Attachments
        </h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <UploadCloud className="w-5 h-5" />
          <span className="hidden sm:inline">Upload File</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
        />
      </div>

      {files.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-8 text-center">
          <Folder className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No files uploaded yet.</p>
          <p className="text-sm">Click the upload button to add a file.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto pb-8 custom-scrollbar pr-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                  <FileIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{file.name}</h3>
                  <p className="text-xs sm:text-sm text-neutral-500">{formatSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={() => onDeleteFile(file, 'file')}
                  className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
