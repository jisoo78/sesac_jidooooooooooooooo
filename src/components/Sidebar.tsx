import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  Map as MapIcon, 
  Settings, 
  Shield, 
  Bell, 
  User, 
  Menu, 
  X,
  ChevronRight,
  Database,
  Cpu,
  Mail,
  Slack,
  MessageSquare,
  BarChart3,
  Thermometer,
  Zap,
  Waves
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Status, Plant, User as UserType } from '../types';
import { COLORS } from '../constants';

const Sidebar = ({ 
  activeTab, 
  setActiveTab,
  isExpanded,
  setIsExpanded
}: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  isExpanded: boolean,
  setIsExpanded: (expanded: boolean) => void
}) => {
  const menuItems = [
    { id: 'map', icon: MapIcon, label: '관제 지도' },
    { id: 'monitoring', icon: Activity, label: '설비 모니터링' },
    { id: 'alerts', icon: Bell, label: '이상 징후 이력' },
    { id: 'rag', icon: MessageSquare, label: 'AI 분석' },
    { id: 'admin', icon: Shield, label: '유저 관리' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isExpanded ? 256 : 80 }}
      className="bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300 overflow-hidden"
    >
      <div className={cn(
        "p-6 border-b border-border flex items-center justify-between",
        !isExpanded && "px-5"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
            <Zap className="text-white w-6 h-6 fill-white/20" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-text-main font-black text-xl tracking-tighter leading-none">KOWEPO</span>
                <span className="text-blue-500 font-bold text-[10px] tracking-widest mt-0.5">VIBRATION EMS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {isExpanded && (
          <button 
            onClick={() => setIsExpanded(false)}
            className="p-1.5 hover:bg-muted rounded-lg text-text-dim hover:text-text-main transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isExpanded && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => setIsExpanded(true)}
            className="p-2 hover:bg-muted rounded-xl text-text-dim hover:text-text-main transition-colors border border-border/50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
        <ul className={cn("px-4 space-y-1.5", !isExpanded && "px-3")}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all text-sm font-bold",
                  isExpanded ? "gap-3 px-4 py-3" : "justify-center p-3",
                  activeTab === item.id 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                    : "text-text-dim hover:bg-muted hover:text-text-main"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", activeTab === item.id ? "text-white" : "text-text-dim")} />
                {isExpanded && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={cn("p-4 border-t border-border", !isExpanded && "p-2")}>
        <div className={cn(
          "bg-muted rounded-2xl flex items-center gap-3 border border-border/50 transition-all",
          isExpanded ? "p-4" : "p-2 justify-center"
        )}>
          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0 border border-blue-500/20">
            <User className="text-blue-500 w-5 h-5" />
          </div>
          {isExpanded && (
            <div className="flex-1 overflow-hidden">
              <p className="text-text-main text-xs font-bold truncate tracking-tight">김태안 차장</p>
              <p className="text-text-dim text-[10px] font-medium truncate">발전부 운영팀</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
