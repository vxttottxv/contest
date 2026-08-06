import { useState } from 'react';
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
} from 'lucide-react';
import {
  MOCK_TINDER_PROFILES,
  MOCK_QUIZ_QUESTIONS,
  MOCK_LEADERBOARD,
  MOCK_SOCIAL_EVENTS,
} from '../services/loungeApi';
import type { LoungeProfile, ChatMessage, SocialEvent } from '../services/loungeApi';

interface LoungePageProps {
  onBack: () => void;
}

export default function LoungePage({ onBack }: LoungePageProps) {
  const [activeTab, setActiveTab] = useState<'matching' | 'game' | 'events'>('matching');

  // Tinder Swiping States
  const [profiles] = useState<LoungeProfile[]>(MOCK_TINDER_PROFILES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [matchedProfile, setMatchedProfile] = useState<LoungeProfile | null>(null);

  // Chat Modal State
  const [activeChatProfile, setActiveChatProfile] = useState<LoungeProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState<string>('');

  // Mini-Game Quiz States
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Social Events Application State
  const [events, setEvents] = useState<SocialEvent[]>(MOCK_SOCIAL_EVENTS);

  const currentProfile = profiles[currentIndex];

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

    // Peer Auto Reply Simulation
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

  // Quiz Handlers
  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    const currentQuiz = MOCK_QUIZ_QUESTIONS[currentQuizIndex];
    if (idx === currentQuiz.correctIndex) {
      setUserScore((prev) => prev + 100);
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

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setUserScore(0);
    setIsQuizCompleted(false);
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-rose-500 selection:text-white pb-20">
      {/* Background Neon Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/3 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>메인으로</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg shadow-rose-600/20">
              <Coffee size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">Lounge (라운지·교류 & 프렌즈)</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  AI Matching & Social
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                틴더 스타일 AI 프렌즈 매칭, 한국어 미니게임 퀴즈 및 교내 소셜 밋업 이벤트
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-8 space-y-6 flex-1">
        {/* DOMAIN TABS NAVIGATION */}
        <div className="flex items-center justify-center md:justify-start gap-2 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'matching'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 font-black'
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
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 size={16} />
            <span>🎮 한국어 미니게임 & 랭킹</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30 font-black'
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
            {/* Tinder Card Container */}
            <div className="relative w-full max-w-md h-[540px] rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-neutral-950 flex flex-col justify-between group">
              {/* Profile Image Background */}
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                className="absolute inset-0 w-full h-full object-cover filter brightness-90 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

              {/* Top AI Match Badge */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-rose-600/80 border border-rose-400/50 backdrop-blur-md text-white font-black text-xs shadow-xl flex items-center gap-1.5 animate-pulse">
                  <Zap size={14} className="text-amber-300 fill-amber-300" />
                  ⚡ AI 성향 일치도 {currentProfile.aiMatchScore}%
                </span>

                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs font-bold backdrop-blur-md text-white">
                  {currentIndex + 1} / {profiles.length}
                </span>
              </div>

              {/* Bottom Profile Info Details */}
              <div className="relative z-10 p-6 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{currentProfile.name}, {currentProfile.age}</h2>
                    <span className="px-2.5 py-0.5 rounded bg-white/20 text-xs font-bold text-white backdrop-blur-md">
                      {currentProfile.nationality}
                    </span>
                  </div>
                  <p className="text-xs text-rose-300 font-bold mt-1">
                    📚 {currentProfile.major} | MBTI: {currentProfile.mbti}
                  </p>
                </div>

                <p className="text-xs text-neutral-200 leading-relaxed font-medium bg-black/40 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                  "{currentProfile.bio}"
                </p>

                {/* Languages & Hobbies Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[10px] font-bold text-neutral-400 shrink-0">언어:</span>
                    {currentProfile.languages.map((lang, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 shrink-0">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[10px] font-bold text-neutral-400 shrink-0">취미:</span>
                    {currentProfile.hobbies.map((hob, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30 shrink-0">
                        #{hob}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TINDER SWIPE ACTION BUTTONS */}
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
                className="w-20 h-20 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white flex items-center justify-center shadow-2xl shadow-rose-600/40 transition-all cursor-pointer active:scale-95 animate-bounce"
                title="좋아요 & AI 매칭하기 (MATCH)"
              >
                <Heart size={36} className="fill-white" />
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: KOREAN MINI-GAME QUIZ & SCOREBOARD LEADERBOARD */}
        {activeTab === 'game' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Quiz Engine */}
            <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/10 space-y-6">
              {!isQuizCompleted ? (
                <>
                  {/* Quiz HUD Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 text-xs font-black border border-purple-400/40">
                        {MOCK_QUIZ_QUESTIONS[currentQuizIndex].category}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">
                        문제 {currentQuizIndex + 1} / {MOCK_QUIZ_QUESTIONS.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-amber-400 font-mono font-black text-sm">
                      <Trophy size={18} />
                      <span>내 점수: {userScore}점</span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-white leading-relaxed">
                      Q. {MOCK_QUIZ_QUESTIONS[currentQuizIndex].question}
                    </h3>
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {MOCK_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === MOCK_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
                      let btnStyle = 'bg-neutral-950 border-white/10 hover:border-purple-500/50 text-white';

                      if (selectedOption !== null) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400';
                        } else if (isSelected) {
                          btnStyle = 'bg-red-950 border-red-500 text-red-200';
                        } else {
                          btnStyle = 'bg-neutral-950/40 border-white/5 opacity-40 text-neutral-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          disabled={selectedOption !== null}
                          className={`p-4 rounded-2xl border text-left font-bold text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{idx + 1}. {opt}</span>
                          {selectedOption !== null && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Banner & Next Button */}
                  {selectedOption !== null && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                      <p className="text-xs text-purple-200 font-medium">
                        💡 해설: {MOCK_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                      </p>
                      <button
                        onClick={handleNextQuiz}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-purple-600/30 transition-all"
                      >
                        {currentQuizIndex < MOCK_QUIZ_QUESTIONS.length - 1 ? '다음 퀴즈 풀기 ➔' : '최종 스코어 결과 보기 🏆'}
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Quiz Complete Result View */
                <div className="py-12 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 mx-auto flex items-center justify-center animate-bounce">
                    <Trophy size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">축하합니다! 퀴즈 완료!</h3>
                    <p className="text-sm font-bold text-amber-300 mt-1">획득 점수: {userScore}점</p>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <RotateCcw size={16} />
                    <span>다시 도전하기</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right 1 Col: Scoreboard Leaderboard */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4">
              <h3 className="text-base font-black text-amber-400 flex items-center gap-2 border-b border-white/10 pb-3">
                <Trophy size={18} />
                <span>유학생 퀴즈 랭킹 스코어보드</span>
              </h3>

              <div className="space-y-3">
                {MOCK_LEADERBOARD.map((item) => (
                  <div
                    key={item.rank}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      item.rank === 1
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                        : item.rank === 2
                        ? 'bg-neutral-800 border-white/20 text-white'
                        : 'bg-neutral-950 border-white/10 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm w-6 text-center">{item.rank}위</span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <span className="text-[10px] text-neutral-400">{item.badge}</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-xs text-amber-400">{item.score}pt</span>
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
                    {/* Event Banner Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-black border border-blue-400/50 backdrop-blur-md">
                        {evt.category}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="px-5 space-y-2">
                      <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{evt.description}</p>

                      <div className="space-y-1 pt-2 text-xs text-neutral-300 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-blue-400 shrink-0" />
                          <span>일시: {evt.date} ({evt.time})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-rose-400 shrink-0" />
                          <span>장소: {evt.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Action Bar */}
                  <div className="p-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400">
                      참가 인원: <strong className="text-blue-400">{evt.currentParticipants}</strong> / {evt.maxParticipants}명
                    </span>

                    <button
                      onClick={() => handleToggleEventApply(evt.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                        evt.isApplied
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
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

      {/* MATCH CELEBRATION MODAL */}
      <AnimatePresence>
        {matchedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-sm bg-neutral-900 border-2 border-rose-500/60 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-400 mx-auto flex items-center justify-center animate-bounce">
                <Heart size={32} className="fill-rose-500" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">IT'S A MATCH! 🎉</h3>
                <p className="text-xs text-rose-300 mt-1 font-bold">
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
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
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
                    <span className="text-[10px] text-rose-300 font-extrabold">{activeChatProfile.nationality} | AI Match {activeChatProfile.aiMatchScore}%</span>
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
                        ? 'bg-rose-600 text-white rounded-br-none'
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
                  className="flex-1 px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="p-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl cursor-pointer transition-colors"
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
