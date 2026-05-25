import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Route,
  BookOpen,
  Code2,
  Timer,
  FileText,
  Briefcase,
  Target,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/timeline', icon: Route, label: 'Timeline' },
  { to: '/resources', icon: BookOpen, label: 'Resources' },
  { to: '/dsa', icon: Code2, label: 'DSA' },
  { to: '/session', icon: Timer, label: 'Session' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/applications', icon: Briefcase, label: 'Apps' },
  { to: '/readiness', icon: Target, label: 'Readiness' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-surface-border bg-surface-card lg:flex">
        <div className="border-b border-surface-border p-6">
          <h1 className="font-display text-xl font-bold text-sprint-400">Placement Sprint</h1>
          <p className="mt-1 text-xs text-slate-400">60-day placement OS</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-sprint-600/20 text-sprint-300'
                    : 'text-slate-400 hover:bg-surface hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-surface-border p-4">
          <NavLink
            to="/profile"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-surface"
          >
            <User size={18} />
            {user?.name}
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="relative h-full w-72 bg-surface-card p-4"
          >
            <button type="button" className="mb-4" onClick={() => setMobileOpen(false)}>
              <X />
            </button>
            {nav.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    isActive ? 'bg-sprint-600/20 text-sprint-300' : 'text-slate-400'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </motion.aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-surface-border bg-surface-card px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>
          <span className="font-display font-semibold text-sprint-400">Placement Sprint</span>
          <NavLink to="/profile">
            <User size={20} />
          </NavLink>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
