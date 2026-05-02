import { Layout } from './components/Layout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LessonsPage } from './pages/Lessons';
import { BookOpen, TrendingUp, Users, Star, CheckCircle2, Clock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import { MOCK_LESSONS } from './data';
import { useState } from 'react';
import { SubmissionModal } from './components/SubmissionModal';
import { AuthProvider, useAuth } from './services/AuthContext';

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
  
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{roleLabel} {name} 👋</h1>
          <p className="text-gray-500 mt-2 text-lg">Bienvenido de nuevo a tu aula interactiva.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900">24</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-gray-400">Estudiantes</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-gray-900">4</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-gray-400">Clases hoy</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Promedio General', val: '4.2', icon: <TrendingUp className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Participación', val: '88%', icon: <Users className="text-green-500" />, bg: 'bg-green-50' },
          { label: 'Tareas Entregadas', val: '12', icon: <Star className="text-orange-500" />, bg: 'bg-orange-50' },
          { label: 'Lecciones Activas', val: '8', icon: <BookOpen className="text-purple-500" />, bg: 'bg-purple-50' },
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
               <h3 className="text-3xl font-bold mt-2">Genética Mendeliana</h3>
               <p className="mt-4 text-gray-400 max-w-sm">Mañana a las 8:00 AM • Laboratorio de Ciencias • 24 Estudiantes confirmados</p>
               <button className="mt-8 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                 Preparar Material
               </button>
             </div>
             <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
             <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-bold text-gray-900">Anuncios Rápidos</h2>
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm font-medium text-gray-900">Recuerden el examen final</p>
                <p className="text-xs text-gray-500 mt-1">Publicado hace 2 horas</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm font-medium text-gray-900">Nuevos PDFs en Bio Celular</p>
                <p className="text-xs text-gray-500 mt-1">Publicado hace 1 día</p>
              </div>
              <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
                + Nuevo Anuncio
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ActivitiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{ id: string; title: string } | null>(null);
  const [activities, setActivities] = useState(
    MOCK_LESSONS.flatMap(l => l.activities.map(a => ({ ...a, lessonTitle: l.title })))
  );

  const handleOpenSubmission = (id: string, title: string) => {
    setSelectedActivity({ id, title });
    setIsModalOpen(true);
  };

  const handleFileUpload = (file: File) => {
    if (!selectedActivity) return;
    
    // Actualizar localmente el estado como completado
    setActivities(prev => prev.map(a => 
      a.id === selectedActivity.id ? { ...a, status: 'completed' as const } : a
    ));
    
    console.log(`Archivo ${file.name} entregado para ${selectedActivity.title}`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Actividades</h1>
        <p className="text-gray-500 mt-2 text-lg">Seguimiento de tareas y evaluaciones pendientes.</p>
      </header>

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
                activity.status === 'completed' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
              )}>
                {activity.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
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
                onClick={() => activity.status !== 'completed' && handleOpenSubmission(activity.id, activity.title)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  activity.status === 'completed' 
                    ? "bg-green-600 text-white cursor-default" 
                    : "bg-[#111827] text-white hover:bg-gray-800"
                )}
               >
                 {activity.status === 'completed' ? 'Tarea Entregada' : 'Entregar Tarea'}
               </button>
            </div>
          </motion.div>
        ))}
      </div>

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
  const { user } = useAuth();
  
  const handleSeed = async () => {
    if (!user) return;
    const { seedDatabase } = await import('./services/seedService');
    await seedDatabase(user.uid);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Configuración del Aula</h1>
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">Perfil del Docente</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
              <input type="text" defaultValue={user?.displayName || "Prof. Jaider Sebastián"} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Correo Institucional</label>
              <input type="email" defaultValue={user?.email || "moreno@escuela.edu"} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">Administración</h3>
          <p className="text-sm text-gray-500 mb-4">Usa esta opción para cargar las lecciones de demostración en tu base de datos de Firebase.</p>
          <button 
            onClick={handleSeed}
            className="w-full py-3 border-2 border-[#111827] text-[#111827] font-bold rounded-xl hover:bg-[#111827] hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <BookOpen size={18} />
            Poblar Base de Datos Demo
          </button>
        </div>
        
        <button className="w-full py-4 bg-[#111827] text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors">
          Guardar Cambios
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
