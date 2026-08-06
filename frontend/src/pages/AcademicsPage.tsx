import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Calendar as CalendarIcon,
  Trophy,
  ArrowLeft,
  Filter,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  FileText,
  Users,
  Sparkles,
} from 'lucide-react';
import {
  fetchAcademicEvents,
  fetchScholarships,
  fetchCompetitions,
} from '../services/academicsApi';
import type {
  AcademicEvent,
  Scholarship,
  Competition,
} from '../services/academicsApi';

interface AcademicsPageProps {
  onBack: () => void;
}

export default function AcademicsPage({ onBack }: AcademicsPageProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'scholarships' | 'competitions'>('calendar');

  // Data states
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [scholarshipFilter, setScholarshipFilter] = useState<'all' | 'foreign' | 'merit' | 'external'>('all');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAcademicEvents().then(setEvents);
    fetchCompetitions().then(setCompetitions);
  }, []);

  useEffect(() => {
    fetchScholarships(scholarshipFilter).then(setScholarships);
  }, [scholarshipFilter]);

  const handleDownload = (fileName: string) => {
    setDownloadSuccess(fileName);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-white/10 bg-neutral-950/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap size={22} className="text-blue-400" />
              <h1 className="text-xl font-black tracking-tight">ACADEMICS</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                학사·장학
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              학업 진행 및 경력 개발을 위한 명지전문대학 공식 정보 센터
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CalendarIcon size={16} />
            <span>학사일정 달력</span>
          </button>
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'scholarships'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <GraduationCap size={16} />
            <span>장학금 공지</span>
          </button>
          <button
            onClick={() => setActiveTab('competitions')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'competitions'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Trophy size={16} />
            <span>대회 & 공모전</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Glow ambient background */}
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-8">
          {/* TAB 1: ACADEMIC CALENDAR */}
          {activeTab === 'calendar' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">2026학년도 필수 학사일정</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    수강신청, 수강철회, 중간/기말고사, 계절학기 등 놓쳐서는 안 될 중요 일정 목록입니다.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>D-Day 자동 알림 지원</span>
                </div>
              </div>

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
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : event.category === '학적'
                            ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        }`}
                      >
                        {event.category}
                      </span>
                      {event.isImportant && (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md animate-pulse">
                          필수 확인
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-300 bg-neutral-800/80 p-3 rounded-xl border border-white/5">
                      <Clock size={16} className="text-blue-400" />
                      <span>
                        {event.startDate} ~ {event.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: SCHOLARSHIPS */}
          {activeTab === 'scholarships' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">장학금 안내 & 서류 신청</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    외국인 유학생 전용 장학금, 성적 장학금 및 교외 재단 지원 자격 요건과 서류 양식을 제공합니다.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-white/10">
                  <Filter size={16} className="text-neutral-500 ml-2" />
                  {[
                    { key: 'all', label: '전체' },
                    { key: 'foreign', label: '외국인전용' },
                    { key: 'merit', label: '성적우수' },
                    { key: 'external', label: '교외장학' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setScholarshipFilter(f.key as any)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        scholarshipFilter === f.key
                          ? 'bg-blue-600 text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toast for Download */}
              {downloadSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>[{downloadSuccess}] 양식이 다운로드 폴더에 저장되었습니다.</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {scholarships.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 hover:border-blue-500/40 transition-all backdrop-blur-md flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                          {sch.categoryLabel}
                        </span>
                        <span className="text-xs text-neutral-400">신청 마감: {sch.deadline}</span>
                      </div>

                      <h3 className="text-xl font-bold">{sch.title}</h3>
                      <p className="text-xs text-neutral-300 leading-relaxed">{sch.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                        <div className="p-3 rounded-xl bg-neutral-800/80 border border-white/5">
                          <span className="text-neutral-500 block mb-0.5 font-bold">지원 금액</span>
                          <span className="font-extrabold text-blue-400">{sch.amount}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-800/80 border border-white/5">
                          <span className="text-neutral-500 block mb-0.5 font-bold">신청 자격</span>
                          <span className="text-neutral-200">{sch.eligibility}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64 flex flex-col justify-between p-4 rounded-2xl bg-neutral-800/40 border border-white/5 space-y-4">
                      <div>
                        <span className="text-xs font-bold text-neutral-400 block mb-2">필수 제출 서류</span>
                        <ul className="space-y-1.5">
                          {sch.documents.map((doc, idx) => (
                            <li key={idx} className="flex items-center justify-between text-xs text-neutral-300">
                              <span className="flex items-center gap-1.5 truncate">
                                <FileText size={14} className="text-neutral-500 shrink-0" />
                                {doc}
                              </span>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-1 text-neutral-400 hover:text-blue-400 transition-colors cursor-pointer"
                                title="서류 양식 다운로드"
                              >
                                <Download size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setSelectedScholarship(sch)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                      >
                        상세 자격 & 신청 가이드
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: COMPETITIONS & CONTESTS */}
          {activeTab === 'competitions' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-black">대회 & 공모전 & 팀원 모집</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  교내 학술제, 유학생 말하기 대회, 글로벌 공모전 공고를 확인하고 팀원을 구해보세요.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competitions.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 hover:border-purple-500/40 transition-all backdrop-blur-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {comp.category}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            comp.teamStatus === '모집중'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : comp.teamStatus === '마감임박'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {comp.teamStatus}
                        </span>
                      </div>

                      <h3 className="text-base font-bold leading-snug">{comp.title}</h3>
                      <p className="text-xs text-neutral-400">{comp.organizer}</p>
                      <p className="text-xs text-neutral-300 leading-relaxed">{comp.description}</p>

                      <div className="p-3 rounded-xl bg-neutral-800/60 border border-white/5 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-500 font-bold">시상 혜택</span>
                          <span className="text-amber-400 font-bold">{comp.prize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500 font-bold">필요 팀원</span>
                          <span className="text-neutral-200">{comp.membersNeeded}명 추가 모집</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={comp.teamLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
                    >
                      <Users size={16} />
                      <span>팀원 모집 링크 오픈채팅</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Scholarship Detail Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-white space-y-6"
            >
              <button
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div>
                <span className="text-xs font-bold text-blue-400 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                  {selectedScholarship.categoryLabel}
                </span>
                <h3 className="text-2xl font-black mt-3">{selectedScholarship.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">신청 마감일: {selectedScholarship.deadline}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-800/80 border border-white/5 space-y-1">
                  <span className="text-neutral-400 font-bold block">지원 혜택</span>
                  <p className="text-base font-extrabold text-blue-400">{selectedScholarship.amount}</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-800/80 border border-white/5 space-y-1">
                  <span className="text-neutral-400 font-bold block">자격 요건 상세</span>
                  <p className="text-neutral-200 leading-relaxed">{selectedScholarship.eligibility}</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-800/80 border border-white/5 space-y-2">
                  <span className="text-neutral-400 font-bold block">제출 서류 목록</span>
                  {selectedScholarship.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-neutral-900 border border-white/5">
                      <span className="text-neutral-200">{doc}</span>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        양식 다운로드
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
