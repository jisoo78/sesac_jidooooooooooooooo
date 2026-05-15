/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapView from './components/MapView';
import MonitoringView from './components/MonitoringView';
import AlertView from './components/AlertView';
import RAGView from './components/RAGView';
import AdminView from './components/AdminView';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

// KOWEPO Anomaly Dashboard Main Application
export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <MapView onPlantClick={(id) => {
          setSelectedPlantId(id);
          setActiveTab('monitoring');
        }} />;
      case 'monitoring':
        return <MonitoringView plantId={selectedPlantId} />;
      case 'alerts':
        return <AlertView />;
      case 'rag':
        return <RAGView />;
      case 'admin':
        return <AdminView />;
      default:
        return <MapView onPlantClick={(id) => {
          setSelectedPlantId(id);
          setActiveTab('monitoring');
        }} />;
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'map': return { title: '대한민국 발전소 위치 기반 이상탐지 관제', subtitle: '전국 5대 핵심 발전본부 실시간 통합 모니터링' };
      case 'monitoring': return { title: '설비 상세 모니터링', subtitle: '발전기 및 핵심 부품별 센서 데이터 분석' };
      case 'alerts': return { title: '이상 징후 이력', subtitle: '시스템 감지 알람 및 조치 내역 관리' };
      case 'rag': return { title: 'AI 분석 지능형 가이드', subtitle: '과거 사례 및 매뉴얼 기반 최적 조치 권고' };
      case 'admin': return { title: '유저 및 수신자 관리', subtitle: '권한 관리 및 알림 채널 구성' };
      default: return { title: 'KOWEPO EMS', subtitle: '시스템' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-bg text-text-main transition-colors duration-300 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />
      
      <main className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        isSidebarExpanded ? "pl-64" : "pl-20"
      )}>
        <Header 
          title={headerInfo.title} 
          subtitle={headerInfo.subtitle} 
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        
        <div className="flex-1 p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
