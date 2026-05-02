import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, PlayCircle, Loader2 } from 'lucide-react';
import { MOCK_LESSONS } from '../data';
import { ResourceCard, ActivityItem } from '../components/Cards';
import { Lesson, Resource } from '../types';
import { ViewerModal } from '../components/ViewerModal';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { handleFirestoreError, OperationType } from '../services/firestoreUtils';

export const LessonsPage = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'lessons'));
        const lessonsData: Lesson[] = [];
        
        for (const doc of querySnapshot.docs) {
          const lesson = { id: doc.id, ...doc.data() } as Lesson;
          
          // Fetch sub-resources
          const resSnapshot = await getDocs(collection(db, `lessons/${doc.id}/resources`));
          lesson.resources = resSnapshot.docs.map(rd => ({ id: rd.id, ...rd.data() } as Resource));
          
          // Fetch sub-activities
          const actSnapshot = await getDocs(collection(db, `lessons/${doc.id}/activities`));
          lesson.activities = actSnapshot.docs.map(ad => ({ id: ad.id, ...ad.data() } as any));
          
          lessonsData.push(lesson);
        }

        if (lessonsData.length > 0) {
          setLessons(lessonsData);
        } else {
          setLessons(MOCK_LESSONS);
        }
      } catch (error) {
        // Fallback to mock data on error or permission denied (if not seeded)
        setLessons(MOCK_LESSONS);
        console.warn('Usando datos locales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Obteniendo Lecciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mis Clases</h1>
        <p className="text-gray-500 mt-2 text-lg">Explora el contenido y recursos de tus lecciones.</p>
      </header>

      <div className="space-y-16">
        {lessons.map((lesson) => (
          <section key={lesson.id} className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <Calendar className="text-gray-900" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
                  <p className="text-sm text-gray-500">Fecha de clase: {new Date(lesson.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:translate-x-1 transition-transform">
                Ver todos los detalles <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Resources */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                  <PlayCircle size={14} /> Recursos de la Clase
                </div>
                <motion.div 
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {lesson.resources.map((resource) => (
                    <motion.div key={resource.id} variants={item}>
                      <ResourceCard 
                        resource={resource} 
                        onOpen={setSelectedResource} 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Activities */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                  Actividades
                </div>
                <div className="space-y-3">
                  {lesson.activities.map((activity) => (
                    <ActivityItem 
                      key={activity.id}
                      title={activity.title}
                      dueDate={activity.dueDate}
                      status={activity.status}
                    />
                  ))}
                  {lesson.activities.length === 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400 italic">
                      No hay actividades para esta lección.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <ViewerModal 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)} 
      />
    </div>
  );
};
