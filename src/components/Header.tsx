import React from 'react';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';

const Header = ({ 
  title, 
  subtitle,
  theme,
  onThemeToggle
}: { 
  title: string, 
  subtitle?: string,
  theme?: 'light' | 'dark',
  onThemeToggle?: () => void
}) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 bg-bg/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex flex-col">
        <h1 className="text-text-main font-bold text-lg tracking-tight">{title}</h1>
        {subtitle && <p className="text-text-dim text-[11px] font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-1.5 focus-within:border-blue-500/50 transition-colors">
          <Search className="w-4 h-4 text-text-dim" />
          <input 
            type="text" 
            placeholder="설비명, 태그 검색..." 
            className="bg-transparent border-none outline-none text-xs text-text-main w-48 placeholder:text-text-dim/50"
          />
        </div>

        <div className="flex items-center gap-4 border-l border-border pl-6">
          <button 
            onClick={onThemeToggle}
            className="p-2.5 bg-muted border border-border rounded-xl text-text-dim hover:text-blue-500 hover:border-blue-500/30 transition-all active:scale-90"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="text-right mr-2">
            <p className="text-text-main text-[11px] font-mono font-bold">{formatDate(time)}</p>
            <p className="text-[#00C853] text-[10px] font-bold flex items-center justify-end gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,200,83,0.4)]" />
              SYSTEM OK
            </p>
          </div>
          
          <button className="relative p-2.5 text-text-dim hover:text-text-main transition-colors bg-muted/50 border border-border rounded-xl">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF3D00] rounded-full border-2 border-bg" />
          </button>
          
          <button className="flex items-center gap-2.5 text-text-dim hover:text-text-main transition-colors px-3 py-1.5 rounded-xl bg-muted border border-border hover:border-blue-500/30">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
