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
  List,
  Grid,
} from 'lucide-react';
import {
  MOCK_ACADEMIC_EVENTS,
  MOCK_SCHOLARSHIPS,
  MOCK_COMPETITIONS,
} from '../services/academicsApi';
import type { AcademicEvent } from '../services/academicsApi';

interface AcademicsPageProps {
  onBack: () => void;
}

export default function AcademicsPage({ onBack }: AcademicsPageProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'scholarships' | 'competitions'>('calendar');
  const [calendarViewMode, setCalendarViewMode] = useState<'grid' | 'list'>('grid');

  // Calendar State: Year & Month (Defaults to 2026-08 August)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = August
  const [selectedDay, setSelectedDay] = useState<number | null>(18); // Default to Aug 18 (Course Registration)

  // Academic Events State
  const [events] = useState<AcademicEvent[]>(MOCK_ACADEMIC_EVENTS);

  // Scholarships State
  const [scholarshipCategory, setScholarshipCategory] = useState<string>('all');

  // Competitions State
  const [competitionCategory, setCompetitionCategory] = useState<string>('all');

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

  // Helper to find events for a specific day in the selected month
  const getEventsForDay = (day: number) => {
    const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

    return events.filter((ev) => {
      return dateStr >= ev.startDate && dateStr <= ev.endDate;
    });
  };

  const selectedDateEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const filteredScholarships = MOCK_SCHOLARSHIPS.filter((s) => {
    return scholarshipCategory === 'all' || s.category === scholarshipCategory;
  });

  const filteredCompetitions = MOCK_COMPETITIONS.filter((c) => {
    return competitionCategory === 'all' || c.category === competitionCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Glow ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/3 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* HEADER BAR */}
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
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">Academics (학사·장학·공모전)</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  2026 Academic Calendar
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                인터랙티브 학사일정 캘린더 달력, 장학금 지원 정보 및 팀원 모집 공모전
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-8 space-y-6 flex-1">
        {/* TAB NAVIGATION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <CalendarIcon size={16} />
              <span>📅 학사일정 캘린더</span>
            </button>

            <button
              onClick={() => setActiveTab('scholarships')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'scholarships'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <DollarSign size={16} />
              <span>장학금 공지</span>
            </button>

            <button
              onClick={() => setActiveTab('competitions')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'competitions'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Trophy size={16} />
              <span>대회 & 공모전</span>
            </button>
          </div>

          {/* VIEW TOGGLE (CALENDAR GRID VS LIST) */}
          {activeTab === 'calendar' && (
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setCalendarViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  calendarViewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Grid size={14} />
                <span>월간 달력 보기</span>
              </button>
              <button
                onClick={() => setCalendarViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  calendarViewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <List size={14} />
                <span>목록형 보기</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: ACADEMIC CALENDAR (GRID OR LIST) */}
        {activeTab === 'calendar' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {calendarViewMode === 'grid' ? (
              /* MONTHLY INTERACTIVE GRID CALENDAR VIEW */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Month Calendar Grid */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4 shadow-2xl">
                  {/* Month Switcher Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-black text-white tracking-tight">
                        {currentYear}년 {currentMonth}월 학사 캘린더
                      </h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        2026학년도 2학기
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                        title="이전 달"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-xs font-bold text-neutral-300 w-16 text-center">
                        {currentMonth}월
                      </span>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                        title="다음 달"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* 7 Days of Week Header */}
                  <div className="grid grid-cols-7 text-center font-bold text-xs border-b border-white/10 pb-2">
                    <span className="text-red-400">일 (Sun)</span>
                    <span className="text-neutral-300">월 (Mon)</span>
                    <span className="text-neutral-300">화 (Tue)</span>
                    <span className="text-neutral-300">수 (Wed)</span>
                    <span className="text-neutral-300">목 (Thu)</span>
                    <span className="text-neutral-300">금 (Fri)</span>
                    <span className="text-blue-400">토 (Sat)</span>
                  </div>

                  {/* 35/42 Calendar Day Cells */}
                  <div className="grid grid-cols-7 gap-1.5 pt-1">
                    {/* Empty Padding Cells Before First Day of Month */}
                    {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-20 md:h-24 rounded-2xl bg-neutral-950/30 border border-transparent" />
                    ))}

                    {/* Active Month Days */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const day = idx + 1;
                      const dayEvents = getEventsForDay(day);
                      const isSelected = selectedDay === day;
                      const isToday = currentYear === 2026 && currentMonth === 8 && day === 18;

                      return (
                        <div
                          key={`day-${day}`}
                          onClick={() => setSelectedDay(day)}
                          className={`h-20 md:h-24 p-1.5 md:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group ${
                            isSelected
                              ? 'bg-blue-950/80 border-blue-400 ring-2 ring-blue-400/50 shadow-xl'
                              : isToday
                              ? 'bg-neutral-850 border-amber-400/60'
                              : dayEvents.length > 0
                              ? 'bg-neutral-950 hover:bg-neutral-850 border-white/15'
                              : 'bg-neutral-950/70 hover:bg-neutral-900 border-white/5'
                          }`}
                        >
                          {/* Day Number Header */}
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-black ${isToday ? 'text-amber-400' : 'text-white'}`}>
                              {day}
                            </span>
                            {isToday && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400 text-black">
                                오늘
                              </span>
                            )}
                          </div>

                          {/* Event Badges in Cell */}
                          <div className="space-y-1 overflow-y-auto">
                            {dayEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold truncate border ${
                                  ev.category === '수강'
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                    : ev.category === '시험'
                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                    : ev.category === '학적'
                                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                }`}
                                title={ev.title}
                              >
                                • {ev.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right 1 Col: Selected Day Event Detail Panel */}
                <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4 shadow-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={18} className="text-blue-400" />
                        <h3 className="text-base font-black text-white">
                          {selectedDay
                            ? `${currentYear}년 ${currentMonth}월 ${selectedDay}일 학사 일정`
                            : '날짜를 선택하세요'}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        달력에서 해당 일자를 클릭하면 학사 일정을 확인할 수 있습니다.
                      </p>
                    </div>

                    {!selectedDay || selectedDateEvents.length === 0 ? (
                      <div className="p-8 text-center rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
                        <Info size={28} className="text-neutral-500 mx-auto" />
                        <p className="text-xs text-neutral-400 font-bold">선택하신 날짜에 등록된 학사일정이 없습니다.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedDateEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className={`p-4 rounded-2xl border space-y-2 ${
                              ev.isImportant
                                ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                                : 'bg-neutral-950 border-white/10 text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                                  ev.category === '수강'
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                    : ev.category === '시험'
                                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                }`}
                              >
                                {ev.category}
                              </span>
                              <span className="text-xs font-mono font-bold text-amber-300">
                                {ev.startDate} ~ {ev.endDate}
                              </span>
                            </div>

                            <h4 className="text-sm font-black text-white">{ev.title}</h4>
                            <p className="text-xs text-neutral-300 leading-relaxed font-medium">{ev.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 text-xs text-neutral-400 space-y-1">
                    <span className="font-bold text-blue-400 block">💡 유학생 학사 꿀팁:</span>
                    <span>수강신청 전 학사지원팀에서 한국어 수강 상담을 지원합니다 (02-300-1111).</span>
                  </div>
                </div>
              </div>
            ) : (
              /* LIST VIEW MODE */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-6 rounded-3xl border transition-all duration-300 bg-neutral-900/80 backdrop-blur-md ${
                      event.isImportant
                        ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                          event.category === '수강'
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                            : event.category === '시험'
                            ? 'bg-red-500/20 border-red-500/40 text-red-400'
                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        }`}
                      >
                        {event.category}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {event.startDate} ~ {event.endDate}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white mb-2">{event.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: SCHOLARSHIPS */}
        {activeTab === 'scholarships' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { key: 'all', label: '전체 보기' },
                { key: 'foreign', label: '🌍 유학생 전용' },
                { key: 'merit', label: '🎓 성적 우수' },
                { key: 'external', label: '🏛️ 교외 장학' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setScholarshipCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    scholarshipCategory === cat.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScholarships.map((sch) => (
                <div key={sch.id} className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {sch.categoryLabel}
                    </span>
                    <span className="text-xs font-mono text-amber-300 font-bold">신청마감: {sch.deadline}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{sch.title}</h3>
                    <p className="text-sm font-black text-emerald-400 mt-1">💰 지원 금액: {sch.amount}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 space-y-1 text-xs">
                    <span className="font-bold text-neutral-300 block">자격 요건:</span>
                    <p className="text-neutral-400">{sch.eligibility}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-neutral-400">제출 서류: {sch.documents.join(', ')}</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer transition-all">
                      신청 가이드 ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: COMPETITIONS */}
        {activeTab === 'competitions' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { key: 'all', label: '전체' },
                { key: '학술제', label: '💻 학술제' },
                { key: '아이디어', label: '💡 아이디어' },
                { key: '글로벌', label: '🌍 글로벌' },
                { key: '문화', label: '🎨 문화' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCompetitionCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    competitionCategory === cat.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCompetitions.map((comp) => (
                <div key={comp.id} className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {comp.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {comp.teamStatus} ({comp.membersNeeded}명 구인 중)
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{comp.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1">주최: {comp.organizer}</p>
                    <p className="text-sm font-black text-amber-300 mt-1">🏆 총 상금: {comp.prize}</p>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-medium bg-neutral-950 p-3 rounded-2xl border border-white/10">
                    {comp.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-neutral-400 font-mono">마감일: {comp.deadline}</span>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer">
                      팀원 지원하기 ✉️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
