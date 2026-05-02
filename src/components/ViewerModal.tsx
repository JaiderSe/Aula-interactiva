import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';
import { Resource, ResourceType } from '../types';

interface ViewerModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const ViewerModal = ({ resource, onClose }: ViewerModalProps) => {
  if (!resource) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-bottom border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest leading-none mb-1">
                Visualizando {resource.type}
              </span>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">{resource.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-gray-900 relative">
            {resource.type === ResourceType.VIDEO ? (
              <iframe
                src={`${resource.url}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : resource.type === ResourceType.PDF ? (
              <iframe
                src={resource.url.startsWith('/') ? resource.url : `https://docs.google.com/gview?url=${encodeURIComponent(resource.url)}&embedded=true`}
                className="w-full h-full bg-white font-sans"
                title={resource.title}
              />
            ) : (
              <iframe
                src={resource.url}
                className="w-full h-full bg-white"
                allowFullScreen
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className="text-sm text-gray-600 line-clamp-1">{resource.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                download
              >
                Descargar PDF <Maximize2 size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
