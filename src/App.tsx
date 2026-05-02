import { Layout } from './components/Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LessonsPage } from './pages/Lessons';
import { BookOpen, TrendingUp, Users, Star, CheckCircle2, Clock, LogIn, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import { MOCK_LESSONS } from './data';
import { useState, useEffect } from 'react';
import { SubmissionModal } from './components/SubmissionModal';
import { AuthProvider, useAuth } from './services/AuthContext';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from './services/firebase';

const LoginPage = () => {
  const { signIn } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 p-10 text-center">
        <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Aula Interactiva</h1>
        <p className="text-gray-500 mt-2 mb-10">Tu plataforma educativa digital para el siglo XXI.</p>
        
        <button 
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-[#111827] text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
        >
          <LogIn size={20} />
          Iniciar con Google
        </button>
        
        <p className="text-xs text-gray-400 mt-8 leading-relaxed">
          Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { userProfile } = useAuth();
  const name = userProfile?.displayName?.split(' ')[0] || 'Docente';
  const roleLabel = userProfile?.role === 'teacher' ? '¡Hola, Profe!' : '¡Hola, Estudiante!';
  const isTeacher = userProfile?.role === 'teacher';
  
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{roleLabel} {name} 👋</h1>
          <p className="text-gray-500 mt-2 text-lg">Bienvenido de nuevo a tu aula interactiva.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900">{isTeacher ? '32' : '4.9'}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isTeacher ? 'Estudiantes' : 'Promedio'}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900">3</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unidades</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: isTeacher ? 'Promedio General' : 'Mi Promedio', val: isTeacher ? '4.5' : '4.9', icon: <TrendingUp className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Participación', val: '94%', icon: <Users className="text-green-500" />, bg: 'bg-green-50' },
          { label: isTeacher ? 'Tareas Por Calificar' : 'Tareas Pendientes', val: isTeacher ? '8' : '1', icon: <Star className="text-orange-500" />, bg: 'bg-orange-50' },
          { label: 'Recursos Totales', val: '7', icon: <BookOpen className="text-purple-500" />, bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.val}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Clases Próximas</h2>
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-900">Ver calendario</button>
          </div>
          <div className="bg-[#111827] rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="relative z-10">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Siguiente Sesión</span>
               <h3 className="text-3xl font-bold mt-2">Fundamentos de Prompting</h3>
               <p className="mt-4 text-gray-400 max-w-sm">
                 {isTeacher 
                  ? 'Lunes a las 10:00 AM • Aula Virtual • Workshop de Patrones'
                  : 'Lunes a las 10:00 AM • Aula Virtual • Prepara tus ejemplos de prompts'}
               </p>
               <button className="mt-8 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                 {isTeacher ? 'Revisar Taller' : 'Ir a la Clase'}
               </button>
             </div>
             <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
             <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-gray-900">Módulos del Curso</h3>
            <div className="space-y-3">
              {MOCK_LESSONS.map((lesson) => (
                <div key={lesson.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                      {lesson.id.replace('u', '')}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{lesson.title}</h4>
                      <p className="text-xs text-gray-500">{lesson.resources.length} Recursos • {lesson.activities.length} Actividades</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-bold text-gray-900">Anuncios</h2>
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-sm font-bold text-indigo-900">¡Nuevo curso disponible!</p>
                <p className="text-xs text-indigo-600 mt-1">Ingeniería de Prompts para Bachillerato ha sido cargado con éxito.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm font-medium text-gray-900">Taller Unidad 1 disponible</p>
                <p className="text-xs text-gray-500 mt-1">Publicado hace 5 min</p>
              </div>
              {isTeacher && (
                <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
                  + Nuevo Anuncio
                </button>
              )}
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100 overflow-hidden relative group">
              <div className="relative z-10">
                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                  <Star className="text-white w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg leading-tight">Curso Activo</h3>
                <p className="text-white/70 text-sm mt-2 leading-snug">Ya puedes explorar la Unidad 1 de Fundamentos de AI.</p>
              </div>
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
           </div>
        </div>
      </div>
    </div>
  );
};

const ActivitiesPage = () => {
  const [selectedActivity, setSelectedActivity] = useState<{ id: string, title: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, userProfile } = useAuth();
  const isTeacher = userProfile?.role === 'teacher';
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;
      try {
        const q = isTeacher 
          ? collection(db, 'submissions') 
          : query(collection(db, 'submissions'), where('studentId', '==', user.uid));
        
        const snapshot = await getDocs(q);
        setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [user, isTeacher]);

  const handleOpenSubmission = (id: string, title: string) => {
    setSelectedActivity({ id, title });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    if (!user || !selectedActivity) return;
    try {
      const submissionData = {
        activityId: selectedActivity.id,
        activityTitle: selectedActivity.title,
        studentId: user.uid,
        studentName: user.displayName || 'Estudiante',
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // En prod usar Firebase Storage
        status: 'submitted',
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'submissions'), submissionData);
      setSubmissions(prev => [...prev, submissionData]);
      setIsModalOpen(false);
      alert('¡Tarea entregada con éxito!');
    } catch (error) {
      console.error('Error uploading submission:', error);
      alert('Error al entregar la tarea. Inténtalo de nuevo.');
    }
  };

  const activities = MOCK_LESSONS.flatMap(l => 
    l.activities.map(a => ({ 
      ...a, 
      lessonTitle: l.title,
      submission: submissions.find(s => s.activityId === a.id)
    }))
  );

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
        </div>
      );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {isTeacher ? 'Entregas de Estudiantes' : 'Mis Actividades'}
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          {isTeacher 
            ? 'Monitorea y califica los trabajos subidos por tus alumnos.' 
            : 'Seguimiento de tareas y evaluaciones pendientes.'}
        </p>
      </header>

      {isTeacher ? (
        <div className="grid grid-cols-1 gap-4">
          {submissions.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400">
              Aún no hay entregas para revisar.
            </div>
          ) : (
            submissions.map((sub, i) => (
              <motion.div
                key={sub.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                    {sub.studentName?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{sub.activityTitle}</h3>
                    <p className="text-sm text-gray-500">Estudiante: {sub.studentName}</p>
                    <p className="text-xs text-blue-500 mt-1 font-medium">{sub.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">
                    Ver Archivo
                  </a>
                  <button className="px-4 py-2 bg-[#111827] text-white rounded-xl text-sm font-bold">
                    Calificar
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  activity.submission ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                )}>
                  {activity.submission ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-500 leading-snug max-w-md">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {activity.lessonTitle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha de Entrega</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(activity.dueDate).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => !activity.submission && handleOpenSubmission(activity.id, activity.title)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                    activity.submission 
                      ? "bg-green-600 text-white cursor-default" 
                      : "bg-[#111827] text-white hover:bg-gray-800"
                  )}
                >
                  {activity.submission ? 'Entregada' : 'Entregar Tarea'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <SubmissionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityTitle={selectedActivity?.title || ''}
        onSubmit={handleFileUpload}
      />
    </div>
  );
};

const SettingsPageWrapper = () => {
  const { user, userProfile } = useAuth();
  const isTeacher = userProfile?.role === 'teacher';
  
  const handleSeed = async () => {
    if (!user) return;
    const { seedDatabase } = await import('./services/seedService');
    await seedDatabase(user.uid);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Configuración</h1>
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">{isTeacher ? 'Perfil del Docente' : 'Perfil del Estudiante'}</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
              <input type="text" defaultValue={userProfile?.displayName || user?.displayName || ""} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Correo</label>
              <input type="email" disabled defaultValue={user?.email || ""} className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tu Rol</label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700">
                {isTeacher ? '👨‍🏫 Docente / Administrador' : '🎓 Estudiante'}
              </div>
            </div>
          </div>
        </div>

        {isTeacher && (
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4">Administración de Contenidos</h3>
            <p className="text-sm text-gray-500 mb-4">Solo tú puedes ver esto. Usa esta opción para cargar las lecciones de demostración.</p>
            <button 
              onClick={handleSeed}
              className="w-full py-3 border-2 border-[#111827] text-[#111827] font-bold rounded-xl hover:bg-[#111827] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              Poblar Base de Datos Demo
            </button>
          </div>
        )}
        
        <button className="w-full py-4 bg-[#111827] text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors">
          Guardar cambios de perfil
        </button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-[#111827] animate-pulse" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cargando Aula...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clases" element={<LessonsPage />} />
          <Route path="/actividades" element={<ActivitiesPage />} />
          <Route path="/configuracion" element={<SettingsPageWrapper />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
