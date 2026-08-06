export interface AcademicEvent {
  id: string;
  title: string;
  category: '수강' | '시험' | '학적' | '방학';
  startDate: string;
  endDate: string;
  description: string;
  isImportant?: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  category: 'foreign' | 'merit' | 'external';
  categoryLabel: string;
  amount: string;
  eligibility: string;
  deadline: string;
  documents: string[];
  description: string;
}

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  category: '학술제' | '아이디어' | '글로벌' | '문화';
  prize: string;
  deadline: string;
  teamStatus: '모집중' | '마감임박' | '모집완료';
  teamLink: string;
  description: string;
  membersNeeded: number;
}

// ── Mock Data Repository ──────────────────────────────────────────

export const MOCK_ACADEMIC_EVENTS: AcademicEvent[] = [
  {
    id: 'ev-1',
    title: '2026학년도 2학기 수강신청 기간',
    category: '수강',
    startDate: '2026-08-18',
    endDate: '2026-08-22',
    description: '전학년 수강신청 및 유학생 전용 수강 상담 센터 운영',
    isImportant: true,
  },
  {
    id: 'ev-2',
    title: '수강철회(Drop) 마감일',
    category: '수강',
    startDate: '2026-09-08',
    endDate: '2026-09-12',
    description: '학사 종합 정보 시스템을 통한 온라인 수강철회 신청 마감',
  },
  {
    id: 'ev-3',
    title: '2학기 중간고사 시험 기간',
    category: '시험',
    startDate: '2026-10-19',
    endDate: '2026-10-24',
    description: '교양 및 전공 과목 중간고사 실시',
    isImportant: true,
  },
  {
    id: 'ev-4',
    title: '2학기 기말고사 시험 기간',
    category: '시험',
    startDate: '2026-12-14',
    endDate: '2026-12-19',
    description: '2학기 성적 평가 기말고사',
    isImportant: true,
  },
  {
    id: 'ev-5',
    title: '동계 계절학기 수강신청',
    category: '학적',
    startDate: '2026-12-28',
    endDate: '2026-12-31',
    description: '단기 이수 과목 계절학기 개설',
  },
  {
    id: 'ev-6',
    title: '2026학년도 겨울방학 시작',
    category: '방학',
    startDate: '2026-12-21',
    endDate: '2027-02-28',
    description: '동계 방학 및 유학생 귀국/체류 서류 확인 기간',
  },
];

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-1',
    title: '명지 글로벌 유학생 전용 특별 장학금',
    category: 'foreign',
    categoryLabel: '외국인 유학생 전용',
    amount: '등록금 50% ~ 100% 감면',
    eligibility: '본교 재학 중인 외국인 유학생 (GPA 3.0 이상 & TOPIK 4급 이상)',
    deadline: '2026-08-30',
    documents: ['장학금 신청서.docx', 'TOPIK 성적증명서.pdf', '통장사본.pdf'],
    description: '우수한 학업 성적과 한국어 능력을 갖춘 외국인 유학생을 위한 본교 전용 장학 혜택입니다.',
  },
  {
    id: 'sch-2',
    title: '2026-2학기 학업 성적 우수 장학금',
    category: 'merit',
    categoryLabel: '성적 장학금',
    amount: '등록금 30% ~ 70% 차등 지급',
    eligibility: '직전 학기 15학점 이상 이수 및 학과 상위 10% 이내',
    deadline: '2026-09-05',
    documents: ['성적 우수 장학 신청서.pdf'],
    description: '각 학과별 학업 성적이 우수한 학생을 대상으로 지급되는 장학금입니다.',
  },
  {
    id: 'sch-3',
    title: 'GDK 교외 유학생 서포트 재단 장학금',
    category: 'external',
    categoryLabel: '교외 장학금',
    amount: '학기당 2,000,000원 생활비 지원',
    eligibility: '체류 자격 D-2 유학생 중 교수 추천서를 받은 자',
    deadline: '2026-09-15',
    documents: ['지도교수 추천서.docx', '자기소개서.pdf', '재학증명서.pdf'],
    description: '글로벌 유학생의 안정적인 한국 생활과 학업 완수를 돕기 위한 교외 재단 지원금입니다.',
  },
];

export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'cp-1',
    title: '제5회 글로벌 유학생 아이디어 캡스톤 경진대회',
    organizer: '명지전문대학 산학협력단',
    category: '아이디어',
    prize: '총 상금 5,000,000원 (총장상 수여)',
    deadline: '2026-09-20',
    teamStatus: '모집중',
    teamLink: 'https://open.kakao.com/o/mjc_global_capstone',
    description: '한국 학생과 외국인 유학생이 팀을 이루어 캠퍼스 이노베이션 아이디어를 기획하는 경진대회입니다.',
    membersNeeded: 2,
  },
  {
    id: 'cp-2',
    title: '2026 전국 유학생 한국어 말하기 대회 & 문화 교류',
    organizer: '국제교류원',
    category: '글로벌',
    prize: '대상 2,000,000원 + 해외 문화탐방권',
    deadline: '2026-08-31',
    teamStatus: '마감임박',
    teamLink: 'https://open.kakao.com/o/mjc_korean_speech',
    description: '나의 한국 유학 생활과 캠퍼스 스토리를 주제로 발표하는 전국 유학생 대상 발표 대회입니다.',
    membersNeeded: 1,
  },
  {
    id: 'cp-3',
    title: '글로벌 IT 융합 해커톤 & 튜토링 팀원 모집',
    organizer: '컴퓨터공학과 / 글로벌센터',
    category: '학술제',
    prize: '우수팀 IT 기기 지원 및 취업 가산점',
    deadline: '2026-09-10',
    teamStatus: '모집중',
    teamLink: 'https://open.kakao.com/o/mjc_hackathon_team',
    description: '개발자, 디자이너, 기획자 유학생이 모여 24시간 동안 웹/앱 서비스를 제작하는 융합 해커톤입니다.',
    membersNeeded: 3,
  },
];

// ── API Functions (Mock Async) ────────────────────────────────────

export const fetchAcademicEvents = async (): Promise<AcademicEvent[]> => {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_ACADEMIC_EVENTS;
};

export const fetchScholarships = async (category: string = 'all'): Promise<Scholarship[]> => {
  await new Promise((res) => setTimeout(res, 200));
  if (category === 'all') return MOCK_SCHOLARSHIPS;
  return MOCK_SCHOLARSHIPS.filter((s) => s.category === category);
};

export const fetchCompetitions = async (): Promise<Competition[]> => {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_COMPETITIONS;
};
