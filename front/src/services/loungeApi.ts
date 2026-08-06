export interface LoungeProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male';
  nationality: string; // Flag + Name (e.g. 🇻🇳 베트남)
  major: string;
  mbti: string;
  languages: string[]; // e.g. ["한국어 (상)", "베트남어 (원어민)", "영어 (중)"]
  hobbies: string[];
  bio: string;
  avatar: string;
  aiMatchScore: number; // Percentage e.g. 94
  isMatched?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'peer';
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: '캠퍼스용어' | '신조어' | '한국문화';
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  nationality: string;
  score: number;
  badge: string;
}

export interface SocialEvent {
  id: string;
  title: string;
  category: '파티' | '문화체험' | '벼룩시장' | '언어교환';
  date: string;
  time: string;
  location: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  image: string;
  isApplied?: boolean;
}

export const MOCK_TINDER_PROFILES: LoungeProfile[] = [
  {
    id: 'prof-1',
    name: '김지은 (Jieun Kim)',
    age: 22,
    gender: 'female',
    nationality: '🇰🇷 한국',
    major: '경영학과 3학년',
    mbti: 'ENFP',
    languages: ['한국어 (원어민)', '영어 (상)', '베트남어 (초급)'],
    hobbies: ['K-POP 댄스', '맛집 탐방', '카페 스터디'],
    bio: '외국인 유학생 친구들과 언어교환도 하고 맛집 투어 가고 싶어요! 편하게 Swipe 해주세요 💖',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    aiMatchScore: 96,
  },
  {
    id: 'prof-2',
    name: 'Nguyen Thi Huong',
    age: 21,
    gender: 'female',
    nationality: '🇻🇳 베트남',
    major: '미디어디자인과 2학년',
    mbti: 'INFJ',
    languages: ['베트남어 (원어민)', '한국어 (중급)', '영어 (중급)'],
    hobbies: ['사진 촬영', '유튜브 편집', '한강 피크닉'],
    bio: '한국문화와 드라마 좋아해요. 한국인 튜터 친구나 같이 카페 갈 친구 구합니다!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    aiMatchScore: 92,
  },
  {
    id: 'prof-3',
    name: 'Alexandre Dubois',
    age: 23,
    gender: 'male',
    nationality: '🇫🇷 프랑스',
    major: '컴퓨터공학과 교환학생',
    mbti: 'ENTP',
    languages: ['프랑스어 (원어민)', '영어 (상급)', '한국어 (초급)'],
    hobbies: ['코딩 프로젝트', '보드게임', '풋살'],
    bio: 'Looking for Korean language exchange & coding buddy! Let’s get coffee together ☕',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    aiMatchScore: 89,
  },
  {
    id: 'prof-4',
    name: 'Li Wei (이위)',
    age: 22,
    gender: 'male',
    nationality: '🇨🇳 중국',
    major: '관광경영학과 3학년',
    mbti: 'ISTJ',
    languages: ['중국어 (원어민)', '한국어 (상급)', '영어 (중급)'],
    hobbies: ['배드민턴', '요리', '영화 감상'],
    bio: '한국어 토론 스터디 및 주말 스포츠 소모임 멤버 구해요! 언제든 메시지 주세요.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    aiMatchScore: 94,
  },
];

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '대학생들이 시험기간에 잠을 줄이고 밤을 새워 집중 공부하는 것을 뜻하는 한국어 캠퍼스 용어는?',
    category: '캠퍼스용어',
    options: ['벼락치기', '팀플', '학식', '꿀강'],
    correctIndex: 0,
    explanation: '벼락치기는 시험 바로 전날 밤을 새워 집중 공부하는 것을 뜻합니다.',
  },
  {
    id: 2,
    question: '다음 중 "알아서 잘 딱 깔끔하고 센스있게"의 줄임말인 인싸 신조어는 무엇일까요?',
    category: '신조어',
    options: ['갓생', '알잘딱깔센', '삼귀다', '억까'],
    correctIndex: 1,
    explanation: '알잘딱깔센은 상황에 맞게 센스 있게 처리한다는 대표 인기 신조어입니다.',
  },
  {
    id: 3,
    question: '대학 조별 과제에서 아무 일도 하지 않고 이름만 숟가락 얹는 사람을 비유하는 단어는?',
    category: '캠퍼스용어',
    options: ['무임승차자 (Free Rider)', '아웃사이더', '복학생', '과대표'],
    correctIndex: 0,
    explanation: '무임승차자(Free Rider)는 팀플 시 기여 없이 학점을 챙기려는 사람을 말합니다.',
  },
  {
    id: 4,
    question: '아직 정식으로 사귀는 단계는 아니지만, 사귀기 직전의 설레는 단계를 뜻하는 신조어 "삼귀다"의 의미는?',
    category: '신조어',
    options: ['4(사)귀다 전 단계인 3(삼)귀다', '세 번 데이트함', '친구 3명 모임', '삼겹살 먹기'],
    correctIndex: 0,
    explanation: '숫자 4(사귀다)보다 하나 적은 숫자 3(삼귀다)으로 썸 타는 단계를 위트 있게 부르는 말입니다.',
  },
  {
    id: 5,
    question: '하루하루를 보람차고 부지런하게 살아가는 알찬 라이프스타일을 부르는 신조어는?',
    category: '신조어',
    options: ['갓생 (GOD+생)', '억지 텐션', '중꺾마', '갓성비'],
    correctIndex: 0,
    explanation: '갓생(GOD+生)은 계획적이고 열심히 성실히 사는 삶을 칭찬하는 단어입니다.',
  },
  {
    id: 6,
    question: '한국 식당에서 고기를 먹은 후 한국인들이 마무리를 위해 필수 코스로 꼭 볶아 먹는 음식은?',
    category: '한국문화',
    options: ['K-디저트 K-볶음밥', '냉면', '계란찜', '된장찌개'],
    correctIndex: 0,
    explanation: '한국에서는 삼겹살이나 닭갈비 등을 먹고 난 판에 밥을 볶아 먹는 볶음밥을 "한국인의 진정한 K-디저트"라고 부릅니다.',
  },
  {
    id: 7,
    question: '대학 교과목 중에서 과제나 시험 부담이 적고 성적(학점)을 잘 주는 인기 수강 과목을 부르는 단어는?',
    category: '캠퍼스용어',
    options: ['꿀강 (꿀+강의)', '전공필수', '체풀강', '학점포기'],
    correctIndex: 0,
    explanation: '꿀강은 달콤한 꿀처럼 학점을 잘 주고 강의 만족도가 높은 추천 수강 과목입니다.',
  },
  {
    id: 8,
    question: '다음 중 BTS와 K-POP 팬들이 콘서트나 응원 시 사용하는 빛나는 응원 도구는 무엇일까요?',
    category: '한국문화',
    options: ['응원봉 (Lightstick)', '풍선', '야광 띠', '슬로건 타월'],
    correctIndex: 0,
    explanation: 'K-POP 아이돌 팬덤은 각 그룹의 상징 색상과 디자인을 담은 중앙제어 응원봉(Lightstick)으로 콘서트를 빛냅니다.',
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Sukhbat (몽골)', nationality: '🇲🇳 몽골', score: 1450, badge: '🥇 K-POP 퀴즈 마스터' },
  { rank: 2, name: '김민준 (한국)', nationality: '🇰🇷 한국', score: 1380, badge: '🥈 캠퍼스 박사' },
  { rank: 3, name: 'Nguyen Van B (베트남)', nationality: '🇻🇳 베트남', score: 1290, badge: '🥉 한국어 달인' },
  { rank: 4, name: 'Elena (우즈벡)', nationality: '🇺🇿 우즈베키스탄', score: 1120, badge: '🎖️ 퀴즈 챔피언' },
  { rank: 5, name: 'Zhang Wei (중국)', nationality: '🇨🇳 중국', score: 980, badge: '🎖️ 열정 유학생' },
];

export const MOCK_SOCIAL_EVENTS: SocialEvent[] = [
  {
    id: 'evt-1',
    title: '🎉 2026 글로벌 가을학기 유학생 웰컴 네트워킹 파티',
    category: '파티',
    date: '2026-09-15 (금)',
    time: '18:00 - 21:00',
    location: 'A동 본관 3층 대강당 & 루프탑 라운지',
    description: '전 세계 20여 개국 유학생들과 한국인 버디들이 함께하는 음악, K-FOOD 및 선물 추첨 파티!',
    maxParticipants: 60,
    currentParticipants: 48,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    isApplied: true,
  },
  {
    id: 'evt-2',
    title: '🍁 한강 소풍 & 글로벌 K-POP 댄스 원데이 클래스',
    category: '문화체험',
    date: '2026-09-20 (일)',
    time: '14:00 - 17:00',
    location: '여의도 한강공원 피크닉존',
    description: '시원한 가을바람 맞으며 한강 치맥 소풍 및 스트릿 K-POP 댄스 기본 동작 익히기 밋업!',
    maxParticipants: 30,
    currentParticipants: 22,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    isApplied: false,
  },
  {
    id: 'evt-3',
    title: '🛍️ 나눔 벼룩시장 (Flea Market) & 중고 전공서적 교환회',
    category: '벼룩시장',
    date: '2026-09-25 (금)',
    time: '11:00 - 16:00',
    location: 'C동 예체능관 앞 중앙 잔디 광장',
    description: '졸업생 및 재학생들이 직접 판매하는 가전제품, 전공책, 수공예품 아나바다 장터!',
    maxParticipants: 100,
    currentParticipants: 85,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&auto=format&fit=crop&q=80',
    isApplied: false,
  },
];
