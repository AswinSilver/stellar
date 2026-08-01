import { useStore } from '../store/useStore';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useRef } from 'react';

interface ImagesViewProps {
  onUploadFile: (file: File) => Promise<any>;
}

export default function ImagesView({ onUploadFile }: ImagesViewProps) {
  const { images } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onUploadFile(file);
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col h-full p-4 sm:p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-blue-500" />
          Image Gallery
        </h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <UploadCloud className="w-5 h-5" />
          <span className="hidden sm:inline">Upload Image</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {images.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-8 text-center">
          <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No images uploaded yet.</p>
          <p className="text-sm">Click the upload button to add your first image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-max overflow-y-auto pb-8 custom-scrollbar pr-2">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow border border-neutral-200 dark:border-neutral-800">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4">
                <p className="text-white text-xs sm:text-sm truncate font-medium">{img.name}</p>
                <a href={img.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 text-xs hover:underline mt-1 w-max">Open original</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
