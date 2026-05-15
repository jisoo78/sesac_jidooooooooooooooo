import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine 
} from 'recharts';
import { 
  ArrowLeft, 
  Cpu, 
  Activity, 
  Thermometer, 
  Zap, 
  Waves, 
  Gauge, 
  ChevronRight,
  Maximize2,
  Bell,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
  X as CloseIcon,
  TrendingUp,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { PLANTS, COLORS } from '../constants';
import { Status, Generator, Asset, Sensor } from '../types';
import RAGView from './RAGView';
import { apiGet } from '../lib/api';

// Mock Generator for Monitoring
const getMockGenerators = (plantId: string): Generator[] => {
  const fuelTypes = ['유연탄', 'LNG', '신재생', '소수력'];
  return Array.from({ length: 4 }).map((_, i) => {
    const totalAssets = 5 + Math.floor(Math.random() * 5);
    const faultyAssets = i === 2 ? 3 : 0;
    return {
      id: `G-${plantId}-${i + 1}`,
      plantId,
      name: `${plantId} #${i + 1} 발전기`,
      fuelType: fuelTypes[i % fuelTypes.length],
      status: faultyAssets > 0 ? 'caution' : 'normal',
      isOperating: i !== 3,
      maxMse: 0.12 + Math.random() * 0.5,
      alertCount: faultyAssets,
      loadFactor: 85 + Math.random() * 10,
      totalAssets,
      faultyAssets
    };
  });
};

const getMockAssets = (generatorId: string): Asset[] => {
  return [
    { 
      id: 'asm-1', generatorId, name: 'MAC A', mse: 0.24, status: 'normal', lastUpdated: new Date().toISOString(), 
      current: 450, tempNDE: 68.5, tempDE: 66.2, vibNDE1: 3.2, vibNDE2: 3.1, vibDE1: 2.8, vibDE2: 2.9 
    },
    { 
      id: 'asm-2', generatorId, name: 'MAC B', mse: 0.15, status: 'normal', lastUpdated: new Date().toISOString(), 
      current: 448, tempNDE: 67.2, tempDE: 65.8, vibNDE1: 2.8, vibNDE2: 2.7, vibDE1: 2.5, vibDE2: 2.6 
    },
    { 
      id: 'asm-3', generatorId, name: 'BAC', mse: 0.85, status: 'caution', lastUpdated: new Date().toISOString(), 
      current: 485, tempNDE: 82.4, tempDE: 78.5, vibNDE1: 7.5, vibNDE2: 6.8, vibDE1: 5.2, vibDE2: 5.4 
    },
    { 
      id: 'asm-4', generatorId, name: 'DGAN', mse: 0.12, status: 'normal', lastUpdated: new Date().toISOString(), 
      current: 442, tempNDE: 65.8, tempDE: 64.2, vibNDE1: 2.4, vibNDE2: 2.3, vibDE1: 2.1, vibDE2: 2.2 
    },
    { 
      id: 'asm-5', generatorId, name: 'VHP', mse: 0.08, status: 'normal', lastUpdated: new Date().toISOString(), 
      current: 445, tempNDE: 66.1, tempDE: 64.5, vibNDE1: 2.1, vibNDE2: 2.0, vibDE1: 1.9, vibDE2: 2.0 
    },
  ];
};

const getDetailedMockData = (baseValue: number, variance: number, points: number = 60) => {
  return Array.from({ length: points }).map((_, i) => ({
    time: `${i}m`,
    value: baseValue + (Math.random() - 0.5) * variance
  }));
};

const MiniChart = ({ data, color, height = 40, threshold }: { data: any[], color: string, height?: number, threshold?: number }) => (
  <div style={{ height }} className="w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id={`color-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          fontSize={8} 
          tick={{ fill: 'var(--text-dim)', opacity: 0.5 }}
          interval={19} 
          minTickGap={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          fontSize={8} 
          tick={{ fill: 'var(--text-dim)', opacity: 0.5 }}
          width={25}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px',
            fontSize: '9px',
            padding: '4px 8px'
          }}
          labelStyle={{ color: 'var(--text-dim)', marginBottom: '2px' }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fillOpacity={1} 
          fill={`url(#color-${color.replace('#', '')})`} 
          strokeWidth={2}
          isAnimationActive={false}
        />
        {threshold !== undefined && (
          <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const GraphCard = ({ title, subTitle, data, color, threshold, value, unit, height = 200, onClick }: { title: string, subTitle?: string, data: any[], color: string, threshold?: number, value?: number | string, unit?: string, height?: number, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-card border border-border p-4 rounded-xl flex flex-col gap-4 shadow-sm transition-all",
      onClick ? "cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 group" : ""
    )} 
    style={{ height }}
  >
    <div className="flex justify-between items-start px-1">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5">
          <h5 className="text-[10px] font-black text-text-dim uppercase tracking-widest leading-none opacity-60">{title}</h5>
          {onClick && <Maximize2 className="w-2.5 h-2.5 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
        {subTitle && <p className="text-[11px] font-black text-text-main uppercase tracking-tight">{subTitle}</p>}
      </div>
      <div className="text-right flex flex-col items-end">
        {value !== undefined && (
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-xl font-black font-mono leading-none",
              threshold && Number(value) > threshold ? "text-red-500" : "text-text-main"
            )}>{value}</span>
            <span className="text-[9px] text-text-dim font-bold uppercase">{unit}</span>
          </div>
        )}
        {threshold !== undefined && <span className="text-[8px] text-red-500/50 font-bold uppercase mt-1">Limit: {threshold}</span>}
      </div>
    </div>
    <div className="flex-1 shrink-0 mt-auto">
      <MiniChart data={data} color={color} height={height - 80} threshold={threshold} />
    </div>
  </div>
);

const DetailIndicator = ({ title, subTitle, value, unit, status, threshold, icon: Icon }: { title: string, subTitle: string, value: number | string, unit: string, status: Status, threshold?: number, icon: any }) => (
  <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all group">
    <div className="flex items-center gap-4">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
        status === 'normal' ? "bg-green-500/5 border-green-500/10" : "bg-yellow-500/5 border-yellow-500/10"
      )}>
        <Icon className={cn(
          "w-5 h-5", 
          status === 'normal' ? "text-green-500" : "text-yellow-500"
        )} />
      </div>
      <div>
        <p className="text-[9px] text-text-dim font-black uppercase tracking-widest opacity-60 leading-none mb-1">{title}</p>
        <h5 className="text-xs font-black text-text-main uppercase tracking-tight">{subTitle}</h5>
      </div>
    </div>
    <div className="text-right">
      <div className="flex items-baseline justify-end gap-1.5">
        <span className={cn(
          "text-xl font-black font-mono leading-none",
          threshold && Number(value) > threshold ? "text-red-500" : "text-text-main"
        )}>{value}</span>
        <span className="text-[10px] text-text-dim font-bold uppercase">{unit}</span>
      </div>
      <div className={cn(
        "mt-1 px-2 py-0.5 rounded-full inline-block text-[8px] font-black uppercase tracking-widest border",
        status === 'normal' ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      )}>
        {status}
      </div>
    </div>
  </div>
);

const getMockSensors = (assetId: string): Sensor[] => {
  return [
    { id: 's1', assetId, name: 'Vib_X', tag: 'KWP_TIA_G3_M_VIBX_001', unit: 'mm/s', currentValue: 3.2, prevValue: 3.1, changeRate: 3.2, status: 'normal', thresholds: { caution: 5.0 }, dataQuality: 'good' },
    { id: 's2', assetId, name: 'Vib_Y', tag: 'KWP_TIA_G3_M_VIBY_001', unit: 'mm/s', currentValue: 4.8, prevValue: 4.5, changeRate: 6.6, status: 'caution', thresholds: { caution: 5.0 }, dataQuality: 'good' },
    { id: 's3', assetId, name: 'Temp', tag: 'KWP_TIA_G3_M_TEMP_001', unit: '°C', currentValue: 72.5, prevValue: 71.8, changeRate: 1.0, status: 'caution', thresholds: { caution: 65.0 }, dataQuality: 'good' },
    { id: 's4', assetId, name: 'Current', tag: 'KWP_TIA_G3_M_AMP_001', unit: 'A', currentValue: 450, prevValue: 445, changeRate: 1.1, status: 'normal', thresholds: { caution: 500 }, dataQuality: 'good' },
  ];
};

const MonitoringView = ({ plantId }: { plantId: string | null }) => {
  const [viewState, setViewState] = useState<'gen' | 'asset' | 'sensor' | 'rag'>('gen');
  const [selectedGen, setSelectedGen] = useState<Generator | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'vibration' | 'temp' | 'current'>('vibration');
  const [selectedDetailGraph, setSelectedDetailGraph] = useState<{ title: string, data: any[], color: string, threshold?: number, unit: string } | null>(null);
  const [plants, setPlants] = useState(PLANTS);
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  
  const targetPlant = useMemo(() => plants.find(p => p.id === plantId) || plants[0] || PLANTS[0], [plants, plantId]);
  const sensors = useMemo(() => selectedAsset ? getMockSensors(selectedAsset.id) : [], [selectedAsset]);

  const [graphData, setGraphData] = useState<any[]>([]);

  useEffect(() => {
    apiGet<typeof PLANTS>('/dashboard/plants')
      .then(setPlants)
      .catch(() => setPlants(PLANTS));
  }, []);

  useEffect(() => {
    if (!targetPlant) return;

    setSelectedGen(null);
    setSelectedAsset(null);
    setViewState('gen');
    setAssets([]);

    apiGet<Generator[]>(`/dashboard/plants/${encodeURIComponent(targetPlant.id)}/generators`)
      .then(setGenerators)
      .catch(() => setGenerators(getMockGenerators(targetPlant.id)));
  }, [targetPlant?.id]);

  useEffect(() => {
    if (!selectedGen) {
      setAssets([]);
      return;
    }

    setSelectedAsset(null);
    apiGet<Asset[]>(`/dashboard/generators/${encodeURIComponent(selectedGen.id)}/assets`)
      .then(setAssets)
      .catch(() => setAssets(getMockAssets(selectedGen.id)));
  }, [selectedGen]);

  useEffect(() => {
    // Mock 1-minute renewal data
    const generateData = () => {
      const data = Array.from({ length: 20 }).map((_, i) => ({
        time: `${i}:00`,
        vibX: 2 + Math.random() * 2,
        vibY: 2 + Math.random() * 3,
        temp: 65 + Math.random() * 10,
        current: 440 + Math.random() * 20,
        mse: 0.1 + Math.random() * 0.4
      }));
      setGraphData(data);
    };
    generateData();
    const timer = setInterval(generateData, 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'normal': return '#00C853';
      case 'caution': return '#FFD600';
      default: return '#757575';
    }
  };

  const renderBreadcrumbs = () => (
    <div className="flex items-center gap-2 mb-6 text-xs font-medium">
      <button onClick={() => { setViewState('gen'); setSelectedGen(null); }} className="text-text-dim hover:text-text-main transition-colors">{targetPlant.name}</button>
      {selectedGen && (
        <>
          <ChevronRight className="w-3 h-3 text-border" />
          <button onClick={() => { setViewState('asset'); setSelectedAsset(null); }} className="text-text-dim hover:text-text-main transition-colors">{selectedGen.name}</button>
        </>
      )}
      {selectedAsset && (
        <>
          <ChevronRight className="w-3 h-3 text-border" />
          <span className="text-blue-500 font-bold">{selectedAsset.name}</span>
        </>
      )}
    </div>
  );

  const renderGeneratorList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {generators.map((gen) => (
        <motion.div
          key={gen.id}
          whileHover={{ y: -4 }}
          onClick={() => { setSelectedGen(gen); setViewState('asset'); }}
          className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-blue-500/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <h3 className="text-text-main font-bold text-sm group-hover:text-blue-500 transition-colors">{gen.name}</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-text-dim font-bold uppercase">이상 부품</p>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-3xl font-black font-mono", gen.faultyAssets > 0 ? "text-red-500" : "text-green-600 dark:text-green-400")}>{gen.faultyAssets}</span>
                  <span className="text-text-dim font-bold text-lg">/ {gen.totalAssets}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-text-dim font-bold uppercase">상태 진단</p>
                <p className={cn("text-sm font-bold", gen.status === 'normal' ? "text-green-500" : "text-red-500")}>
                  {gen.status === 'normal' ? '정상 운영' : '이상 감지'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center text-[10px]">
              <span className="text-text-dim font-medium bg-muted px-2 py-0.5 rounded">{gen.fuelType}</span>
              <span className="text-blue-500 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">실시간 모니터링 <ChevronRight className="w-3 h-3" /></span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAssetList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset, i) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => { setSelectedAsset(asset); setViewState('sensor'); }}
          className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:shadow-xl hover:border-blue-500/50 transition-all group relative overflow-hidden"
        >
          {/* Subtle Background Accent */}
          <div className={cn(
            "absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-[0.03] transition-transform duration-500 group-hover:scale-110",
            asset.status === 'normal' ? "text-green-500" : "text-red-500"
          )}>
            <Cpu className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-blue-500/10 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-text-main font-black text-lg tracking-tight group-hover:text-blue-500 transition-colors uppercase">{asset.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] text-text-dim font-bold uppercase tracking-widest opacity-60">Status: {asset.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <p className="text-[10px] text-text-dim font-bold uppercase mb-1">이상 점수</p>
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    "text-2xl font-black font-mono tracking-tighter",
                    asset.mse > 0.5 ? "text-red-500" : "text-text-main"
                  )}>{(asset.mse * 100).toFixed(0)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 group/btn">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover/btn:translate-x-1 transition-transform">실시간 분석</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderSensorDetail = () => {
    if (!selectedAsset) return null;

    const mseData = getDetailedMockData(selectedAsset.mse * 100, 10);
    const currentData = getDetailedMockData(selectedAsset.current ?? 450, 20);
    const tempNDEData = getDetailedMockData(selectedAsset.tempNDE ?? 68, 5);
    const tempDEData = getDetailedMockData(selectedAsset.tempDE ?? 66, 5);
    const vibNDE1Data = getDetailedMockData(selectedAsset.vibNDE1 ?? 3.2, 0.5);
    const vibNDE2Data = getDetailedMockData(selectedAsset.vibNDE2 ?? 3.1, 0.5);
    const vibDE1Data = getDetailedMockData(selectedAsset.vibDE1 ?? 2.8, 0.5);
    const vibDE2Data = getDetailedMockData(selectedAsset.vibDE2 ?? 2.9, 0.5);

    return (
      <div className="flex flex-col gap-8 pb-10 h-full max-h-[calc(100vh-180px)]">
        {/* Detail View Modal */}
        <AnimatePresence>
          {selectedDetailGraph && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedDetailGraph(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-600/10 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-text-main uppercase tracking-tight">{selectedDetailGraph.title}</h3>
                        <span className="text-[10px] bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded font-black tracking-widest">REAL-TIME</span>
                      </div>
                      <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mt-1 opacity-70">Detailed Sensor Telemetry & AI Diagnostic View</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDetailGraph(null)}
                    className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                  >
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                      <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">현재값</p>
                      <p className="text-2xl font-black font-mono text-text-main">
                        {selectedDetailGraph.data[selectedDetailGraph.data.length - 1]?.value.toFixed(2)}
                        <span className="text-xs text-text-dim ml-1 font-sans">{selectedDetailGraph.unit}</span>
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                      <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">최대값 (MAX)</p>
                      <p className="text-2xl font-black font-mono text-red-500">
                        {Math.max(...selectedDetailGraph.data.map(d => d.value)).toFixed(2)}
                        <span className="text-xs text-text-dim ml-1 font-sans">{selectedDetailGraph.unit}</span>
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                      <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">평균값 (AVG)</p>
                      <p className="text-2xl font-black font-mono text-blue-500">
                        {(selectedDetailGraph.data.reduce((a, b) => a + b.value, 0) / selectedDetailGraph.data.length).toFixed(2)}
                        <span className="text-xs text-text-dim ml-1 font-sans">{selectedDetailGraph.unit}</span>
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                      <p className="text-[10px] text-text-dim font-black uppercase tracking-widest mb-1">임계치 (LIMIT)</p>
                      <p className="text-2xl font-black font-mono text-text-dim">
                        {selectedDetailGraph.threshold || '--'}
                        <span className="text-xs text-text-dim ml-1 font-sans">{selectedDetailGraph.unit}</span>
                      </p>
                    </div>
                  </div>

                  {/* Main Large Chart */}
                  <div className="flex-1 min-h-[300px] bg-muted/20 border border-border rounded-2xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedDetailGraph.data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={selectedDetailGraph.color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={selectedDetailGraph.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'var(--text-dim)' }} />
                        <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: 'var(--text-dim)' }} width={40} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={selectedDetailGraph.color} 
                          fillOpacity={1} 
                          fill="url(#modalGradient)" 
                          strokeWidth={3}
                          isAnimationActive={true}
                        />
                        {selectedDetailGraph.threshold && (
                          <ReferenceLine 
                            y={selectedDetailGraph.threshold} 
                            stroke="#ef4444" 
                            strokeDasharray="5 5" 
                            label={{ position: 'top', value: 'LIMIT', fill: '#ef4444', fontSize: 10, fontWeight: '900' }} 
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Analysis Note */}
                  <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-text-main uppercase tracking-widest mb-1">AI Diagnostic Insight</h4>
                      <p className="text-[11px] text-text-dim leading-relaxed">
                        해당 센서 데이터는 현재 모델 훈련 데이터 분포 내에 존재합니다. 시계열 분석 결과 최근 10분간의 변동 계수는 {(Math.random() * 5).toFixed(2)}%로 안정적인 상태를 유지하고 있으며, 임계치 위반 가능성은 희박한 것으로 예측됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Summary */}
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-blue-500/10 border-blue-500/20">
              <Cpu className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-text-main tracking-tight uppercase leading-none">{selectedAsset.name} 분석 대시보드</h2>
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                  selectedAsset.status === 'normal' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                )}>
                  {selectedAsset.status}
                </div>
              </div>
              <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest leading-none mt-1.5 opacity-70">Node: {selectedAsset.id} | System Diagnostic Feed</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-text-dim font-black uppercase tracking-widest mb-1 opacity-60">상태 실시간 업데이트</p>
              <div className="flex items-center justify-end gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-mono font-bold text-text-main uppercase">Sync Status: Active</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden sm:block" />
            <button 
              onClick={() => setViewState('rag')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 group"
            >
              <History className="w-3.5 h-3.5 group-hover:rotate-[-20deg] transition-transform" />
              AI분석
            </button>
          </div>
        </div>
 
        {/* Main Content Grid */}
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-border pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Anomaly Score Chart - Now Integrated into Grid as standard size */}
            <div 
              onClick={() => setSelectedDetailGraph({ title: 'Anomaly Score', data: mseData, color: selectedAsset.mse > 0.5 ? "#ef4444" : "#3b82f6", threshold: 50, unit: '%' })}
              className="bg-card border-2 border-blue-500/20 p-4 rounded-xl flex flex-col gap-4 shadow-md cursor-pointer hover:border-blue-500/50 hover:shadow-lg transition-all group" 
              style={{ height: 180 }}
            >
              <div className="flex justify-between items-start px-1">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">이상 점수 분석</h5>
                    <Maximize2 className="w-2.5 h-2.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] font-black text-text-main uppercase tracking-tight mt-0.5">Real-time Score</p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      "text-xl font-black font-mono leading-none",
                      selectedAsset.mse > 0.5 ? "text-red-500" : "text-text-main"
                    )}>{(selectedAsset.mse * 100).toFixed(0)}</span>
                    <span className="text-[9px] text-text-dim font-bold uppercase">%</span>
                  </div>
                  <span className="text-[8px] text-red-500/50 font-bold uppercase mt-1">Limit: 50%</span>
                </div>
              </div>
              <div className="flex-1 shrink-0 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMseMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedAsset.mse > 0.5 ? "#ef4444" : "#3b82f6"} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={selectedAsset.mse > 0.5 ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '9px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={selectedAsset.mse > 0.5 ? "#ef4444" : "#3b82f6"} 
                      fillOpacity={1} 
                      fill="url(#colorMseMain)" 
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                    <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sensor Graphs List */}
            <GraphCard 
              title="Input Current" 
              subTitle="입력 전류 (A)" 
              data={currentData} 
              color="#eab308" 
              threshold={500} 
              value={selectedAsset.current} 
              unit="A" 
              height={180} 
              onClick={() => setSelectedDetailGraph({ title: 'Input Current', data: currentData, color: '#eab308', threshold: 500, unit: 'A' })}
            />
            <GraphCard 
              title="NDE Bearing Temp" 
              subTitle="NDE 온도 (°C)" 
              data={tempNDEData} 
              color="#f97316" 
              threshold={80} 
              value={selectedAsset.tempNDE} 
              unit="°C" 
              height={180} 
              onClick={() => setSelectedDetailGraph({ title: 'NDE Bearing Temp', data: tempNDEData, color: '#f97316', threshold: 80, unit: '°C' })}
            />
            <GraphCard 
              title="DE Bearing Temp" 
              subTitle="DE 온도 (°C)" 
              data={tempDEData} 
              color="#f97316" 
              threshold={80} 
              value={selectedAsset.tempDE} 
              unit="°C" 
              height={180} 
              onClick={() => setSelectedDetailGraph({ title: 'DE Bearing Temp', data: tempDEData, color: '#f97316', threshold: 80, unit: '°C' })}
            />
            <GraphCard 
              title="Vibration NDE1" 
              subTitle="NDE1 진동 (mm/s)" 
              data={vibNDE1Data} 
              color="#3b82f6" 
              threshold={5.0} 
              value={selectedAsset.vibNDE1} 
              unit="mm/s" 
              height={180} 
              onClick={() => setSelectedDetailGraph({ title: 'Vibration NDE1', data: vibNDE1Data, color: '#3b82f6', threshold: 5.0, unit: 'mm/s' })}
            />
            <GraphCard 
              title="Vibration NDE2" 
              subTitle="NDE2 진동 (mm/s)" 
              data={vibNDE2Data} 
              color="#3b82f6" 
              threshold={5.0} 
              value={selectedAsset.vibNDE2} 
              unit="mm/s" 
              height={180} 
              onClick={() => setSelectedDetailGraph({ title: 'Vibration NDE2', data: vibNDE2Data, color: '#3b82f6', threshold: 5.0, unit: 'mm/s' })}
            />
            <GraphCard 
              title="Vibration DE1" 
              subTitle="DE1 진동 (mm/s)" 
              data={vibDE1Data} 
              color="#6366f1" 
              threshold={5.0} 
              value={selectedAsset.vibDE1} 
              unit="mm/s" 
              height={180} 
              onClick={() => setSelectedDetailGraph({ title: 'Vibration DE1', data: vibDE1Data, color: '#6366f1', threshold: 5.0, unit: 'mm/s' })}
            />
            <GraphCard 
              title="Vibration DE2" 
              subTitle="DE2 진동 (mm/s)" 
              data={vibDE2Data} 
              color="#6366f1" 
              threshold={5.0} 
              value={selectedAsset.vibDE2} 
              unit="mm/s" 
              height={180} 
              onClick={() => setSelectedDetailGraph({ title: 'Vibration DE2', data: vibDE2Data, color: '#6366f1', threshold: 5.0, unit: 'mm/s' })}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {renderBreadcrumbs()}
      
      <AnimatePresence mode="wait">
        <motion.div
           key={viewState}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
           className="flex-1"
        >
          {viewState === 'gen' && renderGeneratorList()}
          {viewState === 'asset' && renderAssetList()}
          {viewState === 'sensor' && renderSensorDetail()}
          {viewState === 'rag' && (
            <RAGView 
              initialReportId={
                selectedAsset?.name === 'MAC A' ? 'AL-1095' : 
                selectedAsset?.name === 'BAC' ? 'AL-1092' : 
                selectedAsset?.name === 'VHP' ? 'AL-1101' : 
                null
              } 
              onBack={() => setViewState('sensor')} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MonitoringView;
