import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/src/store/useAuthStore';
import { 
  BarChart3, 
  FileText, 
  LogOut, 
  Upload, 
  ShieldCheck,
  Menu,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3, show: user?.role === 'admin' },
    { name: 'Analyze Review', path: '/analyze', icon: FileText, show: true },
    { name: 'Batch Upload', path: '/batch', icon: Upload, show: true },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors duration-500">
      
      <BackgroundParallax />
      {/* Background gradients */}

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-900/80 dark:bg-black/80 backdrop-blur-sm md:hidden transition-colors duration-500" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 glass border-r border-zinc-200 dark:border-white/5 
        transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:static md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-4 h-20 border-b border-zinc-200 dark:border-white/5 transition-colors duration-500">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
               <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white transition-colors duration-500">Veritas</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-200/50 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors"
            title="Toggle Theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkMode ? 360 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.div>
          </button>
        </div>
        
        <div className="flex flex-col h-[calc(100%-5rem)] justify-between py-6 relative z-10">
          <nav className="px-4 space-y-2">
            {navItems.filter(i => i.show).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${
                    isActive
                      ? 'text-indigo-600 dark:text-white'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active" 
                      className="absolute inset-0 bg-indigo-50 dark:bg-white/10 border border-indigo-100 dark:border-white/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 relative z-10 transition-colors ${isActive ? 'text-indigo-500 dark:text-indigo-400' : 'group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="px-4 pt-6">
            <div className="glass-card rounded-2xl p-4 transition-colors duration-500">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center border border-zinc-300 dark:border-white/10 shadow-inner transition-colors duration-500">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase">{user?.name.charAt(0) || 'U'}</span>
                  </div>
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate transition-colors duration-500">{user?.name}</p>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center transition-colors duration-500">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {user?.role === 'admin' ? 'Admin' : 'Student'}
                  </p>
                </div>
              </div>
              <button 
                className="w-full flex items-center justify-center p-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/10 transition-colors duration-300"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header (Mobile mainly) */}
        <header className="glass border-b border-zinc-200 dark:border-white/5 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 md:hidden transition-colors duration-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-zinc-900 dark:text-white transition-colors duration-500">Veritas</span>
          </div>
          <div className="flex items-center gap-2">
            <button
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-zinc-200/50 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors"
               title="Toggle Theme"
             >
               <motion.div
                 initial={false}
                 animate={{ rotate: isDarkMode ? 360 : 0 }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
               >
                 {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </motion.div>
             </button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/10">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main id="main-scroll-container" className="flex-1 overflow-y-auto w-full relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function BackgroundParallax() {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const main = document.getElementById('main-scroll-container');
    if (!main) return;
    const handleScroll = () => scrollY.set(main.scrollTop);
    scrollY.set(main.scrollTop);
    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <div className="fixed inset-[-100px] z-[-1] pointer-events-none overflow-hidden opacity-80">
      <motion.div style={{ y: y1 }} className="absolute top-[0%] right-[0%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
      <motion.div style={{ y: y2 }} className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/20 blur-[140px]" />
      <motion.div style={{ y: y3 }} className="absolute bottom-[0%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
    </div>
  );
}

