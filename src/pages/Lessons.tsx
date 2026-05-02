import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, PlayCircle, Loader2, Plus, Settings } from 'lucide-react';
import { MOCK_LESSONS } from '../data';
import { ResourceCard, ActivityItem } from '../components/Cards';
import { Lesson, Resource } from '../types';
import { ViewerModal } from '../components/ViewerModal';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { handleFirestoreError, OperationType } from '../services/firestoreUtils';
import { useAuth } from '../services/AuthContext';

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

  const { userProfile } = useAuth();
  const isTeacher = userProfile?.role === 'teacher';

  const lessonsByUnit = lessons.reduce((acc, lesson) => {
    const unit = lesson.unit || 'Sin Unidad';
    if (!acc[unit]) acc[unit] = [];
    acc[unit].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mis Clases</h1>
          <p className="text-gray-500 mt-2 text-lg">Explora el contenido y recursos de tus lecciones.</p>
        </div>
        {isTeacher && (
          <button className="bg-[#111827] text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2">
            <Plus size={18} /> Nueva Lección
          </button>
        )}
      </header>

      <div className="space-y-20">
        {(Object.entries(lessonsByUnit) as [string, Lesson[]][]).map(([unitName, unitLessons]) => (
          <div key={unitName} className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap bg-[#F9FAFB] px-4">
                {unitName}
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-12">
              {unitLessons.map((lesson) => (
                <section key={lesson.id} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                        <Calendar className="text-gray-900" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
                        <p className="text-sm text-gray-500">
                          {new Date(lesson.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isTeacher && (
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                          <Settings size={18} />
                        </button>
                      )}
                      <button className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:translate-x-1 transition-transform ml-2">
                        Ver detalles <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Resources */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <PlayCircle size={14} /> Recursos
                        </div>
                        {isTeacher && (
                          <button className="text-[10px] font-bold text-blue-600 hover:underline">+ Añadir Recurso</button>
                        )}
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
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Actividades
                        </div>
                        {isTeacher && (
                          <button className="text-[10px] font-bold text-orange-600 hover:underline">+ Añadir Tarea</button>
                        )}
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
          </div>
        ))}
      </div>

      <ViewerModal 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)} 
      />
    </div>
  );
};
