import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardList, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../services/AuthContext';

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

const SidebarItem = ({ to, icon, label }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-[#111827] text-white shadow-lg shadow-gray-200" 
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      )
    }
  >
    <span className="shrink-0">{icon}</span>
    <span className="font-medium">{label}</span>
  </NavLink>
);

export const Layout = ({ children }: { children: ReactNode }) => {
  const { userProfile, logOut } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 z-50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-[#111827] rounded-xl flex items-center justify-center">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
              Aula
            </h1>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Interactiva</span>
          </div>
        </div>

        <div className="px-2 py-4 bg-gray-50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
            <UserIcon className="text-gray-400 w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{userProfile?.displayName || 'Usuario'}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
              {userProfile?.role === 'teacher' ? 'Docente' : 'Estudiante'}
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem to="/clases" icon={<BookOpen size={20} />} label="Mis Clases" />
          <SidebarItem to="/actividades" icon={<ClipboardList size={20} />} label="Actividades" />
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-6">
          <SidebarItem to="/configuracion" icon={<Settings size={20} />} label="Configuración" />
          <button 
            onClick={logOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50/50 transition-colors w-full text-left font-medium"
          >
            <LogOut size={20} />
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
