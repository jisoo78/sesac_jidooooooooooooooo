import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Info, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  AlertCircle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Wind,
  Settings,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PLANTS, COLORS } from '../constants';
import { Status, Plant } from '../types';
import { apiGet } from '../lib/api';

const MapView = ({ onPlantClick }: { onPlantClick: (id: string) => void }) => {
  const [plants, setPlants] = useState<Plant[]>(PLANTS);
  const [hoveredPlant, setHoveredPlant] = useState<Plant | null>(null);

  useEffect(() => {
    apiGet<Plant[]>('/dashboard/plants')
      .then(setPlants)
      .catch(() => setPlants(PLANTS));
  }, []);

  // Precise SVG scaling for South Korea lat/lng projection
  const getCoords = (lat: number, lng: number) => {
    const x = (lng - 124) * 110 + 20;
    const y = (38.8 - lat) * 150 + 20;
    return { x, y };
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'normal': return COLORS.normal;
      case 'caution': return COLORS.caution;
      default: return COLORS.none;
    }
  };

  // Split plants for left and right cards as per image
  const leftPlants = plants.filter(p => ['김포', '서인천', '태안'].includes(p.id));
  const rightPlants = plants.filter(p => ['평택', '군산'].includes(p.id));

  const PlantCard = ({ plant, side }: { plant: Plant, side: 'left' | 'right' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-card border border-border p-5 rounded-2xl w-72 shadow-xl relative transition-all cursor-pointer",
        hoveredPlant?.id === plant.id ? "border-blue-500 ring-1 ring-blue-500/30" : ""
      )}
      onMouseEnter={() => setHoveredPlant(plant)}
      onMouseLeave={() => setHoveredPlant(null)}
      onClick={() => onPlantClick(plant.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h3 className="font-bold text-base text-text-main">{plant.name}</h3>
        </div>
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-sm",
          plant.status === 'normal' ? "bg-green-500/5 border-green-500/20 text-green-500" : "bg-yellow-500/5 border-yellow-500/20 text-yellow-500"
        )}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
          <span className="text-[9px] font-black uppercase tracking-widest">{plant.status}</span>
        </div>
      </div>
      <div className="space-y-2 text-[11px] text-text-dim">
        <div className="flex gap-2">
          <span className="w-16">위치:</span>
          <span className="text-text-main flex-1 font-medium">{plant.address}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-16">설비용량:</span>
          <span className="text-text-main font-bold font-mono">{plant.capacity}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-16">발전대수:</span>
          <span className="text-text-main font-bold font-mono">{plant.generatorsCount}대</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-muted hover:bg-blue-600 text-text-main hover:text-white text-[10px] font-bold py-2 rounded-lg transition-all uppercase border border-border">
          상세보기
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="relative h-[calc(100vh-120px)] w-full flex items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-border h-full" />
          ))}
        </div>
      </div>

      {/* Left Column Cards */}
      <div className="absolute left-10 top-0 bottom-0 flex flex-col justify-center gap-12 z-20">
        {leftPlants.map(plant => (
          <PlantCard key={plant.id} plant={plant} side="left" />
        ))}
      </div>

      {/* Center Map */}
      <div className="relative flex items-center justify-center -mt-20">
        <svg width="600" height="800" viewBox="0 0 600 800" className="relative drop-shadow-2xl">
          {/* Detailed Korea Outline */}
          <path
            d="M217.5,15.5 L225,18 L232,12 L245,15 L255,25 L265,22 L275,28 L285,25 L295,35 L305,32 L315,45 L320,55 L335,70 L345,65 L350,80 L340,95 L345,110 L355,125 L348,140 L355,155 L365,165 L375,185 L385,195 L378,215 L385,235 L392,265 L395,300 L405,335 L408,375 L415,415 L435,465 L430,495 L445,515 L438,545 L425,565 L405,585 L385,605 L365,615 L345,622 L315,618 L295,610 L275,612 L255,605 L235,595 L220,575 L205,555 L195,540 L185,550 L175,542 L168,525 L175,510 L185,495 L178,475 L165,465 L155,455 L148,435 L158,415 L165,395 L155,375 L145,355 L152,335 L140,315 L148,295 L152,265 L145,245 L155,225 L165,195 L158,165 L165,135 L175,115 L182,95 L175,75 L185,55 L205,35 L217.5,15.5 Z"
            fill="currentColor"
            className="text-muted"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Jeju Island */}
          <path
            d="M195,660 Q215,650 245,665 Q215,685 185,675 L195,660 Z"
            fill="currentColor"
            className="text-muted"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Ulleungdo & Dokdo */}
          <circle cx="480" cy="240" r="5" fill="currentColor" className="text-muted" />
          <circle cx="510" cy="255" r="2" fill="currentColor" className="text-muted" />
          
          {/* Coastal Details (Small Islands/Indents) */}
          <path d="M140,480 L135,485 L140,490 Z" fill="currentColor" className="text-muted opacity-40" />
          <path d="M130,510 L125,515 L130,520 Z" fill="currentColor" className="text-muted opacity-40" />
          <path d="M220,620 L225,625 L215,625 Z" fill="currentColor" className="text-muted opacity-40" />

          {/* Connectors & Markers */}
          {plants.map(plant => {
            const { x, y } = getCoords(plant.lat, plant.lng);
            const isHovered = hoveredPlant?.id === plant.id;
            const side = ['김포', '서인천', '태안'].includes(plant.id) ? 'left' : 'right';
            
            // Dynamic connector path based on card position
            // Left cards are at x=10, Right cards are at x=right-10
            // Simplified logic: draw from marker to card edge
            const cardX = side === 'left' ? 120 : 480; 
            
            return (
              <g key={plant.id} className="cursor-pointer" onClick={() => onPlantClick(plant.id)}>
                {/* Connector Line */}
                <motion.path
                  d={`M ${x} ${y} L ${cardX} ${y}`}
                  stroke="#3b82f6"
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray="4 4"
                  fill="none"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: isHovered ? 0.8 : 0.3 }}
                  className="pointer-events-none"
                />
                
                {/* Simple Circle Marker */}
                <motion.g
                  initial={false}
                  onMouseEnter={() => setHoveredPlant(plant)}
                  onMouseLeave={() => setHoveredPlant(null)}
                  className="cursor-pointer"
                >
                  {/* Outer Glow / Halo */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 20 : 0}
                    fill="#3b82f6"
                    opacity={0.1}
                    animate={{ r: isHovered ? 22 : 0 }}
                  />
                  
                  {/* Main Circle - Unified Color */}
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth={isHovered ? 3 : 2}
                    animate={{ 
                      r: isHovered ? 13 : 9,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 12px rgba(59, 130, 246, 0.5))` : 'none'
                    }}
                  />
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Right Column Cards */}
      <div className="absolute right-10 top-0 bottom-0 flex flex-col justify-center gap-12 z-20">
        {rightPlants.map(plant => (
          <PlantCard key={plant.id} plant={plant} side="right" />
        ))}
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-card border border-border p-3 rounded-xl flex items-center gap-4 z-30 shadow-xl transition-colors duration-300 scale-[0.8] origin-top-right">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.4)]" />
          <span className="text-[10px] font-bold text-text-main uppercase tracking-widest">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFD600] shadow-[0_0_8px_rgba(255,214,0,0.4)]" />
          <span className="text-[10px] font-bold text-text-main uppercase tracking-widest">Caution</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
