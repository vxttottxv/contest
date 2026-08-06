import { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Eye, Sparkles } from 'lucide-react';
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
  const [rotY, setRotY] = useState(15);
  const [rotX, setRotX] = useState(25);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  // Auto rotate timer
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotY((prev) => (prev + 0.3) % 360);
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
    setRotX((prev) => Math.max(-10, Math.min(60, prev - deltaY * 0.4)));

    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.7, Math.min(1.8, prev - e.deltaY * 0.0015)));
  };

  const resetCamera = () => {
    setRotY(15);
    setRotX(25);
    setZoom(1);
    setAutoRotate(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-neutral-950 select-none">
      {/* Top 3D Control Bar */}
      <div className="p-4 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-neutral-900/90 border border-white/10 text-xs font-bold backdrop-blur-md">
          <Sparkles size={16} className="text-blue-400" />
          <span>명지전문대학 360° 3D 입체 지형 모형</span>
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
            onClick={() => setZoom((prev) => Math.max(0.7, prev - 0.15))}
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

      {/* Interactive 360 Rotatable WebGL / CSS 3D View */}
      <div
        className="relative w-full flex-1 cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Ambient Lighting Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.12)_0%,transparent_75%)] pointer-events-none" />

        {/* 3D Perspective Scene Container */}
        <div
          className="relative transition-transform duration-75 ease-out"
          style={{
            perspective: '1400px',
            transform: `scale(${zoom})`,
          }}
        >
          {/* Rotating 3D World Stage */}
          <div
            className="relative w-[720px] h-[440px] rounded-3xl border border-white/10 shadow-[0_0_90px_rgba(0,0,0,0.8)] overflow-hidden bg-neutral-900"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* 3D Campus Mesh Texture Image */}
            <img
              src="/images/myongji_3d_campus_mesh.png"
              alt="Myongji 3D Campus Model"
              className="w-full h-full object-cover filter brightness-110 contrast-105 pointer-events-none"
            />

            {/* Interactive Building Pin Markers Overlaid on 3D Model */}
            {buildings.map((bld) => {
              const isSelected = selectedBuilding.id === bld.id;

              return (
                <div
                  key={bld.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBuilding(bld);
                  }}
                  className="absolute cursor-pointer z-30 group"
                  style={{
                    left: `${bld.coordinates.x}%`,
                    top: `${bld.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Billboard Pin Counter-Rotates to Always Face Viewer */}
                  <div
                    className="relative transition-all duration-300"
                    style={{
                      transform: `rotateY(${-rotY}deg) rotateX(${-rotX}deg)`,
                      transition: 'transform 0.1s ease-out',
                    }}
                  >
                    <div
                      className={`px-3.5 py-1.5 rounded-2xl border text-xs font-black whitespace-nowrap shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-300 ring-4 ring-blue-500/40 scale-110'
                          : 'bg-black/80 text-neutral-200 border-white/20 group-hover:border-blue-400 group-hover:scale-105'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span className="font-extrabold">{bld.code}</span>
                      <span className="font-semibold text-[10px] text-neutral-300">
                        {bld.name.split('(')[0]}
                      </span>
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
            마우스를 클릭하여 드래그하면 <strong>3D 캠퍼스 지형을 360도 입체로 회전</strong>하여 보실 수 있습니다.
          </span>
        </div>
        <span className="font-mono text-neutral-500">
          Rotation Y: {Math.round(rotY)}° | X: {Math.round(rotX)}°
        </span>
      </div>
    </div>
  );
}
