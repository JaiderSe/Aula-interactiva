import { useState, useRef, DragEvent } from 'react';
import { Upload, X, File, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export const FileUpload = ({ onFileSelect, accept = ".pdf,.doc,.docx,.jpg,.png", maxSize = 10 }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (!selectedFile) return;
    
    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`El archivo es demasiado grande. El máximo permitido es ${maxSize}MB.`);
      return;
    }

    setFile(selectedFile);
    simulateUpload(selectedFile);
  };

  const simulateUpload = (selectedFile: File) => {
    setUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          onFileSelect(selectedFile);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer",
              isDragging 
                ? "border-gray-900 bg-gray-50 bg-opacity-100" 
                : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
              accept={accept}
              className="hidden"
            />
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Upload className="text-gray-400 group-hover:text-gray-900 transition-colors" size={24} />
            </div>
            <p className="text-sm font-bold text-gray-900">Haz clic o arrastra un archivo aquí</p>
            <p className="text-xs text-gray-400 mt-1">PDF, Documentos o Imágenes (Máx. {maxSize}MB)</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-gray-100 bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <File className="text-gray-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              
              {uploading && (
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gray-900 h-full"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {uploading ? (
                <Loader2 className="animate-spin text-gray-400" size={20} />
              ) : (
                <CheckCircle2 className="text-green-500" size={20} />
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
