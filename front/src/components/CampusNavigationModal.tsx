import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation,
  MapPin,
  Compass,
  ArrowRight,
  Footprints,
  Clock,
  X,
  Building2,
  CheckCircle,
  LocateFixed,
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

  // Starfield-style route steps generated dynamically for selected building
  const routeSteps = [
    {
      step: 1,
      instruction: `[${userLocationName}]에서 중앙 광장 통로 방향으로 40m 직진하세요.`,
      distance: '40m',
      icon: '🚶',
    },
    {
      step: 2,
      instruction: `중앙 쉼터 분수대에서 좌측 10시 방향 ${selectedDest.code} (${selectedDest.name.split('(')[0]}) 건물 진입로로 이동하세요.`,
      distance: '80m',
      icon: '↖️',
    },
    {
      step: 3,
      instruction: `${selectedDest.name.split('(')[0]} 주 출입구(${selectedDest.entrances[0] || '1층'})로 진입 후 내부에 있는 엘리베이터/안내판을 확인하세요.`,
      distance: '30m',
      icon: '🏢',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-white flex flex-col space-y-5 overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20">
                <Navigation size={22} className="text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">STARFIELD STYLE CAMPUS NAVI</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <LocateFixed size={10} />
                    GPS Live
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  스타필드형 스마트 실내외 도보 길안내 네비게이션
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
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">출발지 (My Location)</span>
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
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">도착지 (Destination)</span>
                  <span className="text-xs font-bold text-cyan-300">
                    {selectedDest.code}: {selectedDest.name.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Destination Building Switcher Chips */}
              <div className="flex gap-1 overflow-x-auto max-w-[180px]">
                {allBuildings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedDest(b)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                      selectedDest.id === b.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {b.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Visual Navigation Canvas (Starfield Style) */}
          <div className="flex-1 min-h-[260px] relative rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6 overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Background Map Blueprint Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.3) 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Animated Dotted Navigation Path Line (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <path
                d="M 80 220 Q 250 120 450 180 T 700 80"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="8 8"
                className="animate-[dash_20s_linear_infinite]"
              />
            </svg>

            {/* Top Navigation Summary Info */}
            <div className="flex items-center justify-between text-xs z-20">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md">
                <span className="flex items-center gap-1 font-bold text-blue-400">
                  <Footprints size={16} />
                  도보 총 거리: <strong>150m</strong>
                </span>
                <span className="text-neutral-500">|</span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Clock size={16} />
                  소요 시간: <strong>약 2분</strong>
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px] font-bold flex items-center gap-1">
                <Compass size={14} className="animate-spin" />
                <span>스타필드 스마트 AR 길안내 활성화</span>
              </div>
            </div>

            {/* Animated Start & End Markers on Canvas */}
            <div className="relative w-full h-36 z-20 flex items-center justify-between px-10">
              {/* Start Pin */}
              <div className="flex flex-col items-center gap-1">
                <div className="p-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/50 ring-4 ring-blue-500/30 animate-pulse">
                  <LocateFixed size={20} />
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 bg-black/80 rounded-md border border-blue-400 text-blue-300">
                  내 현위치 (출발)
                </span>
              </div>

              {/* Waypoint Arrow */}
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse font-bold text-xs">
                <span>동선 안내</span>
                <ArrowRight size={20} />
              </div>

              {/* End Pin */}
              <div className="flex flex-col items-center gap-1">
                <div className="p-3 rounded-full bg-red-600 text-white shadow-lg shadow-red-500/50 ring-4 ring-red-500/30 animate-bounce">
                  <Building2 size={20} />
                </div>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 bg-black/80 rounded-md border border-red-400 text-red-300">
                  {selectedDest.code} {selectedDest.name.split('(')[0]} (도착)
                </span>
              </div>
            </div>

            {/* Bottom Current Step Banner */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-md z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{routeSteps[currentStep].icon}</span>
                <div>
                  <span className="text-[10px] font-bold text-blue-400 block">
                    STEP {currentStep + 1} / {routeSteps.length}
                  </span>
                  <p className="text-xs font-bold text-neutral-200">
                    {routeSteps[currentStep].instruction}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-3 py-1.5 bg-neutral-800 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(routeSteps.length - 1, prev + 1))}
                  disabled={currentStep === routeSteps.length - 1}
                  className="px-3 py-1.5 bg-blue-600 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  다음 단계
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-1 shrink-0">
            <span className="text-xs text-neutral-400">
              도움이 필요하신가요? <strong>캠퍼스 안내센터 (02-300-1234)</strong>
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle size={16} />
              <span>네비게이션 길안내 시작</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
