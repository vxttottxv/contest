import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coffee,
  Heart,
  X,
  Sparkles,
  MessageCircle,
  Gamepad2,
  Trophy,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Send,
  Zap,
  Ticket,
  Clock,
  MapPin,
  Check,
  UserPlus,
  User,
  Edit3,
  Flame,
  Award,
  AlertCircle,
  Play,
} from 'lucide-react';
import {
  MOCK_TINDER_PROFILES,
  MOCK_QUIZ_QUESTIONS,
  MOCK_LEADERBOARD,
  MOCK_SOCIAL_EVENTS,
} from '../services/loungeApi';
import type { LoungeProfile, ChatMessage, SocialEvent, LeaderboardEntry } from '../services/loungeApi';

interface LoungePageProps {
  onBack: () => void;
}

export default function LoungePage({ onBack }: LoungePageProps) {
  const [activeTab, setActiveTab] = useState<'matching' | 'game' | 'events'>('matching');

  // Track if user has completed initial profile creation onboarding
  const [isProfileCreated, setIsProfileCreated] = useState<boolean>(() => {
    return localStorage.getItem('user_my_lounge_profile_created') === 'true';
  });

  // User's Own Lounge Profile State (Saved in LocalStorage)
  const [myProfile, setMyProfile] = useState<LoungeProfile>(() => {
    const saved = localStorage.getItem('user_my_lounge_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'my-profile',
      name: '',
      age: 0,
      gender: '',
      nationality: '',
      major: '',
      mbti: '',
      languages: [],
      hobbies: [],
      bio: '',
      avatar: '',
      aiMatchScore: 0,
    };
  });

  // Edit My Profile Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState(myProfile.name);
  const [editAge, setEditAge] = useState(myProfile.age);
  const [editGender, setEditGender] = useState(myProfile.gender);
  const [editNationality, setEditNationality] = useState(myProfile.nationality);
  const [editMajor, setEditMajor] = useState(myProfile.major);
  const [editMbti, setEditMbti] = useState(myProfile.mbti);
  const [editLanguages, setEditLanguages] = useState(myProfile.languages.join(', '));
  const [editHobbies, setEditHobbies] = useState(myProfile.hobbies.join(', '));
  const [editBio, setEditBio] = useState(myProfile.bio);
  const [editAvatar, setEditAvatar] = useState(myProfile.avatar);

  // Tinder Swiping States - CONTAINS ONLY OTHER STUDENTS' PROFILES
  const [profiles] = useState<LoungeProfile[]>(MOCK_TINDER_PROFILES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [matchedProfile, setMatchedProfile] = useState<LoungeProfile | null>(null);

  // Chat Modal State
  const [activeChatProfile, setActiveChatProfile] = useState<LoungeProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState<string>('');

  // EXCITING ARCADE SPEED QUIZ ENGINE STATES
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [lastEarnedPoints, setLastEarnedPoints] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(10);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  // Scoreboard Leaderboard List
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);

  // Social Events State
  const [events, setEvents] = useState<SocialEvent[]>(MOCK_SOCIAL_EVENTS);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentProfile = profiles[currentIndex] || profiles[0];

  // 10-Second Countdown Timer for Speed Quiz
  useEffect(() => {
    if (activeTab === 'game' && isGameStarted && !isQuizCompleted && selectedOption === null) {
      setTimerSeconds(10);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            // Time Out - Auto Select Wrong
            setSelectedOption(-1);
            setComboCount(0);
            setLastEarnedPoints(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeTab, isGameStarted, currentQuizIndex, isQuizCompleted, selectedOption]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setUserScore(0);
    setComboCount(0);
    setLastEarnedPoints(0);
    setIsQuizCompleted(false);
  };

  const handleSaveMyProfile = () => {
    const updatedProfile: LoungeProfile = {
      ...myProfile,
      name: editName,
      age: Number(editAge),
      gender: editGender,
      nationality: editNationality,
      major: editMajor,
      mbti: editMbti,
      languages: editLanguages.split(',').map((s) => s.trim()).filter(Boolean),
      hobbies: editHobbies.split(',').map((s) => s.trim()).filter(Boolean),
      bio: editBio,
      avatar: editAvatar || myProfile.avatar,
    };

    setMyProfile(updatedProfile);
    localStorage.setItem('user_my_lounge_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('user_my_lounge_profile_created', 'true');
    setIsProfileCreated(true);
    setIsEditProfileModalOpen(false);
  };

  // Swipe Action Handlers
  const handlePass = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handleLikeMatch = () => {
    const matched = currentProfile;
    setMatchedProfile(matched);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Open Chat with Matched Peer
  const handleOpenChat = (profile: LoungeProfile) => {
    setMatchedProfile(null);
    setActiveChatProfile(profile);
    setChatMessages([
      {
        id: 'msg-1',
        sender: 'peer',
        text: `안녕하세요! ${profile.name}입니다! AI 매칭율이 ${profile.aiMatchScore}%로 나와서 반가워요 😊`,
        timestamp: '방금 전',
      },
    ]);
  };

  const handleSendChatMessage = () => {
    if (!chatInputText.trim() || !activeChatProfile) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInputText.trim(),
      timestamp: '방금 전',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInputText('');

    setTimeout(() => {
      const peerMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'peer',
        text: `메시지 감사합니다! 이번 주에 학식(A동 학생식당)이나 C동 북카페에서 커피 한잔하며 언어교환해요! ☕`,
        timestamp: '방금 전',
      };
      setChatMessages((prev) => [...prev, peerMsg]);
    }, 1000);
  };

  // Speed Quiz Answer Handler
  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setSelectedOption(idx);

    const currentQuiz = MOCK_QUIZ_QUESTIONS[currentQuizIndex];
    const isCorrect = idx === currentQuiz.correctIndex;

    if (isCorrect) {
      const newCombo = comboCount + 1;
      setComboCount(newCombo);

      // Score Formula: Base 100 + Speed Bonus (Time * 15) + Combo Bonus (Combo * 50)
      const speedBonus = timerSeconds * 15;
      const comboBonus = (newCombo - 1) * 50;
      const totalEarned = 100 + speedBonus + comboBonus;

      setLastEarnedPoints(totalEarned);
      setUserScore((prev) => prev + totalEarned);

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } else {
      setComboCount(0);
      setLastEarnedPoints(0);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < MOCK_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleSubmitScoreToLeaderboard = () => {
    const myEntry: LeaderboardEntry = {
      rank: 1,
      name: myProfile.name,
      nationality: myProfile.nationality,
      score: userScore,
      badge: '🔥 NEW SPEED KING',
    };

    const newLeaderboard = [myEntry, ...leaderboardList]
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    setLeaderboardList(newLeaderboard);
  };

  // Social Event Apply Handler
  const handleToggleEventApply = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const isApplying = !evt.isApplied;
          return {
            ...evt,
            isApplied: isApplying,
            currentParticipants: isApplying ? evt.currentParticipants + 1 : Math.max(0, evt.currentParticipants - 1),
          };
        }
        return evt;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-white flex flex-col font-sans selection:bg-[#A3A3CC]/30 relative selection:text-white pb-20">
      {/* Halftone Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Pastel Liquid Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#292966]/40 rounded-[100%] blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-[#A3A3CC]/15 rounded-[100%] blur-[120px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-[#0b0b14]/70 backdrop-blur-3xl border-b border-[#A3A3CC]/10 sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>메인으로</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#CCCCFF] shadow-lg shadow-[#CCCCFF]/20">
              <Coffee size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">Lounge (라운지·교류 & 아케이드)</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#CCCCFF]/20 text-[#CCCCFF] border border-[#CCCCFF]/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  AI Matching & Speed Arcade
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                AI 프렌즈 매칭, 10초 스피드 어택 아케이드 퀴즈 & 밋업 소식
              </p>
            </div>
          </div>
        </div>

        {/* UPLOAD / EDIT MY PROFILE BUTTON */}
        <button
          onClick={() => {
            setEditName(myProfile.name);
            setEditAge(myProfile.age);
            setEditGender(myProfile.gender);
            setEditNationality(myProfile.nationality);
            setEditMajor(myProfile.major);
            setEditMbti(myProfile.mbti);
            setEditLanguages(myProfile.languages.join(', '));
            setEditHobbies(myProfile.hobbies.join(', '));
            setEditBio(myProfile.bio);
            setEditAvatar(myProfile.avatar);
            setIsEditProfileModalOpen(true);
          }}
          className="px-4 py-2 bg-[#CCCCFF] hover:from-[#CCCCFF] hover:to-[#CCCCFF] text-white font-black text-xs rounded-2xl shadow-lg shadow-[#CCCCFF]/30 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          {isProfileCreated ? <Edit3 size={15} /> : <UserPlus size={15} />}
          <span>{isProfileCreated ? '내 프로필 수정' : '내 프로필 작성하기'}</span>
        </button>
      </header>

      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-8 space-y-6 flex-1">
        {/* DOMAIN TABS NAVIGATION */}
        <div className="flex items-center justify-center md:justify-start gap-2 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'matching'
                ? 'bg-[#CCCCFF] text-white shadow-lg shadow-[#CCCCFF]/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart size={16} />
            <span>🔥 AI 프렌즈 매칭 (Tinder Swipe)</span>
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-gradient-to-br from-[#CCCCFF] to-[#A3A3CC] text-white shadow-lg shadow-[#CCCCFF]/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 size={16} />
            <span>🎮 ⚡ 스피드 어택 퀴즈 & 랭킹</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-[#A3A3CC] to-cyan-600 text-white shadow-lg shadow-[#A3A3CC]/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ticket size={16} />
            <span>🎟️ 이벤트 & 밋업 소식</span>
          </button>
        </div>

        {/* TAB 1: TINDER-STYLE AI FRIENDS MATCHING */}
        {activeTab === 'matching' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center space-y-6">
            {!isProfileCreated ? (
              <div className="w-full max-w-xl p-8 rounded-3xl border-2 border-[#CCCCFF]/50 bg-gradient-to-b from-neutral-900 via-neutral-900 to-rose-950/30 backdrop-blur-xl shadow-2xl space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[#CCCCFF]/20 border-2 border-[#CCCCFF] text-[#CCCCFF] mx-auto flex items-center justify-center animate-bounce">
                  <UserPlus size={40} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">AI 프렌즈 매칭에 오신 것을 환영합니다! 🎉</h2>
                  <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed font-medium">
                    매칭을 시작하기 전, 상대방에게 보일 <strong className="text-[#CCCCFF]">본인의 내 프로필</strong>을 먼저 작성해주세요.<br />
                    작성이 완료되면 성향이 맞는 다른 유학생들의 프로필만 스와이프하며 매칭할 수 있습니다!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 text-left text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#CCCCFF]">
                    <CheckCircle2 size={16} />
                    <span>프로필 등록 시 제공되는 혜택:</span>
                  </div>
                  <ul className="list-disc list-inside text-neutral-400 space-y-1 pl-1">
                    <li>AI 알고리즘이 내 성향/MBTI/언어 목표와 90% 이상 일치하는 친구 추천</li>
                    <li>상대방과 매칭 시 즉시 1:1 라이브 대화 가능</li>
                    <li>언어 교환, 학식 친구, 소모임 버디 매칭 연결</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setEditName(myProfile.name);
                    setEditAge(myProfile.age);
                    setEditGender(myProfile.gender);
                    setEditNationality(myProfile.nationality);
                    setEditMajor(myProfile.major);
                    setEditMbti(myProfile.mbti);
                    setEditLanguages(myProfile.languages.join(', '));
                    setEditHobbies(myProfile.hobbies.join(', '));
                    setEditBio(myProfile.bio);
                    setEditAvatar(myProfile.avatar);
                    setIsEditProfileModalOpen(true);
                  }}
                  className="w-full py-4 bg-[#CCCCFF] hover:from-[#CCCCFF] hover:to-[#CCCCFF] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#CCCCFF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus size={18} />
                  <span>💖 내 프로필 작성하고 매칭 시작하기!</span>
                </button>
              </div>
            ) : (
              <>
                <div className="relative w-full max-w-md h-[540px] rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-neutral-950 flex flex-col justify-between group">
                  <img
                    src={currentProfile.avatar}
                    alt={currentProfile.name}
                    className="absolute inset-0 w-full h-full object-cover filter brightness-90 transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

                  <div className="relative z-10 p-5 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#CCCCFF]/80 border border-[#CCCCFF]/50 backdrop-blur-md text-white font-black text-xs shadow-xl flex items-center gap-1.5 animate-pulse">
                      <Zap size={14} className="text-[#CCCCFF] fill-amber-300" />
                      ⚡ AI 성향 일치도 {currentProfile.aiMatchScore}%
                    </span>

                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-bold backdrop-blur-md text-white">
                      {currentIndex + 1} / {profiles.length}
                    </span>
                  </div>

                  <div className="relative z-10 p-6 space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-white">{currentProfile.name}, {currentProfile.age}</h2>
                        <span className="px-2.5 py-0.5 rounded bg-white/20 text-xs font-bold text-white backdrop-blur-md">
                          {currentProfile.nationality}
                        </span>
                      </div>
                      <p className="text-xs text-[#CCCCFF] font-bold mt-1">
                        📚 {currentProfile.major} | MBTI: {currentProfile.mbti}
                      </p>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed font-medium bg-black/40 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                      "{currentProfile.bio}"
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        <span className="text-[10px] font-bold text-neutral-400 shrink-0">언어:</span>
                        {currentProfile.languages.map((lang, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-[#A3A3CC]/20 text-[#A3A3CC] text-[10px] font-bold border border-[#A3A3CC]/30 shrink-0">
                            {lang}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        <span className="text-[10px] font-bold text-neutral-400 shrink-0">취미:</span>
                        {currentProfile.hobbies.map((hob, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-[#CCCCFF]/20 text-[#CCCCFF] text-[10px] font-bold border border-[#CCCCFF]/30 shrink-0">
                            #{hob}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 z-20">
                  <button
                    onClick={handlePass}
                    className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-red-500/50 hover:border-red-500 hover:bg-red-950/50 text-red-400 flex items-center justify-center shadow-2xl transition-all cursor-pointer active:scale-90"
                    title="지나가기 (PASS)"
                  >
                    <X size={28} />
                  </button>

                  <button
                    onClick={handleLikeMatch}
                    className="w-20 h-20 rounded-full bg-[#CCCCFF] hover:from-[#CCCCFF] hover:to-[#CCCCFF] text-white flex items-center justify-center shadow-2xl shadow-[#CCCCFF]/40 transition-all cursor-pointer active:scale-95 animate-bounce"
                    title="좋아요 & AI 매칭하기 (MATCH)"
                  >
                    <Heart size={36} className="fill-white" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* TAB 2: EXCITING HIGH-QUALITY SPEED ATTACK ARCADE QUIZ */}
        {activeTab === 'game' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Speed Arcade Quiz Arena */}
            <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#A3A3CC]/5 to-transparent border border-[#A3A3CC]/10 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] space-y-6 shadow-2xl relative overflow-hidden">
              {!isGameStarted ? (
                /* GAME START LANDING SCREEN */
                <div className="py-8 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-[#CCCCFF] p-1 mx-auto shadow-2xl shadow-[#CCCCFF]/40 animate-pulse">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                      <Zap size={44} className="text-[#CCCCFF] fill-amber-400" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      ⚡ 10초 스피드 어택 K-컬처 & 캠퍼스 아케이드 퀴즈!
                    </h2>
                    <p className="text-xs text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed font-medium">
                      문제당 주어진 시간은 오직 <strong className="text-[#CCCCFF]">10초!</strong> 빠른 정답일수록 <strong className="text-[#CCCCFF]">스피드 보너스</strong>가 팍팍!<br />
                      연속 정답 시 <strong className="text-[#CCCCFF]">🔥 COMBO 연타 스코어</strong> 폭발! 랭킹 1위에 도전하세요!
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs">
                    <div className="p-3 rounded-2xl bg-purple-950/60 border border-[#CCCCFF]/30">
                      <span className="block font-black text-[#CCCCFF]">⏱️ 스피드 보너스</span>
                      <span className="text-[10px] text-neutral-400">남은 시간 × 15pt 추가</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-rose-950/60 border border-[#CCCCFF]/30">
                      <span className="block font-black text-[#CCCCFF]">🔥 COMBO 연타</span>
                      <span className="text-[10px] text-neutral-400">연속 정답 시 +50pt 콤보</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-amber-950/60 border border-[#CCCCFF]/30">
                      <span className="block font-black text-[#CCCCFF]">🏆 랭킹 등록</span>
                      <span className="text-[10px] text-neutral-400">명예의 전당 등극</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartGame}
                    className="px-8 py-4 bg-gradient-to-r from-[#CCCCFF] via-pink-600 to-[#CCCCFF] hover:from-[#CCCCFF] hover:to-[#CCCCFF] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#CCCCFF]/30 flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all active:scale-95"
                  >
                    <Play size={20} className="fill-white" />
                    <span>🎮 퀴즈 게임 스타트!</span>
                  </button>
                </div>
              ) : !isQuizCompleted ? (
                /* IN-GAME QUIZ ARENA WITH 10-SECOND TIMER & COMBO SYSTEM */
                <>
                  {/* Top HUD Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#CCCCFF]/30 text-[#CCCCFF] text-xs font-black border border-[#CCCCFF]/40">
                        {MOCK_QUIZ_QUESTIONS[currentQuizIndex].category}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">
                        문제 {currentQuizIndex + 1} / {MOCK_QUIZ_QUESTIONS.length}
                      </span>
                    </div>

                    {/* Combo Streak & Score HUD */}
                    <div className="flex items-center gap-4">
                      {comboCount >= 2 && (
                        <span className="px-3 py-1 rounded-full bg-[#CCCCFF] text-white text-xs font-black shadow-lg animate-bounce flex items-center gap-1">
                          <Flame size={14} className="fill-white" />
                          {comboCount} COMBO STREAK!
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 text-[#CCCCFF] font-mono font-black text-base">
                        <Trophy size={18} />
                        <span>{userScore} pt</span>
                      </div>
                    </div>
                  </div>

                  {/* 10-SECOND SPEED COUNTDOWN BAR */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1 text-[#CCCCFF]">
                        <Clock size={14} className="animate-spin" />
                        <span>남은 시간: {timerSeconds}초</span>
                      </span>
                      <span className="text-neutral-400 text-[11px]">빠르게 맞힐수록 고득점!</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-white/10">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          timerSeconds > 5
                            ? 'bg-gradient-to-r from-[#5C5C99] to-cyan-500'
                            : timerSeconds > 2
                            ? 'bg-gradient-to-r from-[#CCCCFF] to-orange-500'
                            : 'bg-gradient-to-r from-red-600 to-[#CCCCFF] animate-pulse'
                        }`}
                        style={{ width: `${(timerSeconds / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Title */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xl font-black text-white leading-relaxed tracking-tight">
                      Q{currentQuizIndex + 1}. {MOCK_QUIZ_QUESTIONS[currentQuizIndex].question}
                    </h3>
                  </div>

                  {/* 4 Arcade Option Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {MOCK_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === MOCK_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
                      let btnStyle = 'bg-neutral-950 border-white/10 hover:border-[#CCCCFF]/50 hover:bg-neutral-900 text-white';

                      if (selectedOption !== null) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950 border-[#5C5C99] text-[#5C5C99] ring-2 ring-emerald-400 shadow-xl shadow-[#5C5C99]/20';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-950 border-red-500 text-red-200 ring-2 ring-red-400';
                        } else {
                          btnStyle = 'bg-neutral-950/40 border-white/5 opacity-40 text-neutral-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={selectedOption !== null}
                          className={`p-4 rounded-2xl border text-left font-extrabold text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{idx + 1}. {opt}</span>
                          {selectedOption !== null && isCorrect && (
                            <span className="flex items-center gap-1 text-[#5C5C99] text-xs font-black">
                              <CheckCircle2 size={18} /> 정답!
                            </span>
                          )}
                          {selectedOption !== null && isSelected && !isCorrect && (
                            <span className="flex items-center gap-1 text-red-400 text-xs font-black">
                              <AlertCircle size={18} /> 오답
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Result & Explanation Banner */}
                  {selectedOption !== null && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-neutral-950 border border-white/15 space-y-3 shadow-2xl">
                      <div className="flex items-center justify-between">
                        {selectedOption === MOCK_QUIZ_QUESTIONS[currentQuizIndex].correctIndex ? (
                          <div className="flex items-center gap-2 text-[#5C5C99] font-black text-sm">
                            <Sparkles size={18} />
                            <span>정답입니다! (+{lastEarnedPoints}점 획득 🎉)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-400 font-black text-sm">
                            <X size={18} />
                            <span>아쉽네요! 시간 초과 또는 오답입니다.</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-neutral-300 font-medium leading-relaxed">
                        💡 해설: {MOCK_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                      </p>

                      <button
                        onClick={handleNextQuiz}
                        className="w-full py-3 bg-[#CCCCFF] hover:from-[#CCCCFF] hover:to-[#CCCCFF] text-white text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-[#CCCCFF]/30 transition-all"
                      >
                        {currentQuizIndex < MOCK_QUIZ_QUESTIONS.length - 1 ? '다음 문제 풀기 ➔' : '최종 🏆 아케이드 결과 보기'}
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                /* GAME COMPLETE RESULT VIEW */
                <div className="py-10 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-[#CCCCFF]/20 border-2 border-[#CCCCFF] text-[#CCCCFF] mx-auto flex items-center justify-center animate-bounce">
                    <Trophy size={48} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white">🏆 아케이드 퀴즈 완료!</h3>
                    <p className="text-base font-black text-[#CCCCFF]">최종 획득 스코어: {userScore} 점</p>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleSubmitScoreToLeaderboard}
                      className="px-6 py-3 bg-gradient-to-r from-[#CCCCFF] to-orange-500 text-white text-xs font-black rounded-xl shadow-lg shadow-[#CCCCFF]/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award size={16} />
                      <span>내 점수 랭킹 스코어보드에 등록!</span>
                    </button>

                    <button
                      onClick={handleStartGame}
                      className="px-6 py-3 bg-[#CCCCFF] hover:bg-[#CCCCFF] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#CCCCFF]/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      <span>다시 도전하기</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Col: Scoreboard Leaderboard */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#A3A3CC]/5 to-transparent border border-[#A3A3CC]/10 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] space-y-4 shadow-xl">
              <h3 className="text-base font-black text-[#CCCCFF] flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-2">
                  <Trophy size={18} />
                  <span>유학생 명예의 전당 랭킹</span>
                </span>
                <span className="text-[10px] text-neutral-400">Live Board</span>
              </h3>

              <div className="space-y-3">
                {leaderboardList.map((item) => (
                  <div
                    key={item.rank}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      item.rank === 1
                        ? 'bg-amber-950/40 border-[#CCCCFF]/50 text-[#CCCCFF] shadow-md'
                        : item.rank === 2
                        ? 'bg-neutral-800 border-white/20 text-white'
                        : 'bg-neutral-950 border-white/10 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm w-6 text-center">{item.rank}위</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name} ({item.nationality})</h4>
                        <span className="text-[10px] text-neutral-400">{item.badge}</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-xs text-[#CCCCFF]">{item.score}pt</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SOCIAL EVENTS & MEETUP NOTICE */}
        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-3xl border border-white/10 bg-neutral-900 overflow-hidden flex flex-col justify-between space-y-4 shadow-xl hover:border-white/20 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#A3A3CC]/90 text-white text-[10px] font-black border border-[#A3A3CC]/50 backdrop-blur-md">
                        {evt.category}
                      </div>
                    </div>

                    <div className="px-5 space-y-2">
                      <h3 className="text-base font-black text-white group-hover:text-[#A3A3CC] transition-colors line-clamp-2">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{evt.description}</p>

                      <div className="space-y-1 pt-2 text-xs text-neutral-300 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[#A3A3CC] shrink-0" />
                          <span>일시: {evt.date} ({evt.time})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#CCCCFF] shrink-0" />
                          <span>장소: {evt.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400">
                      참가 인원: <strong className="text-[#A3A3CC]">{evt.currentParticipants}</strong> / {evt.maxParticipants}명
                    </span>

                    <button
                      onClick={() => handleToggleEventApply(evt.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                        evt.isApplied
                          ? 'bg-[#5C5C99] hover:bg-[#5C5C99] text-white shadow-lg shadow-[#5C5C99]/30'
                          : 'bg-[#A3A3CC] hover:bg-[#A3A3CC] text-white shadow-lg shadow-[#A3A3CC]/30'
                      }`}
                    >
                      {evt.isApplied ? (
                        <>
                          <Check size={14} />
                          <span>신청 완료</span>
                        </>
                      ) : (
                        <>
                          <Ticket size={14} />
                          <span>참가 신청하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* EDIT MY PROFILE MODAL */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] bg-gradient-to-br from-[#A3A3CC]/5 to-transparent border border-[#A3A3CC]/10 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] rounded-3xl p-6 shadow-2xl text-white space-y-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#CCCCFF] text-white">
                    <User size={18} />
                  </div>
                  <h3 className="text-base font-black">내 AI 프렌즈 매칭 프로필 작성/수정</h3>
                </div>
                <button onClick={() => setIsEditProfileModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-300 block">이름 (Name)</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="예: 윤제린 (Jerin Yoon)"
                      className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-300 block">나이 (Age)</label>
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(Number(e.target.value))}
                      className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-300 block">국적 (Nationality)</label>
                    <input
                      type="text"
                      value={editNationality}
                      onChange={(e) => setEditNationality(e.target.value)}
                      placeholder="예: 🇰🇷 한국 / 🇻🇳 베트남 / 🇨🇳 중국"
                      className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-300 block">MBTI</label>
                    <input
                      type="text"
                      value={editMbti}
                      onChange={(e) => setEditMbti(e.target.value)}
                      placeholder="예: ENFP / INFJ"
                      className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">학과 및 학년 (Major & Year)</label>
                  <input
                    type="text"
                    value={editMajor}
                    onChange={(e) => setEditMajor(e.target.value)}
                    placeholder="예: 컴퓨터공학과 3학년"
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">구사 가능 언어 (쉼표 구분)</label>
                  <input
                    type="text"
                    value={editLanguages}
                    onChange={(e) => setEditLanguages(e.target.value)}
                    placeholder="예: 한국어 (원어민), 영어 (상급), 베트남어 (초급)"
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">취미 및 관심사 (쉼표 구분)</label>
                  <input
                    type="text"
                    value={editHobbies}
                    onChange={(e) => setEditHobbies(e.target.value)}
                    placeholder="예: K-POP 댄스, 맛집 탐방, 운동, 카페 스터디"
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">자기소개 (Bio)</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    placeholder="상대방에게 보여줄 매칭 자기소개를 적어주세요..."
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF] resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">프로필 사진 이미지 URL</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#CCCCFF]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveMyProfile}
                  className="flex-1 py-3 bg-[#CCCCFF] hover:from-[#CCCCFF] hover:to-[#CCCCFF] text-white font-black rounded-xl text-xs shadow-lg shadow-[#CCCCFF]/30 cursor-pointer"
                >
                  💖 프로필 등록 완료 및 매칭 시작하기!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MATCH CELEBRATION MODAL */}
      <AnimatePresence>
        {matchedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-sm bg-neutral-900 border-2 border-[#CCCCFF]/60 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#CCCCFF]/20 border-2 border-[#CCCCFF] text-[#CCCCFF] mx-auto flex items-center justify-center animate-bounce">
                <Heart size={32} className="fill-rose-500" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">IT'S A MATCH! 🎉</h3>
                <p className="text-xs text-[#CCCCFF] mt-1 font-bold">
                  {matchedProfile.name}님과 서로에게 관심을 표시했습니다!
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 flex items-center gap-3">
                <img src={matchedProfile.avatar} alt={matchedProfile.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="text-left text-xs">
                  <h4 className="font-bold text-white">{matchedProfile.name} ({matchedProfile.nationality})</h4>
                  <span className="text-[10px] text-neutral-400">AI 성향 일치도: {matchedProfile.aiMatchScore}%</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleOpenChat(matchedProfile)}
                  className="w-full py-3 bg-[#CCCCFF] hover:from-[#CCCCFF] hover:to-[#CCCCFF] text-white font-black text-xs rounded-xl shadow-lg shadow-[#CCCCFF]/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>💬 1:1 라이브 채팅 시작하기</span>
                </button>
                <button
                  onClick={() => setMatchedProfile(null)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  나중에 대화하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1:1 LIVE CHAT MODAL */}
      <AnimatePresence>
        {activeChatProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md h-[550px] bg-neutral-900 border border-white/15 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 bg-neutral-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeChatProfile.avatar} alt={activeChatProfile.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeChatProfile.name}</h3>
                    <span className="text-[10px] text-[#CCCCFF] font-extrabold">{activeChatProfile.nationality} | AI Match {activeChatProfile.aiMatchScore}%</span>
                  </div>
                </div>
                <button onClick={() => setActiveChatProfile(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-950/60">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#CCCCFF] text-white rounded-br-none'
                        : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-white/10'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-neutral-500 mt-1">{msg.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input Footer */}
              <div className="p-3 bg-neutral-950 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2.5 bg-gradient-to-br from-[#A3A3CC]/5 to-transparent border border-[#A3A3CC]/10 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#CCCCFF]"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="p-2.5 bg-[#CCCCFF] hover:bg-[#CCCCFF] text-white rounded-2xl cursor-pointer transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
