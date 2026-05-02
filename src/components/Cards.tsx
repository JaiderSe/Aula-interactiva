import { Play, FileText, Presentation, ExternalLink, Clock } from 'lucide-react';
import { Resource, ResourceType } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ResourceCardProps {
  resource: Resource;
  onOpen: (resource: Resource) => void;
}

export const ResourceCard = ({ resource, onOpen }: ResourceCardProps) => {
  const isVideo = resource.type === ResourceType.VIDEO;
  const isPDF = resource.type === ResourceType.PDF;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => onOpen(resource)}
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {resource.thumbnail ? (
          <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            {isPDF ? <FileText size={48} /> : <Presentation size={48} />}
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
            {isVideo ? <Play size={20} className="text-gray-900 fill-gray-900" /> : <ExternalLink size={20} className="text-gray-900" />}
          </div>
        </div>
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-2 px-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
            isVideo ? "bg-red-500 text-white" : isPDF ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
          )}>
            {resource.type}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{resource.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{resource.description}</p>
      </div>
    </motion.div>
  );
};

export const ActivityItem = ({ title, dueDate, status }: { title: string; dueDate: string; status: string; key?: string }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
    <div className={cn(
      "w-2 h-2 rounded-full",
      status === 'completed' ? "bg-green-500" : "bg-orange-500"
    )} />
    <div className="flex-1">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
        <Clock size={12} />
        <span>Vence: {new Date(dueDate).toLocaleDateString()}</span>
      </div>
    </div>
    <span className={cn(
      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
      status === 'completed' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
    )}>
      {status === 'completed' ? 'Listo' : 'Pendiente'}
    </span>
  </div>
);
