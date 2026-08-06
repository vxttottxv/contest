import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  MapPin,
  Footprints,
  Clock,
  X,
  Building2,
  CheckCircle,
  LocateFixed,
  Eye,
  Camera,
} from 'lucide-react';
import type { Building3D } from '../services/campusMapApi';

interface CampusNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationBuilding: Building3D | null;
  allBuildings: Building3D[];
}

export default function CampusNavigationModal({
  isOpen,
  onClose,
  destinationBuilding,
  allBuildings,
}: CampusNavigationModalProps) {
  const [selectedDest, setSelectedDest] = useState<Building3D | null>(destinationBuilding);
  const [userLocationName, setUserLocationName] = useState<string>('정문 주출입구 (GPS 현위치)');
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (destinationBuilding) {
      setSelectedDest(destinationBuilding);
    } else if (allBuildings.length > 0) {
      setSelectedDest(allBuildings[0]);
    }
  }, [destinationBuilding, allBuildings]);

  const handleGetGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocationName(`GPS 수신 완료 (위도 ${pos.coords.latitude.toFixed(4)}, 경도 ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setUserLocationName('캠퍼스 정문 가상 GPS 수신 위치');
        }
      );
    }
  };

  if (!isOpen || !selectedDest) return null;

  // Real campus map route landmark steps according to destination
  const routeSteps = [
    {
      step: 1,
      landmark: '정문 주출입구 & 중앙 잔디 운동장',
      instruction: `[${userLocationName}] 정문 입구를 지나 중앙 잔디 운동장 트랙 방향으로 50m 직진하세요.`,
      distance: '50m',
      icon: '⬆️',
      xPercent: 15,
      yPercent: 75,
    },
    {
      step: 2,
      landmark: '중앙 쉼터 분수대 & 가로수길',
      instruction: `중앙 운동장 우측 가로수길을 지나 ${selectedDest.code} (${selectedDest.name.split('(')[0]}) 방향으로 좌회전하세요.`,
      distance: '60m',
      icon: '↖️',
      xPercent: 45,
      yPercent: 50,
    },
    {
      step: 3,
      landmark: `${selectedDest.name.split('(')[0]} 정문 출입구`,
      instruction: `${selectedDest.name.split('(')[0]} 1층 주 출입구(${selectedDest.entrances[0] || '메인 출입구'})에 도착했습니다!`,
      distance: '30m',
      icon: '🏁',
      xPercent: selectedDest.coordinates.x,
      yPercent: selectedDest.coordinates.y,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-white flex flex-col space-y-4 overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20">
                <Navigation size={22} className="text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">실제 캠퍼스 지형 3D 실사 길찾기 네비게이션</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <LocateFixed size={10} />
                    GPS Live Tracking
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  길치 유학생을 위한 실제 학교 3D 입체 지형 사진 기반 시각적 도보 길안내
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Location Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
            {/* Start Location (GPS) */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">출발지 (My GPS Location)</span>
                  <span className="text-xs font-bold text-neutral-200">{userLocationName}</span>
                </div>
              </div>
              <button
                onClick={handleGetGps}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-[11px] font-bold transition-all cursor-pointer shrink-0"
              >
                GPS 갱신
              </button>
            </div>

            {/* Destination Selector */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin size={18} className="text-red-400 shrink-0 animate-bounce" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">도착지 건물 선택</span>
                  <span className="text-xs font-bold text-cyan-300">
                    {selectedDest.code}: {selectedDest.name.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Destination Building Switcher Chips */}
              <div className="flex gap-1 overflow-x-auto max-w-[220px]">
                {allBuildings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedDest(b);
                      setCurrentStep(0);
                    }}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                      selectedDest.id === b.id
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {b.code}: {b.name.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* REAL CAMPUS SATELLITE MAP VISUAL NAVIGATION CANVAS */}
          <div className="flex-1 min-h-[340px] relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between bg-black">
            {/* REAL CAMPUS 3D PHOTO BACKGROUND IMAGE */}
            <img
              src="/images/myongji_3d_campus_mesh.png"
              alt="Myongji Campus Real Map Background"
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-110"
            />

            {/* Dark Overlay for Neon Route Contrast */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            {/* ANIMATED NEON ROUTE PATH OVERLAY (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <path
                d="M 120 280 L 350 200 L 600 120"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="6"
                strokeDasharray="10 10"
                className="animate-[dash_15s_linear_infinite]"
              />
              <path
                d="M 120 280 L 350 200 L 600 120"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>

            {/* Top Navigation Summary Info */}
            <div className="flex items-center justify-between text-xs p-4 z-20">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-md">
                <span className="flex items-center gap-1 font-bold text-blue-400">
                  <Footprints size={16} />
                  도보 총 거리: <strong>140m</strong>
                </span>
                <span className="text-neutral-500">|</span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Clock size={16} />
                  소요 시간: <strong>약 2분</strong>
                </span>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-blue-600/90 border border-blue-400 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                <Camera size={14} />
                <span>실물 3D 학교 지도를 보고 화살표를 따라 이동하세요!</span>
              </div>
            </div>

            {/* OVERLAID VISUAL LANDMARK & TURN PINS DIRECTLY ON REAL MAP */}
            <div className="relative w-full h-full flex-1 z-20">
              {/* Start Pin: My Location (GPS) */}
              <div className="absolute left-[12%] top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="p-3 rounded-full bg-blue-600 text-white shadow-2xl ring-4 ring-blue-500/40 animate-pulse">
                  <LocateFixed size={20} />
                </div>
                <span className="mt-1 px-2.5 py-1 rounded-lg bg-black/90 border border-blue-400 text-[11px] font-extrabold text-blue-300 shadow-xl whitespace-nowrap">
                  📍 출발: 내 GPS 현위치
                </span>
              </div>

              {/* Waypoint 1: Landmark Turn Point */}
              <div className="absolute left-[45%] top-[52%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="p-2 rounded-full bg-amber-500 text-black font-black text-xs shadow-xl ring-4 ring-amber-400/30 animate-bounce">
                  ↖️
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-lg bg-black/90 border border-amber-400 text-[10px] font-bold text-amber-300 shadow-xl whitespace-nowrap">
                  📍 중앙 가로수길 좌회전
                </span>
              </div>

              {/* Destination Pin: Selected Building */}
              <div className="absolute left-[75%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="p-3 rounded-full bg-red-600 text-white shadow-2xl ring-4 ring-red-500/50 animate-bounce">
                  <Building2 size={22} />
                </div>
                <span className="mt-1 px-3 py-1 rounded-lg bg-black/90 border border-red-400 text-xs font-black text-red-300 shadow-xl whitespace-nowrap">
                  🏁 도착: {selectedDest.code} ({selectedDest.name.split('(')[0]})
                </span>
              </div>
            </div>

            {/* Bottom Current Step Guidance Banner */}
            <div className="p-4 bg-black/85 border-t border-white/20 backdrop-blur-md z-20 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-2xl bg-blue-600/30 border border-blue-400/40">
                  {routeSteps[currentStep].icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      STEP {currentStep + 1} / {routeSteps.length}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      📍 랜드마크: {routeSteps[currentStep].landmark}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-neutral-100 mt-1">
                    {routeSteps[currentStep].instruction}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-neutral-800 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  이전 단계
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(routeSteps.length - 1, prev + 1))}
                  disabled={currentStep === routeSteps.length - 1}
                  className="px-4 py-2 bg-blue-600 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  다음 단계
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-1 shrink-0">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Eye size={16} className="text-blue-400" />
              <span>실사 지도 화살표를 보고 랜드마크를 확인하며 이동하세요!</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle size={16} />
              <span>길안내 종료</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
