import { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Eye, Sparkles, Building2 } from 'lucide-react';
import type { Building3D } from '../services/campusMapApi';

interface Campus3DViewerProps {
  buildings: Building3D[];
  selectedBuilding: Building3D;
  onSelectBuilding: (building: Building3D) => void;
}

interface Building3DStruct {
  id: string;
  name: string;
  code: string;
  color: string;
  roofColor: string;
  x: number; // Isometric X coordinate
  y: number; // Isometric Y coordinate
  width: number;
  length: number;
  height: number;
  floors: number;
  trees?: { x: number; y: number }[];
}

const CAMPUS_BUILDING_MODELS: Building3DStruct[] = [
  {
    id: 'bld-1',
    name: '본관 / 본부동 (A동)',
    code: 'A동',
    color: '#3b82f6',
    roofColor: '#1d4ed8',
    x: 0,
    y: -80,
    width: 140,
    length: 90,
    height: 120,
    floors: 7,
  },
  {
    id: 'bld-2',
    name: '공학관 / IT융합관 (B동)',
    code: 'B동',
    color: '#06b6d4',
    roofColor: '#0e7490',
    x: -160,
    y: 20,
    width: 110,
    length: 120,
    height: 140,
    floors: 8,
  },
  {
    id: 'bld-3',
    name: '중앙도서관 & 체육관 (C동)',
    code: 'C동',
    color: '#8b5cf6',
    roofColor: '#6d28d9',
    x: 150,
    y: 0,
    width: 150,
    length: 100,
    height: 100,
    floors: 5,
  },
  {
    id: 'bld-4',
    name: '명지 국제 기숙사 (D동)',
    code: 'D동',
    color: '#ec4899',
    roofColor: '#be185d',
    x: 20,
    y: 130,
    width: 130,
    length: 80,
    height: 180,
    floors: 12,
  },
];

export default function Campus3DViewer({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: Campus3DViewerProps) {
  // 360 Rotation states (degrees)
  const [rotY, setRotY] = useState(30);
  const [rotX, setRotX] = useState(35);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  // Auto rotate timer
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.4) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Mouse interaction handlers for 360 degree drag rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;

    setRotY((prev) => (prev + deltaX * 0.5) % 360);
    setRotX((prev) => Math.max(10, Math.min(75, prev - deltaY * 0.4)));

    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.6, Math.min(1.8, prev - e.deltaY * 0.0015)));
  };

  const resetCamera = () => {
    setRotY(30);
    setRotX(35);
    setZoom(1);
    setAutoRotate(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-neutral-950 select-none">
      {/* Top 3D Control Bar */}
      <div className="p-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-neutral-900/90 border border-white/10 text-xs font-bold backdrop-blur-md">
          <Sparkles size={16} className="text-blue-400" />
          <span>360° 3D 캠퍼스 입체 지형 렌더러 (WebGL-Style CSS 3D)</span>
        </div>

        {/* Camera Tools */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/90 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              autoRotate ? 'text-blue-400 bg-blue-500/20' : 'text-neutral-400 hover:text-white'
            }`}
            title="360도 자동 회전 (Auto-rotate)"
          >
            <RotateCw size={16} className={autoRotate ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.min(1.8, prev + 0.15))}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="확대 (Zoom In)"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.15))}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="축소 (Zoom Out)"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={resetCamera}
            className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="카메라 리셋"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Interactive 360 Rotatable WebGL / CSS 3D Scene View */}
      <div
        className="relative w-full flex-1 cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* 3D Scene Canvas */}
        <div
          className="relative transition-transform duration-75 ease-out"
          style={{
            perspective: '1400px',
            transform: `scale(${zoom})`,
          }}
        >
          {/* Rotating Ground Plane */}
          <div
            className="relative w-[650px] h-[650px] rounded-full border border-blue-500/20 shadow-[0_0_100px_rgba(37,99,235,0.25)] flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
              background: 'radial-gradient(circle, rgba(15,23,42,0.9) 0%, rgba(10,10,10,0.98) 75%)',
            }}
          >
            {/* Grid & Campus Roads */}
            <div
              className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(59,130,246,0.4) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(59,130,246,0.4) 1.5px, transparent 1.5px)`,
                backgroundSize: '36px 36px',
              }}
            />

            {/* Campus Road Network SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
              <circle cx="325" cy="325" r="220" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 8" />
              <line x1="325" y1="50" x2="325" y2="600" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50" y1="325" x2="600" y2="325" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Campus Trees Decor */}
            {[-120, -40, 60, 140].map((offset, idx) => (
              <div
                key={idx}
                className="absolute w-4 h-4 rounded-full bg-emerald-500/40 border border-emerald-400/60 shadow-lg shadow-emerald-500/20"
                style={{
                  transform: `translate3d(${offset}px, ${offset * 0.8}px, 5px)`,
                }}
              />
            ))}

            {/* 3D Buildings Rendered Procedurally */}
            {CAMPUS_BUILDING_MODELS.map((bldStruct) => {
              const matchedBuilding = buildings.find((b) => b.id === bldStruct.id) || buildings[0];
              const isSelected = selectedBuilding.id === matchedBuilding.id;

              return (
                <div
                  key={bldStruct.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBuilding(matchedBuilding);
                  }}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `calc(50% + ${bldStruct.x}px)`,
                    top: `calc(50% + ${bldStruct.y}px)`,
                    transformStyle: 'preserve-3d',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* 3D Block Prism with Front/Side/Top Glass Walls */}
                  <div
                    className={`relative transition-all duration-300 ${
                      isSelected ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    style={{
                      width: bldStruct.width,
                      height: bldStruct.length,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Front Glass Wall */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-white/20 transition-all duration-300 flex flex-col justify-between p-2 shadow-2xl backdrop-blur-md"
                      style={{
                        height: bldStruct.height,
                        transform: `translateZ(${bldStruct.height / 2}px) rotateX(-90deg)`,
                        transformOrigin: 'bottom',
                        backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.85)' : 'rgba(30, 41, 59, 0.85)',
                        borderColor: isSelected ? '#60a5fa' : 'rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {/* Window Rows */}
                      <div className="w-full flex justify-between gap-1">
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                      </div>
                      <div className="w-full flex justify-between gap-1">
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                      </div>
                      <div className="w-full flex justify-between gap-1">
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                        <div className="h-2 flex-1 bg-cyan-400/40 rounded-sm" />
                      </div>
                    </div>

                    {/* Roof Top Cap */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-white/30 flex items-center justify-center font-bold text-white text-xs shadow-lg"
                      style={{
                        transform: `translateZ(${bldStruct.height}px)`,
                        backgroundColor: isSelected ? '#2563eb' : bldStruct.roofColor,
                      }}
                    >
                      <Building2 size={16} className="text-white/80" />
                    </div>

                    {/* Billboard Pin Counter-Rotates to Face Camera */}
                    <div
                      className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-40"
                      style={{
                        transform: `rotateY(${-rotY}deg) rotateX(${-rotX}deg)`,
                        transition: 'transform 0.1s ease-out',
                      }}
                    >
                      <div
                        className={`px-3.5 py-1.5 rounded-2xl border text-xs font-black whitespace-nowrap shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-300 ring-4 ring-blue-500/40 scale-110'
                            : 'bg-neutral-900/90 text-neutral-200 border-white/20 group-hover:border-blue-400 group-hover:scale-105'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                        <span className="font-extrabold">{bldStruct.code}</span>
                        <span className="font-semibold text-[10px] text-neutral-300">
                          {bldStruct.name.split('(')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Rotation Guidance Overlay */}
      <div className="p-4 flex items-center justify-between text-xs text-neutral-400 bg-neutral-950/80 border-t border-white/10 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-blue-400" />
          <span>
            마우스 드래그로 <strong>3D 캠퍼스 지형 및 층별 건물 구조를 360도 입체 탐색</strong>하세요. (휠 확대/축소)
          </span>
        </div>
        <span className="font-mono text-neutral-500">
          Camera Y: {Math.round(rotY)}° | X: {Math.round(rotX)}°
        </span>
      </div>
    </div>
  );
}
