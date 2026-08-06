import { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Box, Eye, Sparkles } from 'lucide-react';
import type { Building3D } from '../services/campusMapApi';

interface Campus3DViewerProps {
  buildings: Building3D[];
  selectedBuilding: Building3D;
  onSelectBuilding: (building: Building3D) => void;
}

export default function Campus3DViewer({
  buildings,
  selectedBuilding,
  onSelectBuilding,
}: Campus3DViewerProps) {
  // 360 Rotation states (degrees)
  const [rotY, setRotY] = useState(35);
  const [rotX, setRotX] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState<'3d-canvas' | 'tripo-embed'>('3d-canvas');

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
    setRotY(35);
    setRotX(30);
    setZoom(1);
    setAutoRotate(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-neutral-950 select-none">
      {/* Top 3D Control Bar */}
      <div className="p-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('3d-canvas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === '3d-canvas'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <Box size={14} />
            <span>360° 3D 캠퍼스 맵</span>
          </button>
          <button
            onClick={() => setViewMode('tripo-embed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'tripo-embed'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Tripo3D AI 모델뷰</span>
          </button>
        </div>

        {/* Camera Tools */}
        {viewMode === '3d-canvas' && (
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
        )}
      </div>

      {/* Center 3D Interactive Display */}
      {viewMode === 'tripo-embed' ? (
        /* Tripo3D External Model Embed View */
        <div className="relative w-full flex-1 p-4 flex items-center justify-center">
          <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-neutral-900">
            <iframe
              src="https://studio.tripo3d.ai/3d-model/d141415c-eab4-4c19-a0de-e31fae3b246e?invite_code=CDV08H"
              className="w-full h-full border-0"
              title="Tripo3D Campus Model"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        /* Interactive 360 Rotatable WebGL / CSS 3D View */
        <div
          className="relative w-full flex-1 cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)] pointer-events-none" />

          {/* 3D Perspective Scene Container */}
          <div
            className="relative transition-transform duration-75 ease-out"
            style={{
              perspective: '1200px',
              transform: `scale(${zoom})`,
            }}
          >
            {/* Rotating 3D World Surface */}
            <div
              className="relative w-[500px] h-[500px] rounded-full border border-blue-500/20 shadow-[0_0_80px_rgba(37,99,235,0.2)]"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
                background: 'radial-gradient(circle, rgba(15,23,42,0.8) 0%, rgba(10,10,10,0.95) 70%)',
              }}
            >
              {/* Floor Terrain Grid */}
              <div
                className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Central Compass Ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/20 pointer-events-none" />

              {/* 3D Rendered Building Models */}
              {buildings.map((bld) => {
                const isSelected = selectedBuilding.id === bld.id;

                // Calculate 3D position on floor plane
                const posX = (bld.coordinates.x - 50) * 4;
                const posY = (bld.coordinates.y - 50) * 4;
                const height = bld.floors * 14;

                return (
                  <div
                    key={bld.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBuilding(bld);
                    }}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `calc(50% + ${posX}px)`,
                      top: `calc(50% + ${posY}px)`,
                      transformStyle: 'preserve-3d',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* 3D Building Prism Geometry */}
                    <div
                      className={`relative transition-all duration-300 ${
                        isSelected ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                      style={{
                        width: 70,
                        height: 70,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Building Body Block */}
                      <div
                        className={`absolute inset-0 rounded-2xl border transition-all duration-300 flex items-center justify-center shadow-2xl ${
                          isSelected
                            ? 'bg-blue-600/90 border-blue-400 shadow-blue-500/50'
                            : 'bg-neutral-800/80 border-white/20 group-hover:border-blue-400 group-hover:bg-neutral-800'
                        }`}
                        style={{
                          height: height,
                          transform: `translateZ(${height / 2}px) rotateX(-90deg)`,
                          transformOrigin: 'bottom',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {/* Windows Mesh Accent */}
                        <div className="w-full h-full p-2 flex flex-col justify-between opacity-60">
                          <div className="w-full h-1 bg-white/40 rounded" />
                          <div className="w-full h-1 bg-white/40 rounded" />
                          <div className="w-full h-1 bg-white/40 rounded" />
                        </div>
                      </div>

                      {/* Floating Billboard Pin (Always faces camera) */}
                      <div
                        className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-30"
                        style={{
                          transform: `rotateY(${-rotY}deg) rotateX(${-rotX}deg)`,
                          transition: 'transform 0.1s ease-out',
                        }}
                      >
                        <div
                          className={`px-3 py-1.5 rounded-xl border text-xs font-black whitespace-nowrap shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-300 ring-4 ring-blue-500/30'
                              : 'bg-neutral-900/90 text-neutral-200 border-white/20 group-hover:border-blue-400'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>{bld.code}</span>
                          <span className="font-semibold text-[10px] text-neutral-300">
                            {bld.name.split('(')[0]}
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
      )}

      {/* Bottom Rotation Guidance Overlay */}
      {viewMode === '3d-canvas' && (
        <div className="p-4 flex items-center justify-between text-xs text-neutral-400 bg-neutral-950/80 border-t border-white/10 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-blue-400" />
            <span>
              마우스를 드래그하여 <strong>360도 3D 입체 카메라 회전</strong>이 가능합니다. (휠로 확대/축소)
            </span>
          </div>
          <span className="font-mono text-neutral-500">
            Cam RotY: {Math.round(rotY)}° | RotX: {Math.round(rotX)}°
          </span>
        </div>
      )}
    </div>
  );
}
