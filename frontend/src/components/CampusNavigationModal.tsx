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
  Search,
} from 'lucide-react';
import type { Building3D } from '../services/campusMapApi';

interface CampusNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationBuilding: Building3D | null;
  allBuildings?: Building3D[];
}

export interface DetailedPlace {
  id: string;
  name: string;
  buildingId: string;
  buildingCode: string;
  floor: string;
  category: '카페' | '식당' | '강의실' | '프린트실' | '행정';
  description: string;
  xPercent: number; // Blueprint X percent position
  yPercent: number; // Blueprint Y percent position
}

export const DETAILED_PLACES: DetailedPlace[] = [
  { id: 'p-1', name: 'C동 2층 블루라인 북카페', buildingId: 'bld-3', buildingCode: 'C동', floor: '2층', category: '카페', description: '도서관 로비 앞 커피, 디저트 및 스터디 공간', xPercent: 75, yPercent: 40 },
  { id: 'p-2', name: 'A동 지하1층 푸드코트 학생식당', buildingId: 'bld-1', buildingCode: 'A동', floor: '지하1층', category: '식당', description: '한식, 중식, 분식 및 글로벌 식단 배식대', xPercent: 25, yPercent: 80 },
  { id: 'p-3', name: 'B동 1층 24시간 무인 프린트실', buildingId: 'bld-2', buildingCode: 'B동', floor: '1층', category: '프린트실', description: '24시간 학생증 결제 무인 컬러/흑백 인쇄기', xPercent: 18, yPercent: 65 },
  { id: 'p-4', name: 'A동 1층 101호 유학생 지원 센터', buildingId: 'bld-1', buildingCode: 'A동', floor: '1층', category: '행정', description: '외국인등록증, 비자 연장, 수강신청 원스톱 상담 창구', xPercent: 78, yPercent: 45 },
  { id: 'p-5', name: 'B동 3층 301호 SW 코딩실습실', buildingId: 'bld-2', buildingCode: 'B동', floor: '3층', category: '강의실', description: '컴퓨터공학과 메인 듀얼모니터 코딩 실습실', xPercent: 55, yPercent: 35 },
  { id: 'p-6', name: 'C동 1층 종합 실내체육관 & 실버 돔', buildingId: 'bld-3', buildingCode: 'C동', floor: '1층', category: '강의실', description: '농구, 배드민턴, 스포츠 교양 및 대강당 아치 돔', xPercent: 60, yPercent: 60 },
  { id: 'p-7', name: 'D동 1층 유학생 커뮤니티 라운지', buildingId: 'bld-4', buildingCode: 'D동', floor: '1층', category: '카페', description: '외국인 유학생 다문화 버디 교류 라운지', xPercent: 35, yPercent: 45 },
  { id: 'p-8', name: 'B동 1층 104호 AI 컴퓨터랩', buildingId: 'bld-2', buildingCode: 'B동', floor: '1층', category: '강의실', description: '인공지능 GPU 서버 및 AI 실습실', xPercent: 40, yPercent: 30 },
  { id: 'p-9', name: 'A동 3층 305호 글로벌 화상회의실', buildingId: 'bld-1', buildingCode: 'A동', floor: '3층', category: '강의실', description: '국제 학술 발표 및 화상 강의실', xPercent: 45, yPercent: 25 },
  { id: 'p-10', name: 'B동 1층 CU 편의점', buildingId: 'bld-2', buildingCode: 'B동', floor: '1층', category: '식당', description: '학생 편의점 및 도시락 삼각김밥 코너', xPercent: 22, yPercent: 70 },
];

export default function CampusNavigationModal({
  isOpen,
  onClose,
  destinationBuilding,
}: CampusNavigationModalProps) {
  const [selectedPlace, setSelectedPlace] = useState<DetailedPlace>(DETAILED_PLACES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [userLocationName, setUserLocationName] = useState<string>('정문 주출입구 (GPS 현위치)');
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Live Real-Time Navigation Engine States
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [remainingDistance, setRemainingDistance] = useState<number>(140);
  const walkingSpeed = 4.2;

  const animTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pre-load Web Speech API voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if (destinationBuilding) {
      const match = DETAILED_PLACES.find((p) => p.buildingId === destinationBuilding.id);
      if (match) setSelectedPlace(match);
    }
  }, [destinationBuilding]);

  const filteredPlaces = DETAILED_PLACES.filter((p) => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchQuery = searchQuery === '' || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCat && matchQuery;
  });

  // Naver Maps / TMAP Style Real Female Voice Navigation TTS Engine
  const speakText = (text: string) => {
    if (isVoiceMuted || !('speechSynthesis' in window)) return;

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.pitch = 1.3; // Naver Maps female voice pitch

      const voices = window.speechSynthesis.getVoices();
      const femaleKoVoice = voices.find(
        (v) => (v.lang.includes('ko') || v.lang.includes('KO')) &&
          (v.name.includes('Sun') || v.name.includes('Yuna') || v.name.includes('Female') || v.name.includes('Google') || v.name.includes('Yuri') || v.name.includes('Heami') || v.name.includes('Kyoko') || v.name.includes('Siri'))
      ) || voices.find((v) => v.lang.includes('ko') || v.lang.includes('KO'));

      if (femaleKoVoice) {
        utterance.voice = femaleKoVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Voice narration error:', e);
    }
  };

  // Naver Maps Style Real Voice Navigation Start
  const startLiveNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
    setProgressPercent(0);
    setRemainingDistance(140);

    // Naver Navigation Voice Prompt 1: "50m 직진하세요."
    const naviPrompt1 = `네비게이션 길안내를 시작합니다. 목적지는 ${selectedPlace.name}입니다. 정문에서 50미터 직진하세요.`;
    speakText(naviPrompt1);

    if (animTimerRef.current) clearInterval(animTimerRef.current);

    animTimerRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          if (animTimerRef.current) clearInterval(animTimerRef.current);
          setIsNavigating(false);
          setRemainingDistance(0);
          setCurrentStep(2);
          // Naver Navigation Voice Prompt 4: "목적지에 도착했습니다."
          const arrivePrompt = `목적지인 ${selectedPlace.name}에 도착했습니다. 안내를 종료합니다.`;
          speakText(arrivePrompt);
          return 100;
        }

        const distLeft = Math.max(0, Math.round(140 * (1 - next / 100)));
        setRemainingDistance(distLeft);

        // Naver Navigation Voice Prompt 2: "30m 앞 로비에서 좌회전하세요."
        if (next > 40 && next < 45 && currentStep === 0) {
          setCurrentStep(1);
          speakText(`30미터 앞 로비에서 ${selectedPlace.floor} 복도 방향으로 좌회전하세요.`);
        }
        // Naver Navigation Voice Prompt 3: "곧 목적지에 도착합니다."
        else if (next > 80 && next < 85 && currentStep === 1) {
          setCurrentStep(2);
          speakText(`곧 목적지인 ${selectedPlace.name}에 도착합니다.`);
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

  if (!isOpen) return null;

  const routeSteps = [
    {
      step: 1,
      landmark: `${selectedPlace.buildingCode} 정문 출입구`,
      instruction: `[${userLocationName}] 정문 출입구를 지나 메인 로비 방향으로 50m 직진하세요.`,
      distance: '50m',
      icon: '⬆️',
    },
    {
      step: 2,
      landmark: `${selectedPlace.buildingCode} ${selectedPlace.floor} 엘리베이터/복도`,
      instruction: `로비 엘리베이터/계단을 통해 ${selectedPlace.floor}로 이동 후 복도 방향으로 이동하세요.`,
      distance: '60m',
      icon: '🛗',
    },
    {
      step: 3,
      landmark: `${selectedPlace.name}`,
      instruction: `${selectedPlace.name} (${selectedPlace.description})에 도착했습니다!`,
      distance: '30m',
      icon: '🏁',
    },
  ];

  const startX = 15;
  const startY = 85;
  const targetX = selectedPlace.xPercent;
  const targetY = selectedPlace.yPercent;

  const currentMarkerX = startX + (targetX - startX) * (progressPercent / 100);
  const currentMarkerY = startY + (targetY - startY) * (progressPercent / 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-5xl max-h-[94vh] bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-white flex flex-col space-y-4 overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20">
                <Navigation size={22} className="text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">네이버 지도 스타일 여성 음성 길안내 네비게이션</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                    <Volume2 size={10} className="animate-pulse" />
                    Naver Voice Guidance
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  "50m 직진하세요", "30m 앞 좌회전하세요" 실제 내비게이션 여성 음성 안내
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGetGps}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                title="GPS 수신 위치 갱신"
              >
                <MapPin size={14} />
                <span>GPS 위치 갱신</span>
              </button>

              <button
                onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                  isVoiceMuted
                    ? 'bg-neutral-800 border-white/10 text-neutral-500'
                    : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
                }`}
                title="음성 안내 ON/OFF"
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

          {/* DETAILED PLACE SEARCH & FILTER BAR */}
          <div className="space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-3">
              {/* Search Box */}
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="목적지 장소 검색 (예: 북카페, 301호 코딩실습실, 유학생 지원 센터, 푸드코트, 무인 프린트실...)"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Category Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
                {[
                  { key: 'all', label: '전체' },
                  { key: '카페', label: '☕ 카페' },
                  { key: '식당', label: '🍱 식당' },
                  { key: '강의실', label: '🏫 강의실' },
                  { key: '프린트실', label: '🖨️ 프린트실' },
                  { key: '행정', label: '🏛️ 행정' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      categoryFilter === cat.key
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-neutral-950 border border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Places Chips Ribbon */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filteredPlaces.map((p) => {
                const isSelected = selectedPlace.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPlace(p);
                      resetNavigation();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-400'
                        : 'bg-neutral-950 border border-white/10 text-neutral-300 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>📍 {p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* REAL SCHOOL BLUEPRINT MAP VISUAL NAVIGATION CANVAS */}
          <div className="flex-1 min-h-[300px] relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between bg-black">
            {/* BLACK BLUEPRINT PLAN IMAGE BACKGROUND */}
            <img
              src="/images/school_floor_blueprint.png"
              alt="School Floor Blueprint Black Background"
              className="absolute inset-0 w-full h-full object-contain filter invert contrast-150 brightness-90 p-4"
            />

            {/* Dark Backdrop Overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* ANIMATED NEON ROUTE PATH OVERLAY (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                x1="15%"
                y1="85%"
                x2={`${selectedPlace.xPercent}%`}
                y2={`${selectedPlace.yPercent}%`}
                stroke="#38bdf8"
                strokeWidth="6"
                strokeDasharray="10 10"
                className="animate-[dash_15s_linear_infinite]"
              />
              <line
                x1="15%"
                y1="85%"
                x2={`${selectedPlace.xPercent}%`}
                y2={`${selectedPlace.yPercent}%`}
                stroke="#60a5fa"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>

            {/* Top Navigation HUD Bar */}
            <div className="flex items-center justify-between text-xs p-4 z-20">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/90 border border-white/20 backdrop-blur-md shadow-2xl">
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

              {/* SINGLE CONSOLIDATED START NAVIGATION BUTTON */}
              <div className="flex items-center gap-2">
                {!isNavigating ? (
                  <button
                    onClick={startLiveNavigation}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Play size={14} />
                    <span>▶️ 길안내 시작</span>
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

            {/* OVERLAID VISUAL LANDMARK & DYNAMIC USER GPS MARKER ON BLUEPRINT */}
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

              {/* START ENTRY PIN */}
              <div className="absolute left-[15%] top-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="p-2.5 rounded-full bg-blue-600 text-white shadow-xl ring-4 ring-blue-400/30">
                  <Building2 size={18} />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-lg bg-black/90 border border-blue-400 text-[10px] font-bold text-blue-300 shadow-xl whitespace-nowrap">
                  📍 {selectedPlace.buildingCode} 정문 출입구
                </span>
              </div>

              {/* DESTINATION PIN ON BLUEPRINT MAP */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30"
                style={{
                  left: `${selectedPlace.xPercent}%`,
                  top: `${selectedPlace.yPercent}%`,
                }}
              >
                <div className="p-3 rounded-full bg-red-600 text-white shadow-2xl ring-4 ring-red-500/50 animate-bounce">
                  <Building2 size={22} />
                </div>
                <span className="mt-1 px-3 py-1 rounded-lg bg-black/90 border border-red-400 text-xs font-black text-red-300 shadow-xl whitespace-nowrap">
                  🏁 도착: {selectedPlace.name}
                </span>
              </div>
            </div>

            {/* Bottom Current Step & Voice Turn Guidance Banner */}
            <div className="p-4 bg-black/95 border-t border-white/20 backdrop-blur-md z-20 flex flex-col md:flex-row items-center justify-between gap-3">
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
                      📍 {selectedPlace.name} ({selectedPlace.description})
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
                  onClick={() => {
                    const prevStep = Math.max(0, currentStep - 1);
                    setCurrentStep(prevStep);
                    speakText(routeSteps[prevStep].instruction);
                  }}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-neutral-800 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  이전
                </button>
                <button
                  onClick={() => {
                    const nextStep = Math.min(routeSteps.length - 1, currentStep + 1);
                    setCurrentStep(nextStep);
                    speakText(routeSteps[nextStep].instruction);
                  }}
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
              <span>네이버 지도 스타일 여성 음성 턴바이턴 길안내가 실제 출력 중입니다.</span>
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
