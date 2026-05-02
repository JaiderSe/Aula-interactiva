import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertCircle } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { cn } from '../lib/utils';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  onSubmit: (file: File) => void;
}

export const SubmissionModal = ({ isOpen, onClose, activityTitle, onSubmit }: SubmissionModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedFile) return;
    setIsSubmitting(true);
    // Simular envío
    setTimeout(() => {
      onSubmit(selectedFile);
      setIsSubmitting(false);
      onClose();
      setSelectedFile(null);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Entregar Actividad</h2>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-1">Actividad seleccionada</span>
              <p className="text-sm font-semibold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {activityTitle}
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block">Cargar archivo</span>
              <FileUpload onFileSelect={setSelectedFile} />
              
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-blue-700">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  Asegúrate de que tu archivo esté completo antes de enviarlo. No podrás realizar cambios después de la entrega.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!selectedFile || isSubmitting}
              className={cn(
                "flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[#111827] text-white rounded-2xl font-bold transition-all",
                (!selectedFile || isSubmitting) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 shadow-lg shadow-gray-200"
              )}
            >
              {isSubmitting ? (
                <>Enviando...</>
              ) : (
                <>Enviar Tarea <Send size={18} /></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

