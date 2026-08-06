import { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Calendar as CalendarIcon,
  Trophy,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Info,
  Bot,
  Filter,
  CheckCircle2,
  User,
  MapPin,
  Clock
} from 'lucide-react';
import {
  MOCK_ACADEMIC_EVENTS,
  MOCK_SCHOLARSHIPS,
  MOCK_COMPETITIONS,
  MOCK_NOTICES,
} from '../services/academicsApi';
import type { AcademicEvent } from '../services/academicsApi';

interface AcademicsPageProps {
  onBack: () => void;
}

export default function AcademicsPage({ onBack }: AcademicsPageProps) {
  // Calendar State: Year & Month (Defaults to 2026-08 August)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = August
  const [selectedDay, setSelectedDay] = useState<number | null>(18); // Default to Aug 18 (Course Registration)

  // Academic Events State
  const [events] = useState<AcademicEvent[]>(MOCK_ACADEMIC_EVENTS);

  // User Profile (for AI Filtering)
  const [userProfile] = useState<{ major: string; grade: number; nationality: string }>(() => {
    const saved = localStorage.getItem('mjc_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          major: parsed.major || '컴퓨터공학과',
          grade: 3, // Assuming 3rd year for demo
          nationality: parsed.nationality || '베트남',
        };
      } catch (e) {}
    }
    return { major: '컴퓨터공학과', grade: 3, nationality: '베트남' };
  });

  const filteredNotices = MOCK_NOTICES.filter(notice => {
    const matchMajor = notice.targetMajor === 'ALL' || notice.targetMajor === userProfile.major;
    const matchGrade = notice.targetGrade === 'ALL' || notice.targetGrade === userProfile.grade;
    const matchNationality = notice.targetNationality === 'ALL' || notice.targetNationality === userProfile.nationality;
    return matchMajor && matchGrade && matchNationality;
  });

  // ── CALENDAR GRID GENERATION HELPERS ──────────────────────────────
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun, 1 = Mon ...

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
    setSelectedDay(null);
  };

  const getEventsForDay = (day: number) => {
    const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

    return events.filter((ev) => {
      return dateStr >= ev.startDate && dateStr <= ev.endDate;
    });
  };

  const selectedDateEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-white/20 pb-20 relative">
      
      {/* Halftone Texture Overlay (Premium Tech Dot Grid) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Liquid Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] rounded-[100%] blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-white/[0.02] rounded-[100%] blur-[120px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      </div>

      {/* HEADER BAR (Minimalist) */}
      <header className="relative z-10 bg-transparent sticky top-0 px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white bg-neutral-900/50 hover:bg-neutral-800 rounded-full border border-white/10 backdrop-blur-md transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              <GraduationCap size={24} className="text-neutral-400" />
              Academics
            </h1>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              학사 일정, 장학금 및 맞춤형 공지 대시보드
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-4 flex-1">
        
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-min gap-4 md:gap-5">
          
          {/* 1. PROFILE WIDGET (4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="md:col-span-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col justify-between hover:bg-neutral-900/60 transition-colors"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <User size={20} className="text-neutral-300" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/5 text-neutral-400 border border-white/10 uppercase tracking-widest">
                My Profile
              </span>
            </div>
            
            <div>
              <h2 className="text-2xl font-medium tracking-tight text-white mb-4">반갑습니다!</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-sm text-neutral-500 font-medium">전공</span>
                  <span className="text-sm font-semibold text-neutral-200">{userProfile.major}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-sm text-neutral-500 font-medium">학년</span>
                  <span className="text-sm font-semibold text-neutral-200">{userProfile.grade}학년</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500 font-medium">국적</span>
                  <span className="text-sm font-semibold text-neutral-200">{userProfile.nationality}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. AI NOTICES WIDGET (8 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="md:col-span-8 p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col hover:bg-neutral-900/60 transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <Bot size={18} className="text-neutral-200" />
                </div>
                <h3 className="text-lg font-medium text-white">AI 맞춤형 공지 하이라이트</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1">
                <Sparkles size={12} />
                AI Filtered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 h-full">
              {filteredNotices.slice(0, 2).map(notice => (
                <div key={notice.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between group hover:border-white/20 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-neutral-300">
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">{notice.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-4 leading-relaxed">{notice.title}</h4>
                  </div>
                  
                  <div className="space-y-2 border-t border-white/5 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Filter size={12} className="text-neutral-400" />
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">AI Summary</span>
                    </div>
                    {notice.summary.map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={12} className="text-neutral-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300 font-medium leading-snug">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. INTERACTIVE CALENDAR GRID (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="md:col-span-7 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col hover:bg-neutral-900/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <CalendarIcon size={18} className="text-neutral-300" />
                </div>
                <h3 className="text-lg font-medium text-white tracking-tight">
                  {currentYear}.{currentMonth < 10 ? `0${currentMonth}` : currentMonth} 학사일정
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center font-semibold text-[10px] text-neutral-500 mb-3 uppercase tracking-widest">
              <span className="text-neutral-600">Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span className="text-neutral-600">Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square rounded-xl bg-transparent" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDay === day;
                const isToday = currentYear === 2026 && currentMonth === 8 && day === 18;
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white text-black font-bold shadow-lg'
                        : isToday
                        ? 'bg-neutral-800 text-white border border-white/20'
                        : hasEvents
                        ? 'bg-neutral-800/50 hover:bg-neutral-700 text-neutral-200'
                        : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    <span className="text-xs">{day}</span>
                    {hasEvents && (
                      <div className={`w-1 h-1 rounded-full absolute bottom-2 ${isSelected ? 'bg-black' : 'bg-white/50'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* 4. CALENDAR DETAILS (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="md:col-span-5 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col hover:bg-neutral-900/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h3 className="text-sm font-medium text-neutral-400">
                {selectedDay ? `${currentMonth}월 ${selectedDay}일 일정` : '일정을 선택하세요'}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px]">
              {!selectedDay || selectedDateEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-3 py-10">
                  <Info size={24} />
                  <p className="text-xs font-medium">등록된 일정이 없습니다.</p>
                </div>
              ) : (
                selectedDateEvents.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                        {ev.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} ~ ${ev.endDate}`}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">{ev.title}</h4>
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed">{ev.description}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* 5. SCHOLARSHIPS (6 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="md:col-span-6 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col hover:bg-neutral-900/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <DollarSign size={18} className="text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-white">최신 장학금 공지</h3>
            </div>

            <div className="space-y-3">
              {MOCK_SCHOLARSHIPS.slice(0, 2).map((sch) => (
                <div key={sch.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-black/60 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{sch.title}</h4>
                    <p className="text-xs text-neutral-400 font-medium line-clamp-1">{sch.eligibility}</p>
                  </div>
                  <div className="shrink-0 text-right md:w-auto w-full flex md:flex-col justify-between items-center md:items-end mt-2 md:mt-0">
                    <div className="text-sm font-bold text-neutral-200">{sch.amount}</div>
                    <div className="text-[10px] text-neutral-500 font-mono md:mt-0.5">마감: {sch.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 transition-colors border border-white/5">
              장학금 전체 보기
            </button>
          </motion.div>

          {/* 6. COMPETITIONS (6 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="md:col-span-6 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] flex flex-col hover:bg-neutral-900/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Trophy size={18} className="text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-white">대회 & 공모전 팀원 모집</h3>
            </div>

            <div className="space-y-3">
              {MOCK_COMPETITIONS.slice(0, 2).map((comp) => (
                <div key={comp.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-black/60 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{comp.title}</h4>
                    <p className="text-xs text-neutral-400 font-medium line-clamp-1">{comp.organizer}</p>
                  </div>
                  <div className="shrink-0 text-right md:w-auto w-full flex md:flex-col justify-between items-center md:items-end mt-2 md:mt-0">
                    <div className="text-xs font-semibold px-2 py-1 rounded bg-white/10 text-neutral-300 inline-block md:mb-1">
                      {comp.teamStatus}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">마감: {comp.deadline}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 transition-colors border border-white/5">
              공모전 전체 보기
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
