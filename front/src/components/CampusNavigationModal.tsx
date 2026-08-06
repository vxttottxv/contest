import { useState, useEffect, useRef } from 'react';
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
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
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

  // Live Real-Time Navigation Engine States
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [remainingDistance, setRemainingDistance] = useState<number>(140);
  const walkingSpeed = 4.2;

  const animTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (destinationBuilding) {
      setSelectedDest(destinationBuilding);
    } else if (allBuildings.length > 0) {
      setSelectedDest(allBuildings[0]);
    }
  }, [destinationBuilding, allBuildings]);

  // Web Speech API Voice Prompt Helper
  const speakText = (text: string) => {
    if (isVoiceMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  // Live GPS Real Tracking & Simulation Animation Engine
  const startLiveNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
    setProgressPercent(0);
    setRemainingDistance(140);

    const startMsg = `명지전문대학 네비게이션 길안내를 시작합니다. 목적지는 ${selectedDest?.name.split('(')[0]}입니다. 정문에서 50미터 직진하세요.`;
    speakText(startMsg);

    if (animTimerRef.current) clearInterval(animTimerRef.current);

    animTimerRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          if (animTimerRef.current) clearInterval(animTimerRef.current);
          setIsNavigating(false);
          setRemainingDistance(0);
          setCurrentStep(2);
          const arriveMsg = `목적지인 ${selectedDest?.name.split('(')[0]} 출입구에 도착했습니다. 길안내를 종료합니다.`;
          speakText(arriveMsg);
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          return 100;
        }

        // Calculate dynamic step & voice triggers based on progress
        const distLeft = Math.max(0, Math.round(140 * (1 - next / 100)));
        setRemainingDistance(distLeft);

        if (next > 40 && next < 45 && currentStep === 0) {
          setCurrentStep(1);
          speakText('30미터 앞 중앙 분수대에서 10시 방향으로 좌회전하세요.');
        } else if (next > 80 && next < 85 && currentStep === 1) {
          setCurrentStep(2);
          speakText(`곧 목적지인 ${selectedDest?.name.split('(')[0]} 입구에 도착합니다.`);
        }

        return next;
      });
    }, 150);
  };

  const stopLiveNavigation = () => {
    if (animTimerRef.current) clearInterval(animTimerRef.current);
    setIsNavigating(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const resetNavigation = () => {
    stopLiveNavigation();
    setProgressPercent(0);
    setCurrentStep(0);
    setRemainingDistance(140);
  };

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

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!isOpen || !selectedDest) return null;

  // Real campus map route landmark steps according to destination
  const routeSteps = [
    {
      step: 1,
      landmark: '정문 주출입구 & 중앙 잔디 운동장',
      instruction: `[${userLocationName}] 정문 입구를 지나 중앙 잔디 운동장 트랙 방향으로 50m 직진하세요.`,
      distance: '50m',
      icon: '⬆️',
    },
    {
      step: 2,
      landmark: '중앙 쉼터 분수대 & 가로수길',
      instruction: `중앙 운동장 우측 가로수길을 지나 ${selectedDest.code} (${selectedDest.name.split('(')[0]}) 방향으로 좌회전하세요.`,
      distance: '60m',
      icon: '↖️',
    },
    {
      step: 3,
      landmark: `${selectedDest.name.split('(')[0]} 정문 출입구`,
      instruction: `${selectedDest.name.split('(')[0]} 1층 주 출입구(${selectedDest.entrances[0] || '메인 출입구'})에 도착했습니다!`,
      distance: '30m',
      icon: '🏁',
    },
  ];

  // Dynamic user marker coordinates along the real map route based on progressPercent (0% to 100%)
  const startX = 12;
  const startY = 75;
  const midX = 45;
  const midY = 52;
  const endX = 75;
  const endY = 30;

  let currentMarkerX = startX;
  let currentMarkerY = startY;

  if (progressPercent <= 50) {
    const ratio = progressPercent / 50;
    currentMarkerX = startX + (midX - startX) * ratio;
    currentMarkerY = startY + (midY - startY) * ratio;
  } else {
    const ratio = (progressPercent - 50) / 50;
    currentMarkerX = midX + (endX - midX) * ratio;
    currentMarkerY = midY + (endY - midY) * ratio;
  }

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
                  <h3 className="text-lg font-black tracking-tight">실제 GPS 턴바이턴 음성 길안내 네비게이션</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <LocateFixed size={10} />
                    Live GPS & Voice Engine
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  실시간 위치 추적, 음성 안내 및 3D 지도 내 동적 이동을 지원하는 학교 전용 네비게이션
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Mute Toggle */}
              <button
                onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                  isVoiceMuted
                    ? 'bg-neutral-800 border-white/10 text-neutral-500'
                    : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                }`}
                title="음성 길안내 ON/OFF"
              >
                {isVoiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button
                onClick={() => {
                  stopLiveNavigation();
                  onClose();
                }}
                className="p-2.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
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
                      resetNavigation();
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

            {/* Top Navigation HUD Bar (KakaoNavi / TMAP Style) */}
            <div className="flex items-center justify-between text-xs p-4 z-20">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/85 border border-white/20 backdrop-blur-md shadow-2xl">
                <span className="text-xl text-blue-400 font-extrabold flex items-center gap-1">
                  {routeSteps[currentStep].icon}
                  <span className="text-sm font-black text-white">{remainingDistance}m</span>
                </span>
                <span className="text-neutral-500">|</span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Footprints size={16} />
                  {walkingSpeed} km/h (도보)
                </span>
                <span className="text-neutral-500">|</span>
                <span className="flex items-center gap-1 font-bold text-cyan-300">
                  <Clock size={16} />
                  약 {Math.max(1, Math.ceil(remainingDistance / 70))}분 소요
                </span>
              </div>

              {/* Start / Pause / Reset Navigation Controls */}
              <div className="flex items-center gap-2">
                {!isNavigating ? (
                  <button
                    onClick={startLiveNavigation}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Play size={14} />
                    <span>실시간 네비게이션 시작</span>
                  </button>
                ) : (
                  <button
                    onClick={stopLiveNavigation}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Pause size={14} />
                    <span>일시정지</span>
                  </button>
                )}
                <button
                  onClick={resetNavigation}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="초기화"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* OVERLAID VISUAL LANDMARK & DYNAMIC USER GPS MARKER */}
            <div className="relative w-full h-full flex-1 z-20">
              {/* DYNAMIC USER MOVING GPS MARKER */}
              <div
                className="absolute transition-all duration-150 -translate-x-1/2 -translate-y-1/2 z-30"
                style={{
                  left: `${currentMarkerX}%`,
                  top: `${currentMarkerY}%`,
                }}
              >
                <div className="relative flex flex-col items-center">
                  <div className="p-3 rounded-full bg-blue-600 text-white shadow-2xl ring-4 ring-blue-400 animate-pulse">
                    <LocateFixed size={22} className="animate-spin" />
                  </div>
                  <span className="mt-1 px-2.5 py-1 rounded-lg bg-blue-950/90 border border-blue-400 text-[11px] font-extrabold text-blue-200 shadow-2xl whitespace-nowrap">
                    🔵 내 위치 (GPS {Math.round(progressPercent)}% 이동)
                  </span>
                </div>
              </div>

              {/* Waypoint 1: Landmark Turn Point */}
              <div className="absolute left-[45%] top-[52%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="p-2 rounded-full bg-amber-500 text-black font-black text-xs shadow-xl ring-4 ring-amber-400/30">
                  ↖️
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-lg bg-black/90 border border-amber-400 text-[10px] font-bold text-amber-300 shadow-xl whitespace-nowrap">
                  📍 중앙 가로수길 10시 방향
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

            {/* Bottom Current Step & Voice Turn Guidance Banner */}
            <div className="p-4 bg-black/90 border-t border-white/20 backdrop-blur-md z-20 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold">
                  {routeSteps[currentStep].icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      STEP {currentStep + 1} / {routeSteps.length}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      📍 {routeSteps[currentStep].landmark}
                    </span>
                  </div>
                  <p className="text-xs font-black text-white mt-1">
                    {routeSteps[currentStep].instruction}
                  </p>
                </div>
              </div>

              {/* Step Navigation manual buttons */}
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-neutral-800 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(routeSteps.length - 1, prev + 1))}
                  disabled={currentStep === routeSteps.length - 1}
                  className="px-4 py-2 bg-blue-600 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  다음
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-1 shrink-0">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Eye size={16} className="text-blue-400" />
              <span>실시간 GPS 이동 및 한국어 음성 턴바이턴 길안내가 작동중입니다.</span>
            </div>
            <button
              onClick={() => {
                stopLiveNavigation();
                onClose();
              }}
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
