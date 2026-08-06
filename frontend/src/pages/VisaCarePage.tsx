import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Calendar,
  FileCheck,
  HelpCircle,
  Clock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  Edit3,
  Search,
  ChevronDown,
  Building,
  UserCheck,
  Sparkles,
  Info,
  PhoneCall,
  X,
  Bot,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import {
  MOCK_DEFAULT_VISA,
  MOCK_CHECKLIST_GROUPS,
  MOCK_HIKOREA_STEPS,
  MOCK_ARC_STEPS,
  MOCK_VISA_FAQS,
  calculateDDay,
} from '../services/visaCareApi';
import type { VisaProfile } from '../services/visaCareApi';

interface VisaCarePageProps {
  onBack: () => void;
}

export default function VisaCarePage({ onBack }: VisaCarePageProps) {
  const [activeTab, setActiveTab] = useState<'ai-coach' | 'd-day' | 'checklist' | 'qna'>('ai-coach');

  // AI Coach state
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [coachGenerated, setCoachGenerated] = useState(false);
  const [coachChecklist, setCoachChecklist] = useState<Record<string, boolean>>({});

  const handleGenerateCoach = () => {
    setIsCoachLoading(true);
    setTimeout(() => {
      setIsCoachLoading(false);
      setCoachGenerated(true);
    }, 1500);
  };
  
  const toggleCoachCheck = (id: string) => {
    setCoachChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Visa Profile State
  const [visaProfile, setVisaProfile] = useState<VisaProfile>(() => {
    const saved = localStorage.getItem('user_visa_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_DEFAULT_VISA;
  });

  // Edit Visa Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editVisaType, setEditVisaType] = useState(visaProfile.visaType);
  const [editExpiryDate, setEditExpiryDate] = useState(visaProfile.expiryDate);
  const [editArcNumber, setEditArcNumber] = useState(visaProfile.arcNumber);

  // Checklist Checked States (Saved in LocalStorage)
  const [checkedItemIds, setCheckedItemIds] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('user_visa_checked_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return { 'ext-1': true, 'ext-2': true };
  });

  // Selected Checklist Category Subtab
  const [checklistCategory, setChecklistCategory] = useState<'extension' | 'address' | 'parttime'>('extension');

  // FAQ Search & Category State
  const [faqCategory] = useState<string>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Recalculate D-Day
  const dDayInfo = calculateDDay(visaProfile.expiryDate);

  const handleSaveVisaProfile = () => {
    const newProfile: VisaProfile = {
      ...visaProfile,
      visaType: editVisaType as any,
      visaName: `${editVisaType} (${editVisaType === 'D-2' ? '유학' : editVisaType === 'D-4' ? '어학연수' : editVisaType === 'D-10' ? '구직' : '특정활동'})`,
      arcNumber: editArcNumber,
      expiryDate: editExpiryDate,
    };
    setVisaProfile(newProfile);
    localStorage.setItem('user_visa_profile', JSON.stringify(newProfile));
    setIsEditModalOpen(false);
  };

  const toggleCheckItem = (id: string) => {
    const updated = { ...checkedItemIds, [id]: !checkedItemIds[id] };
    setCheckedItemIds(updated);
    localStorage.setItem('user_visa_checked_items', JSON.stringify(updated));
  };

  const activeChecklistGroup = MOCK_CHECKLIST_GROUPS.find((g) => g.category === checklistCategory) || MOCK_CHECKLIST_GROUPS[0];
  const activeItemsCount = activeChecklistGroup.items.length;
  const completedItemsCount = activeChecklistGroup.items.filter((item) => checkedItemIds[item.id]).length;
  const progressPercent = Math.round((completedItemsCount / activeItemsCount) * 100);

  const filteredFaqs = MOCK_VISA_FAQS.filter((faq) => {
    const matchCat = faqCategory === 'all' || faq.category === faqCategory;
    const matchSearch = faqSearchQuery === '' || faq.question.includes(faqSearchQuery) || faq.answer.includes(faqSearchQuery);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#080b13] text-white flex flex-col font-sans selection:bg-[#A49A87]/30 selection:text-white pb-20 relative">
      
      {/* Halftone Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Stone Path Liquid Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A49A87]/15 rounded-[100%] blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-[#968F83]/15 rounded-[100%] blur-[120px] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      </div>

      {/* HEADER BAR */}
      <header className="relative z-30 border-b border-white/[0.1] bg-[#080b13]/70 backdrop-blur-3xl sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>메인으로</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#968F83] shadow-lg shadow-[#968F83]/20">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">Visa Care (비자·행정 케어)</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#968F83]/20 text-[#E8E5DF] border border-[#968F83]/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  Auto Immigration Assistant
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                체류 자격 유지, 비자 D-Day 카운트다운, 준비 서류 체크리스트 & 출입국 Q&A
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] hover:from-white/[0.12] rounded-xl text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
        >
          <Edit3 size={14} className="text-[#E8E5DF]" />
          <span>내 비자 정보 수정</span>
        </button>
      </header>

      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-8 space-y-8 flex-1">
        {/* HERO D-DAY COUNTDOWN STATUS CARD */}
        <div className="relative rounded-3xl border border-white/10 p-6 md:p-8 bg-gradient-to-r from-neutral-900/90 via-neutral-900/80 to-[#968F83]/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#968F83]/30 border border-[#968F83]/40 text-[#E8E5DF]">
                  {visaProfile.visaName}
                </span>
                <span className="text-xs text-neutral-400 font-mono">ARC: {visaProfile.arcNumber}</span>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  <span>비자 만료예정일:</span>
                  <span className="text-[#E8E5DF] font-mono">{visaProfile.expiryDate}</span>
                </h2>
                <p className="text-xs md:text-sm text-neutral-300 mt-1.5 font-medium flex items-center gap-2">
                  <Info size={14} className="text-[#E8E5DF] shrink-0" />
                  <span>{dDayInfo.recommendedText}</span>
                </p>
              </div>
            </div>

            {/* Right Big D-Day Badge */}
            <div className="flex items-center gap-4 shrink-0">
              <div className={`px-6 py-4 rounded-2xl border text-center shadow-2xl transition-all ${
                dDayInfo.status === 'CRITICAL' || dDayInfo.status === 'EXPIRED'
                  ? 'bg-red-950/80 border-[#A49A87]/50 text-[#A49A87] shadow-[#A49A87]/20'
                  : dDayInfo.status === 'WARNING'
                  ? 'bg-[#A49A87]/20 border-[#A49A87]/50 text-[#A49A87] shadow-[#A49A87]/20'
                  : 'bg-[#968F83]/20 border-[#968F83]/50 text-[#E8E5DF] shadow-[#968F83]/20'
              }`}>
                <span className="text-xs font-extrabold uppercase tracking-wider block opacity-80">
                  {dDayInfo.statusLabel}
                </span>
                <span className="text-4xl md:text-5xl font-black font-mono tracking-tight block mt-1 text-white">
                  {dDayInfo.dDayText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DOMAIN NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai-coach')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'ai-coach'
                ? 'bg-gradient-to-r from-[#A5A58D] to-[] text-white shadow-lg shadow-[#A5A58D]/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot size={16} />
            <span>🤖 AI 적응 코치</span>
          </button>

          <button
            onClick={() => setActiveTab('d-day')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'd-day'
                ? 'bg-[#968F83] text-white shadow-lg shadow-[#968F83]/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock size={16} />
            <span>비자 D-Day 알림 & 케어</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-[#968F83] text-white shadow-lg shadow-[#968F83]/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck size={16} />
            <span>서류 준비 체크리스트</span>
          </button>

          <button
            onClick={() => setActiveTab('qna')}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'qna'
                ? 'bg-[#968F83] text-white shadow-lg shadow-[#968F83]/30 font-black'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle size={16} />
            <span>출입국 & ARC 발급 Q&A</span>
          </button>
        </div>

        {/* TAB 0: AI ADAPTATION COACH */}
        {activeTab === 'ai-coach' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Coach Request Card */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#A5A58D]/10 to-transparent border border-[#A5A58D]/30 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A5A58D]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-[#A5A58D]">
                    <Bot size={24} />
                    <h2 className="text-xl font-black text-white">AI 신입생 적응 코치</h2>
                  </div>
                  <p className="text-sm text-neutral-400">
                    회원님의 현재 상황(입학 시기, 비자, 거주지)을 분석하여 시기별 맞춤 행정/학사 체크리스트를 생성해 드립니다.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-950 border border-white/10 text-neutral-300">🎓 9월 입학 (가을학기)</span>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-950 border border-white/10 text-neutral-300">🛂 D-2 유학 비자</span>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-950 border border-white/10 text-neutral-300">🏢 교내 기숙사 거주</span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  {!coachGenerated ? (
                    <button
                      onClick={handleGenerateCoach}
                      disabled={isCoachLoading}
                      className="w-full md:w-auto px-6 py-4 bg-gradient-to-r from-[#A5A58D] to-[] hover:from-[#A5A58D] hover:to-[] text-white font-black rounded-2xl shadow-lg shadow-[#A5A58D]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isCoachLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>AI 맞춤 타임라인 생성 중...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span>맞춤형 체크리스트 생성하기</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="px-6 py-3 rounded-2xl bg-[#A5A58D]/20 border border-[#A5A58D]/40 text-[#A5A58D] font-black text-sm flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      <span>생성 완료됨</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Generated Timeline Checklist */}
            <AnimatePresence>
              {coachGenerated && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <h3 className="text-base font-black text-white px-2">나만의 필수 행정 타임라인 🗓️</h3>
                  
                  <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:inset-y-0 before:left-[11px] md:before:left-[15px] before:w-[2px] before:bg-white/10">
                    
                    {/* Step 1: Pre-arrival */}
                    <div className="relative">
                      <div className="absolute -left-6 md:-left-8 top-1.5 w-3 h-3 bg-neutral-900 border-2 border-[#A49A87] rounded-full z-10" />
                      <h4 className="text-sm font-black text-[#A49A87] mb-3">입학 전 (D-30 ~ D-7)</h4>
                      <div className="space-y-2">
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] cursor-pointer group hover:bg-neutral-800 transition-colors">
                          <input type="checkbox" checked={!!coachChecklist['t1']} onChange={() => toggleCoachCheck('t1')} className="mt-1 w-4 h-4 rounded text-[#A5A58D] bg-neutral-950 border-white/20" />
                          <div>
                            <span className={`text-sm font-bold block ${coachChecklist['t1'] ? 'text-neutral-500 line-through' : 'text-white'}`}>기숙사 입사 서류 준비 (결핵검사 진단서)</span>
                            <span className="text-xs text-neutral-400">입사 시 제출 필수. 영문 또는 국문 진단서 준비</span>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] cursor-pointer group hover:bg-neutral-800 transition-colors">
                          <input type="checkbox" checked={!!coachChecklist['t2']} onChange={() => toggleCoachCheck('t2')} className="mt-1 w-4 h-4 rounded text-[#A5A58D] bg-neutral-950 border-white/20" />
                          <div>
                            <span className={`text-sm font-bold block ${coachChecklist['t2'] ? 'text-neutral-500 line-through' : 'text-white'}`}>2학기 수강신청 진행</span>
                            <span className="text-xs text-neutral-400">학사 포털에서 본인 전공 필수 과목 신청</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Step 2: Week 1 */}
                    <div className="relative">
                      <div className="absolute -left-6 md:-left-8 top-1.5 w-3 h-3 bg-neutral-900 border-2 border-[#A5A58D] rounded-full z-10" />
                      <h4 className="text-sm font-black text-[#A5A58D] mb-3">입학 1주차 (D+1 ~ D+7)</h4>
                      <div className="space-y-2">
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#A5A58D]/10 border border-[#A5A58D]/30 cursor-pointer group hover:bg-[#A5A58D]/20 transition-colors">
                          <input type="checkbox" checked={!!coachChecklist['t3']} onChange={() => toggleCoachCheck('t3')} className="mt-1 w-4 h-4 rounded text-[#A5A58D] bg-neutral-950 border-white/20" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-black ${coachChecklist['t3'] ? 'text-neutral-500 line-through' : 'text-[#A5A58D]'}`}>외국인 등록증(ARC) 신청서 제출</span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#A49A87]/20 text-[#A49A87] border border-[#A49A87]/30">법적 필수</span>
                            </div>
                            <span className="text-xs text-neutral-400">출입국관리사무소 방문 예약 또는 대학 단체 접수 확인</span>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] cursor-pointer group hover:bg-neutral-800 transition-colors">
                          <input type="checkbox" checked={!!coachChecklist['t4']} onChange={() => toggleCoachCheck('t4')} className="mt-1 w-4 h-4 rounded text-[#A5A58D] bg-neutral-950 border-white/20" />
                          <div>
                            <span className={`text-sm font-bold block ${coachChecklist['t4'] ? 'text-neutral-500 line-through' : 'text-white'}`}>한국 은행 계좌 개설</span>
                            <span className="text-xs text-neutral-400">교내 우리은행 지점 방문 (여권, 입학허가서 지참)</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Step 3: Week 2+ */}
                    <div className="relative">
                      <div className="absolute -left-6 md:-left-8 top-1.5 w-3 h-3 bg-neutral-900 border-2 border-[#A49A87] rounded-full z-10" />
                      <h4 className="text-sm font-black text-[#A49A87] mb-3">입학 2주차 ~ 한 달 (D+14 ~ D+30)</h4>
                      <div className="space-y-2">
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] cursor-pointer group hover:bg-neutral-800 transition-colors">
                          <input type="checkbox" checked={!!coachChecklist['t5']} onChange={() => toggleCoachCheck('t5')} className="mt-1 w-4 h-4 rounded text-[#A5A58D] bg-neutral-950 border-white/20" />
                          <div>
                            <span className={`text-sm font-bold block ${coachChecklist['t5'] ? 'text-neutral-500 line-through' : 'text-white'}`}>모바일 학생증 발급 및 도서관 출입 등록</span>
                            <span className="text-xs text-neutral-400">종합정보시스템 사진 등록 후 앱 다운로드</span>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] cursor-pointer group hover:bg-neutral-800 transition-colors">
                          <input type="checkbox" checked={!!coachChecklist['t6']} onChange={() => toggleCoachCheck('t6')} className="mt-1 w-4 h-4 rounded text-[#A5A58D] bg-neutral-950 border-white/20" />
                          <div>
                            <span className={`text-sm font-bold block ${coachChecklist['t6'] ? 'text-neutral-500 line-through' : 'text-white'}`}>유학생 의무 건강보험 고지서 확인</span>
                            <span className="text-xs text-neutral-400">국민건강보험 우편물 주소지(기숙사) 수령 확인</span>
                          </div>
                        </label>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 1: VISA D-DAY & AUTOMATIC CARE */}
        {activeTab === 'd-day' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Timeline Roadmap */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] space-y-4">
              <h3 className="text-base font-black flex items-center gap-2 text-[#E8E5DF]">
                <Calendar size={18} />
                <span>체류기간 연장 권장 타임라인</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#A49A87]">STAGE 1</span>
                    <span className="text-neutral-400">만료 4개월 전</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">연장 신청 가능 오픈</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    하이코리아를 통해 비자 연장 신청이 가능해지는 시점입니다.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#A49A87]/20 border border-[#A49A87]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#A49A87]">STAGE 2</span>
                    <span className="text-neutral-400">만료 45일 전 (★추천)</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#A49A87]">서류 접수 권장 기간</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    출입국 방문예약 또는 온라인 서류 심사가 3~4주 소요되므로 이 시기에 접수하세요.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-950/40 border border-[#A49A87]/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#A49A87]">STAGE 3</span>
                    <span className="text-neutral-400">만료 당일</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#A49A87]">체류기간 최종 마감</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    당일까지 서류 미접수 시 불법체류로 처리되어 출국 조치됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Action Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://www.hikorea.go.kr"
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-gradient-to-r from-[#A49A87]/60 to-[#968F83]/60 border border-[#A49A87]/40 hover:border-[#A49A87] transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#A49A87] text-white">
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#A49A87] transition-colors">
                      하이코리아 (HiKorea) 방문예약 접수
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">대한민국 출입국·외국인청 공식 온라인 전자민원</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#A49A87] group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#968F83]/30 border border-[#968F83]/40 text-[#E8E5DF]">
                    <PhoneCall size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">유학생 지원 센터 행정 창구</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">명지전문대학 본관(A동) 101호 | 02-300-9999</p>
                  </div>
                </div>
                <a
                  href="tel:02-300-9999"
                  className="px-3.5 py-1.5 rounded-xl bg-[#968F83] hover:bg-[#968F83] text-white text-xs font-bold transition-colors"
                >
                  전화 상담
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: REQUIRED DOCUMENT CHECKLIST */}
        {activeTab === 'checklist' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Checklist Category Selector Subtabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {MOCK_CHECKLIST_GROUPS.map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => setChecklistCategory(grp.category)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    checklistCategory === grp.category
                      ? 'bg-[#968F83] text-white shadow-lg shadow-[#968F83]/30'
                      : 'bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] text-neutral-400 hover:text-white hover:from-white/[0.1]'
                  }`}
                >
                  {grp.title.split('(')[0]}
                </button>
              ))}
            </div>

            {/* Active Group Progress Bar & Notice */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-black text-white">{activeChecklistGroup.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{activeChecklistGroup.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-400">
                    준비 완료: <strong className="text-[#E8E5DF]">{completedItemsCount}</strong> / {activeItemsCount}
                  </span>
                  <div className="w-32 h-2.5 bg-neutral-800 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-[#968F83] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-[#E8E5DF]">{progressPercent}%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#A49A87]/20 border border-[#A49A87]/30 text-[#A49A87] text-xs font-medium flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#A49A87] shrink-0" />
                <span>{activeChecklistGroup.notice}</span>
              </div>

              {/* Checklist Interactive Items */}
              <div className="space-y-3 pt-2">
                {activeChecklistGroup.items.map((item) => {
                  const isChecked = !!checkedItemIds[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheckItem(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isChecked
                          ? 'bg-[#968F83]/20 border-[#968F83]/50 text-neutral-300'
                          : 'bg-neutral-950 border-white/10 hover:border-white/20 text-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-lg mt-0.5 transition-colors ${
                          isChecked ? 'bg-[#968F83] text-white' : 'bg-neutral-800 border border-white/20 text-transparent'
                        }`}>
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isChecked ? 'line-through text-neutral-500' : 'text-white'}`}>
                              {item.title}
                            </span>
                            {item.required ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A49A87]/20 text-[#A49A87] border border-[#A49A87]/30">
                                필수 서류
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                                해당자만
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>

                      {item.downloadUrl && (
                        <a
                          href={item.downloadUrl}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-xl bg-[#968F83]/20 hover:bg-[#968F83]/30 text-[#E8E5DF] border border-[#968F83]/30 text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Download size={14} />
                          <span>양식 다운로드</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: IMMIGRATION & ARC PROCEDURE & FAQ */}
        {activeTab === 'qna' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* HiKorea & ARC Step-by-Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* HiKorea Visit Reservation Guide */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-black text-[#A49A87] flex items-center gap-2">
                    <Building size={18} />
                    <span>하이코리아(HiKorea) 방문예약 방법</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {MOCK_HIKOREA_STEPS.map((st) => (
                    <div key={st.stepNumber} className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#A49A87] text-white text-[10px] font-black flex items-center justify-center">
                          {st.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-white">{st.title}</h4>
                      </div>
                      <p className="text-xs text-neutral-400 pl-7 leading-relaxed">{st.description}</p>
                      {st.linkUrl && (
                        <a
                          href={st.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A49A87] hover:underline pl-7 mt-1"
                        >
                          {st.linkLabel}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ARC Card Procedure Guide */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-black text-[#E8E5DF] flex items-center gap-2">
                    <UserCheck size={18} />
                    <span>외국인등록증(ARC) 발급 절차</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {MOCK_ARC_STEPS.map((st) => (
                    <div key={st.stepNumber} className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#968F83] text-white text-[10px] font-black flex items-center justify-center">
                          {st.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-white">{st.title}</h4>
                      </div>
                      <p className="text-xs text-neutral-400 pl-7 leading-relaxed">{st.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Searchable FAQ Accordion */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <HelpCircle size={18} className="text-[#E8E5DF]" />
                  <span>출입국 & 학적 자주 묻는 질문 (FAQ)</span>
                </h3>

                {/* FAQ Search Box */}
                <div className="relative max-w-xs w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={faqSearchQuery}
                    onChange={(e) => setFaqSearchQuery(e.target.value)}
                    placeholder="Q&A 질문 검색 (예: 알바, 비자연장, 주소...)"
                    className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#968F83] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className="rounded-2xl border border-white/10 overflow-hidden bg-neutral-950">
                      <button
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-[#968F83]/20 text-[#E8E5DF] border border-[#968F83]/30">
                            {faq.category}
                          </span>
                          <span className="text-xs font-bold text-white">Q. {faq.question}</span>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`text-neutral-400 transition-transform ${isExpanded ? 'rotate-180 text-[#E8E5DF]' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 bg-white/[0.03] p-4 text-xs text-neutral-300 leading-relaxed font-medium"
                          >
                            <strong className="text-[#E8E5DF] block mb-1">A. 안내 답변:</strong>
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* EDIT VISA PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.15] backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6),inset_0_1px_2px_0_rgba(255,255,255,0.2)] rounded-3xl p-6 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-black">내 비자 체류 정보 설정</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">비자 자격 종류 (Visa Type)</label>
                  <select
                    value={editVisaType}
                    onChange={(e) => setEditVisaType(e.target.value as any)}
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#968F83]"
                  >
                    <option value="D-2">D-2 (유학 / Regular Academic)</option>
                    <option value="D-4">D-4 (어학연수 / Language Training)</option>
                    <option value="D-10">D-10 (구직 / Job Seeking)</option>
                    <option value="E-7">E-7 (특정활동 / Professional Employment)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">외국인등록번호 (ARC Number)</label>
                  <input
                    type="text"
                    value={editArcNumber}
                    onChange={(e) => setEditArcNumber(e.target.value)}
                    placeholder="예: 040315-4******"
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#968F83]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">비자 만료 예정일 (Expiry Date)</label>
                  <input
                    type="date"
                    value={editExpiryDate}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#968F83]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl text-xs"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveVisaProfile}
                  className="flex-1 py-2.5 bg-[#968F83] hover:bg-[#968F83] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#968F83]/30"
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
