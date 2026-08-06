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
}

export const DETAILED_PLACES: DetailedPlace[] = [
  { id: 'p-1', name: 'C동 2층 블루라인 북카페', buildingId: 'bld-3', buildingCode: 'C동', floor: '2층', category: '카페', description: '도서관 로비 앞 커피, 디저트 및 스터디 공간' },
  { id: 'p-2', name: 'A동 지하1층 푸드코트 학생식당', buildingId: 'bld-1', buildingCode: 'A동', floor: '지하1층', category: '식당', description: '한식, 중식, 분식 및 글로벌 식단 배식대' },
  { id: 'p-3', name: 'B동 1층 24시간 무인 프린트실', buildingId: 'bld-2', buildingCode: 'B동', floor: '1층', category: '프린트실', description: '24시간 학생증 결제 무인 컬러/흑백 인쇄기' },
  { id: 'p-4', name: 'A동 1층 101호 유학생 지원 센터', buildingId: 'bld-1', buildingCode: 'A동', floor: '1층', category: '행정', description: '외국인등록증, 비자 연장, 수강신청 원스톱 상담 창구' },
  { id: 'p-5', name: 'B동 3층 301호 SW 코딩실습실', buildingId: 'bld-2', buildingCode: 'B동', floor: '3층', category: '강의실', description: '컴퓨터공학과 메인 듀얼모니터 코딩 실습실' },
  { id: 'p-6', name: 'C동 1층 종합 실내체육관 & 실버 돔', buildingId: 'bld-3', buildingCode: 'C동', floor: '1층', category: '강의실', description: '농구, 배드민턴, 스포츠 교양 및 대강당 아치 돔' },
  { id: 'p-7', name: 'D동 1층 유학생 커뮤니티 라운지', buildingId: 'bld-4', buildingCode: 'D동', floor: '1층', category: '카페', description: '외국인 유학생 다문화 버디 교류 라운지' },
  { id: 'p-8', name: 'B동 1층 104호 AI 컴퓨터랩', buildingId: 'bld-2', buildingCode: 'B동', floor: '1층', category: '강의실', description: '인공지능 GPU 서버 및 AI 실습실' },
  { id: 'p-9', name: 'A동 3층 305호 글로벌 화상회의실', buildingId: 'bld-1', buildingCode: 'A동', floor: '3층', category: '강의실', description: '국제 학술 발표 및 화상 강의실' },
  { id: 'p-10', name: 'B동 1층 CU 편의점', buildingId: 'bld-2', buildingCode: 'B동', floor: '1층', category: '식당', description: '학생 편의점 및 도시락 삼각김밥 코너' },
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

  const startLiveNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
    setProgressPercent(0);
    setRemainingDistance(140);

    const startMsg = `네비게이션 길안내를 시작합니다. 목적지는 ${selectedPlace.name}입니다. 정문에서 50미터 직진하세요.`;
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
          const arriveMsg = `목적지인 ${selectedPlace.name}에 도착했습니다. 네비게이션을 종료합니다.`;
          speakText(arriveMsg);
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          return 100;
        }

        const distLeft = Math.max(0, Math.round(140 * (1 - next / 100)));
        setRemainingDistance(distLeft);

        if (next > 40 && next < 45 && currentStep === 0) {
          setCurrentStep(1);
          speakText(`30미터 앞 중앙 분수대에서 ${selectedPlace.buildingCode} 방향으로 좌회전하세요.`);
        } else if (next > 80 && next < 85 && currentStep === 1) {
          setCurrentStep(2);
          speakText(`곧 목적지인 ${selectedPlace.name} 입구에 도착합니다.`);
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
      landmark: '정문 주출입구 & 중앙 잔디 운동장',
      instruction: `[${userLocationName}] 정문 입구를 지나 중앙 잔디 운동장 방향으로 50m 직진하세요.`,
      distance: '50m',
      icon: '⬆️',
    },
    {
      step: 2,
      landmark: `중앙 쉼터 분수대 & ${selectedPlace.buildingCode} 진입로`,
      instruction: `중앙 가로수길을 지나 ${selectedPlace.buildingCode} 건물로 좌회전 후 ${selectedPlace.floor}로 이동하세요.`,
      distance: '60m',
      icon: '↖️',
    },
    {
      step: 3,
      landmark: `${selectedPlace.name} 입구`,
      instruction: `${selectedPlace.name} (${selectedPlace.description})에 도착했습니다!`,
      distance: '30m',
      icon: '🏁',
    },
  ];

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
                  <h3 className="text-lg font-black tracking-tight">디테일 장소(강의실·카페·프린트실) 스마트 길찾기</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <LocateFixed size={10} />
                    Pinpoint Places GPS
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  단순 건물이 아닌 실제 수강 강의실, 북카페, 학생식당, 프린트실 핀포인트 안내
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
                  placeholder="도착할 장소명 검색 (예: 북카페, SW코딩실습실, 유학생 지원 센터, 푸드코트...)"
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

            {/* Places Chips Scrollable Ribbon */}
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

          {/* REAL CAMPUS SATELLITE MAP VISUAL NAVIGATION CANVAS */}
          <div className="flex-1 min-h-[300px] relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between bg-black">
            {/* REAL CAMPUS 3D PHOTO BACKGROUND IMAGE */}
            <img
              src="/images/myongji_3d_campus_mesh.png"
              alt="Myongji Campus Real Map Background"
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-110"
            />

            {/* Dark Overlay */}
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

            {/* Top Navigation HUD Bar */}
            <div className="flex items-center justify-between text-xs p-4 z-20">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/85 border border-white/20 backdrop-blur-md shadow-2xl">
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
                    <span>디테일 장소 길안내 시작</span>
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

              {/* Destination Pin: Selected Detailed Place */}
              <div className="absolute left-[75%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="p-3 rounded-full bg-red-600 text-white shadow-2xl ring-4 ring-red-500/50 animate-bounce">
                  <Building2 size={22} />
                </div>
                <span className="mt-1 px-3 py-1 rounded-lg bg-black/90 border border-red-400 text-xs font-black text-red-300 shadow-xl whitespace-nowrap">
                  🏁 도착: {selectedPlace.name}
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
              <span>선택하신 [{selectedPlace.name}]까지의 핀포인트 음성 길안내가 연결되었습니다.</span>
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
