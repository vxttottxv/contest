import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  MapPin,
  Footprints,
  X,
  Building2,
  CheckCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { Building3D } from '../services/campusMapApi';

interface IndoorFloorNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building3D | null;
  allBuildings: Building3D[];
}

interface RoomDestination {
  roomId: string;
  roomName: string;
  floor: number;
  description: string;
  pathSteps: {
    step: number;
    instruction: string;
    distance: string;
    icon: string;
  }[];
}

const ROOM_DESTINATIONS: Record<string, RoomDestination[]> = {
  'bld-1': [ // A동 본관
    {
      roomId: 'a-101',
      roomName: '1층 101호 유학생 지원 센터 & 학사행정실',
      floor: 1,
      description: '외국인등록증, 비자 체류 연장 및 학사 수강 상담 창구',
      pathSteps: [
        { step: 1, instruction: '본관 1층 정문 출입구 진입 후 로비 중앙으로 10m 이동하세요.', distance: '10m', icon: '⬆️' },
        { step: 2, instruction: '로비 오른쪽 유학생 지원 센터 전용 안내 창구로 진입하세요.', distance: '5m', icon: '↗️' },
        { step: 3, instruction: '101호 종합지원센터 안내 창구 도착입니다.', distance: '3m', icon: '🏁' },
      ],
    },
    {
      roomId: 'a-b1',
      roomName: '지하 1층 푸드코트 학생식당',
      floor: -1,
      description: '한식/양식/글로벌 맞춤형 중앙 학생식당',
      pathSteps: [
        { step: 1, instruction: '본관 1층 로비 중앙 계단에서 지하 1층 방향 계단으로 내려가세요.', distance: '15m', icon: '⬇️' },
        { step: 2, instruction: '지하 계단에서 하차 후 좌측 식권 발권기 방향으로 직진하세요.', distance: '10m', icon: '↙️' },
        { step: 3, instruction: '학생식당 입구 도착입니다. 식권을 제출하고 배식대로 이동하세요.', distance: '5m', icon: '🏁' },
      ],
    },
    {
      roomId: 'a-305',
      roomName: '3층 305호 글로벌 화상회의실',
      floor: 3,
      description: '글로벌 학술 발표 및 온라인 화상회의실',
      pathSteps: [
        { step: 1, instruction: '본관 1층 로비 중앙 엘리베이터 승강장으로 이동하여 3층 버튼을 누르세요.', distance: '12m', icon: '🛗' },
        { step: 2, instruction: '3층 엘리베이터에서 하차 후 우측 복도로 20m 직진하세요.', distance: '20m', icon: '➡️' },
        { step: 3, instruction: '우측 305호 화상회의실 도어록 입구에 도착했습니다.', distance: '3m', icon: '🏁' },
      ],
    },
  ],
  'bld-2': [ // B동 공학관
    {
      roomId: 'b-101',
      roomName: '1층 24시간 무인 프린트실 & CU 편의점',
      floor: 1,
      description: '24시간 무인 문서 출력, 복사 및 학생 편의점',
      pathSteps: [
        { step: 1, instruction: '공학관(B동) 동측 중앙 출입구로 진입하세요.', distance: '8m', icon: '⬆️' },
        { step: 2, instruction: '엘리베이터 우측 복도를 따라 15m 직진하세요.', distance: '15m', icon: '➡️' },
        { step: 3, instruction: '24시 무인 프린트실 및 CU 편의점 입구 도착입니다.', distance: '4m', icon: '🏁' },
      ],
    },
    {
      roomId: 'b-301',
      roomName: '3층 301호 SW 코딩실습실',
      floor: 3,
      description: '컴퓨터공학과 메인 코딩 실습 & 프로젝트 랩실',
      pathSteps: [
        { step: 1, instruction: '공학관 1층 엘리베이터 탑승 후 3층으로 이동하세요.', distance: '15m', icon: '🛗' },
        { step: 2, instruction: '3층 내린 후 좌측 복도 끝 301호 방향으로 25m 직진하세요.', distance: '25m', icon: '⬅️' },
        { step: 3, instruction: '301호 SW 코딩실습실 입구 도착입니다.', distance: '2m', icon: '🏁' },
      ],
    },
  ],
  'bld-3': [ // C동 예체능관
    {
      roomId: 'c-101',
      roomName: '1층 종합 실내체육관 & 실버 돔',
      floor: 1,
      description: '농구, 배드민턴, 스포츠 교양 및 아치 돔 실내 체육관',
      pathSteps: [
        { step: 1, instruction: '예체능관(C동) 정문 출입구로 진입하세요.', distance: '10m', icon: '⬆️' },
        { step: 2, instruction: '로비 정면 실버 돔 체육관 아치 문으로 진입하세요.', distance: '12m', icon: '➡️' },
        { step: 3, instruction: '종합 실내체육관 메인 코트 도착입니다.', distance: '5m', icon: '🏁' },
      ],
    },
  ],
  'bld-4': [ // D동 사회교육관
    {
      roomId: 'd-101',
      roomName: '1층 유학생 다문화 커뮤니티 라운지',
      floor: 1,
      description: '글로벌 유학생 교류 및 스터디 전용 라운지',
      pathSteps: [
        { step: 1, instruction: '사회교육관(D동) 1층 카드키 출입문으로 진입하세요.', distance: '10m', icon: '⬆️' },
        { step: 2, instruction: '로비 좌측 유리벽 다문화 라운지로 들어오세요.', distance: '8m', icon: '↖️' },
        { step: 3, instruction: '글로벌 커뮤니티 라운지 도착입니다.', distance: '2m', icon: '🏁' },
      ],
    },
  ],
};

export default function IndoorFloorNavigationModal({
  isOpen,
  onClose,
  building,
  allBuildings,
}: IndoorFloorNavigationModalProps) {
  const [selectedBld, setSelectedBld] = useState<Building3D | null>(building);
  const [selectedRoom, setSelectedRoom] = useState<RoomDestination | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Animation Engine
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const animTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (building) {
      setSelectedBld(building);
    } else if (allBuildings.length > 0) {
      setSelectedBld(allBuildings[0]);
    }
  }, [building, allBuildings]);

  useEffect(() => {
    if (selectedBld) {
      const rooms = ROOM_DESTINATIONS[selectedBld.id] || [];
      if (rooms.length > 0) {
        setSelectedRoom(rooms[0]);
        setCurrentStep(0);
        setProgressPercent(0);
      }
    }
  }, [selectedBld]);

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

  const startIndoorNavigation = () => {
    if (!selectedRoom) return;
    setIsNavigating(true);
    setCurrentStep(0);
    setProgressPercent(0);

    const startMsg = `${selectedBld?.name.split('(')[0]} 실내 층별 길안내를 시작합니다. 목적지는 ${selectedRoom.roomName}입니다. ${selectedRoom.pathSteps[0].instruction}`;
    speakText(startMsg);

    if (animTimerRef.current) clearInterval(animTimerRef.current);

    animTimerRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + 2.0;
        if (next >= 100) {
          if (animTimerRef.current) clearInterval(animTimerRef.current);
          setIsNavigating(false);
          setCurrentStep(selectedRoom.pathSteps.length - 1);
          speakText(`목적지인 ${selectedRoom.roomName}에 도착했습니다. 실내 길안내를 종료합니다.`);
          return 100;
        }

        if (next > 35 && next < 40 && currentStep === 0) {
          setCurrentStep(1);
          if (selectedRoom.pathSteps[1]) {
            speakText(selectedRoom.pathSteps[1].instruction);
          }
        } else if (next > 75 && next < 80 && currentStep === 1) {
          setCurrentStep(2);
          if (selectedRoom.pathSteps[2]) {
            speakText(selectedRoom.pathSteps[2].instruction);
          }
        }

        return next;
      });
    }, 150);
  };

  const stopIndoorNavigation = () => {
    if (animTimerRef.current) clearInterval(animTimerRef.current);
    setIsNavigating(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const resetIndoorNavigation = () => {
    stopIndoorNavigation();
    setProgressPercent(0);
    setCurrentStep(0);
  };

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  if (!isOpen || !selectedBld || !selectedRoom) return null;

  const currentRoomsList = ROOM_DESTINATIONS[selectedBld.id] || [];

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
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
                <Layers size={22} className="text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">건물 내부 층별 상세 길찾기 네비게이션</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles size={10} />
                    Indoor Floor Plan CAD
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  건물 진입 후 로비, 엘리베이터/계단 층간 이동 및 실내 강의실 핀포인트 안내
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                  isVoiceMuted
                    ? 'bg-neutral-800 border-white/10 text-neutral-500'
                    : 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                }`}
                title="음성 길안내 ON/OFF"
              >
                {isVoiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button
                onClick={() => {
                  stopIndoorNavigation();
                  onClose();
                }}
                className="p-2.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Building & Room Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
            {/* Building Switcher */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-blue-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">건물 선택</span>
                  <span className="text-xs font-bold text-blue-300">{selectedBld.code}: {selectedBld.name.split('(')[0]}</span>
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto max-w-[200px]">
                {allBuildings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBld(b);
                      resetIndoorNavigation();
                    }}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                      selectedBld.id === b.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {b.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Room / Facility Selector */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-purple-400 shrink-0 animate-bounce" />
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">목적 강의실 / 편의시설</span>
                  <span className="text-xs font-bold text-purple-300 truncate max-w-[160px] block">
                    {selectedRoom.roomName}
                  </span>
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto max-w-[200px]">
                {currentRoomsList.map((rm) => (
                  <button
                    key={rm.roomId}
                    onClick={() => {
                      setSelectedRoom(rm);
                      resetIndoorNavigation();
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                      selectedRoom.roomId === rm.roomId
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {rm.roomName.split(' ')[0]} {rm.roomName.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* INDOOR BLUEPRINT NAVIGATION CANVAS */}
          <div className="flex-1 min-h-[340px] relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between bg-neutral-950 p-6">
            {/* CAD Floor Blueprint Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(147,51,234,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.4) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top Navigation Summary HUD */}
            <div className="flex items-center justify-between text-xs z-20">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md">
                <span className="text-purple-400 font-extrabold flex items-center gap-1">
                  <Layers size={16} />
                  목적지: <strong>{selectedRoom.roomName}</strong>
                </span>
                <span className="text-neutral-500">|</span>
                <span className="flex items-center gap-1 font-bold text-emerald-400">
                  <Footprints size={16} />
                  실내 이동 거리: <strong>약 30m</strong>
                </span>
              </div>

              {/* Start / Stop Indoor Navigation Buttons */}
              <div className="flex items-center gap-2">
                {!isNavigating ? (
                  <button
                    onClick={startIndoorNavigation}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Play size={14} />
                    <span>실내 층별 길안내 시작</span>
                  </button>
                ) : (
                  <button
                    onClick={stopIndoorNavigation}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Pause size={14} />
                    <span>일시정지</span>
                  </button>
                )}
                <button
                  onClick={resetIndoorNavigation}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="초기화"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* INDOOR BLUEPRINT ROOM LAYOUT GRAPHIC */}
            <div className="my-4 grid grid-cols-4 gap-3 z-20">
              <div className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
                currentStep === 0 ? 'bg-blue-900/60 border-blue-400 ring-2 ring-blue-400 shadow-xl' : 'bg-neutral-900/80 border-white/10'
              }`}>
                <span className="text-[10px] font-bold text-blue-400 block">START (1층 로비)</span>
                <span className="text-xs font-bold text-white block">1F 정문 주 출입구</span>
                <span className="text-[10px] text-neutral-400">안내데스크 / 승강장 진입</span>
              </div>

              <div className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
                currentStep === 1 ? 'bg-amber-900/60 border-amber-400 ring-2 ring-amber-400 shadow-xl' : 'bg-neutral-900/80 border-white/10'
              }`}>
                <span className="text-[10px] font-bold text-amber-400 block">TRANSITION (층간 이동)</span>
                <span className="text-xs font-bold text-white block">
                  {selectedRoom.floor === 1 ? '1층 복도 중앙' : `${selectedRoom.floor}층 엘리베이터`}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {selectedRoom.floor === 1 ? '직진 이동' : '엘리베이터/계단 이용'}
                </span>
              </div>

              <div className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
                currentStep === 2 ? 'bg-purple-900/60 border-purple-400 ring-2 ring-purple-400 shadow-xl' : 'bg-neutral-900/80 border-white/10'
              }`}>
                <span className="text-[10px] font-bold text-purple-400 block">CORRIDOR (복도)</span>
                <span className="text-xs font-bold text-white block">
                  {selectedRoom.floor < 0 ? '지하 1층 복도' : `${selectedRoom.floor}층 메인 복도`}
                </span>
                <span className="text-[10px] text-neutral-400">목적 방 도어락 복도</span>
              </div>

              <div className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
                progressPercent >= 95 ? 'bg-emerald-900/60 border-emerald-400 ring-2 ring-emerald-400 shadow-xl' : 'bg-neutral-900/80 border-white/10'
              }`}>
                <span className="text-[10px] font-bold text-emerald-400 block">DESTINATION (도착)</span>
                <span className="text-xs font-bold text-white block truncate">{selectedRoom.roomName.split('호')[0]}호</span>
                <span className="text-[10px] text-neutral-400">입실 완료</span>
              </div>
            </div>

            {/* Bottom Current Indoor Step Banner */}
            <div className="p-4 bg-neutral-900/90 border border-white/10 backdrop-blur-md rounded-2xl z-20 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 rounded-2xl bg-purple-600/30 border border-purple-400/40 text-purple-300 font-bold">
                  {selectedRoom.pathSteps[currentStep]?.icon || '➡️'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      실내 STEP {currentStep + 1} / {selectedRoom.pathSteps.length}
                    </span>
                    <span className="text-xs font-bold text-purple-300">
                      📍 {selectedRoom.roomName}
                    </span>
                  </div>
                  <p className="text-xs font-black text-white mt-1">
                    {selectedRoom.pathSteps[currentStep]?.instruction}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-neutral-800 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  이전
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(selectedRoom.pathSteps.length - 1, prev + 1))}
                  disabled={currentStep === selectedRoom.pathSteps.length - 1}
                  className="px-4 py-2 bg-purple-600 disabled:opacity-40 text-xs font-bold rounded-xl hover:bg-purple-500 transition-colors cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  다음
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-1 shrink-0">
            <span className="text-xs text-neutral-400">
              실내 안내 관련 문의: <strong>02-300-9999 (학사행정실)</strong>
            </span>
            <button
              onClick={() => {
                stopIndoorNavigation();
                onClose();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle size={16} />
              <span>실내 길안내 종료</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
