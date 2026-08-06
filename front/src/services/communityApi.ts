export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorNation?: string;
  authorBadge?: string; // e.g. "인증 유학생 선배 (4학년)"
  isAnonymous: boolean;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  category: 'national' | 'major' | 'market' | 'housing' | 'tips' | 'anonymous';
  categoryLabel: string;
  title: string;
  content: string;
  authorName: string;
  authorNation: string;
  authorAvatar?: string;
  isAnonymous: boolean;
  verifiedBadge?: string;
  views: number;
  likes: number;
  commentsCount: number;
  createdAt: string;
  isHot: boolean;
  price?: string; // For flea market
  location?: string; // For housing/flea market
  comments?: Comment[];
}

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    category: 'tips',
    categoryLabel: '생활 팁 공유',
    title: '🔥 외국인 유학생 전용 알바 허가서(시간제 취업) 빠른 승인 꿀팁!',
    content: '하이코리아 온라인 신청할 때 사업자등록증이랑 근로계약서 PDF 스캔본 깔끔하게 첨부하고 성적증명서 GPA 2.5 넘으면 3일 만에 승인나옵니다! 궁금한 점 댓글 달아주시면 답변해드릴게요.',
    authorName: 'Nguyen Van A',
    authorNation: '🇻🇳 베트남',
    isAnonymous: false,
    verifiedBadge: '인증 4학년 멘토',
    views: 1240,
    likes: 184,
    commentsCount: 32,
    createdAt: '10분 전',
    isHot: true,
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorName: 'Sukhbat',
        authorNation: '🇲🇳 몽골',
        isAnonymous: false,
        content: 'TOPIK 3급 성적표는 필수 제출인가요?',
        createdAt: '5분 전',
        likes: 4,
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorName: 'Nguyen Van A',
        authorNation: '🇻🇳 베트남',
        authorBadge: '작성자',
        isAnonymous: false,
        content: '네! TOPIK 3급 이상 있어야 주 25시간까지 허가 나오고, 없으면 주 10~15시간으로 제한됩니다.',
        createdAt: '3분 전',
        likes: 12,
      },
    ],
  },
  {
    id: 'post-2',
    category: 'market',
    categoryLabel: '중고 거래',
    title: '[중고 책/가전] 전공서적(C언어/경영학원론) 및 미니 냉장고 팝니다!',
    content: '이번 학기 졸업하게 되어서 깨끗하게 쓰던 전공서적 2권과 45L 미니냉장고(1년 사용) 저렴하게 양도합니다. 학교 정문이나 B동 공학관 로비에서 직거래 가능합니다.',
    authorName: 'Zhang Wei',
    authorNation: '🇨🇳 중국',
    isAnonymous: false,
    views: 890,
    likes: 45,
    commentsCount: 8,
    createdAt: '30분 전',
    isHot: true,
    price: '30,000원',
    location: 'B동 공학관 로비',
    comments: [
      {
        id: 'c-3',
        postId: 'post-2',
        authorName: 'Elena',
        authorNation: '🇺🇿 우즈베키스탄',
        isAnonymous: false,
        content: '미니 냉장고 오늘 오후에 바로 구매할 수 있나요?',
        createdAt: '15분 전',
        likes: 2,
      },
    ],
  },
  {
    id: 'post-3',
    category: 'housing',
    categoryLabel: '방 구하기',
    title: '학교 정문 3분 거리 남향 풀옵션 원룸 승계하실 분 구합니다 (보증금 300 / 월 35)',
    content: '다음 달 교환학생 기간이 마감되어 채워야 하는 6개월 계약 승계자를 찾습니다. 엘리베이터 있고 공과금 별도, 풀옵션(세탁기, 에어컨, 침대, 책상) 깔끔합니다.',
    authorName: 'Kovalev Alex',
    authorNation: '🇷🇺 러시아',
    isAnonymous: false,
    views: 650,
    likes: 38,
    commentsCount: 14,
    createdAt: '1시간 전',
    isHot: true,
    price: '보증금 300 / 월 35',
    location: '학교 정문 3분 거치',
  },
  {
    id: 'post-4',
    category: 'anonymous',
    categoryLabel: '익명 Q&A',
    title: '🔒 [익명] 전공 수업 조별과제(팀플) 때문에 너무 스트레스 받는데 조언 부탁드려요...',
    content: '한국인 학생들이랑 한 조가 되었는데 한국어가 아직 서툴러서 의견 낼 때 너무 떨리고 눈치 보입니다. 조별과제 역할 분담할 때 어떤 부분을 담당한다고 먼저 말하는 게 좋을까요?',
    authorName: '익명 유학생',
    authorNation: '🔒 익명',
    isAnonymous: true,
    views: 1420,
    likes: 92,
    commentsCount: 19,
    createdAt: '2시간 전',
    isHot: true,
    comments: [
      {
        id: 'c-4',
        postId: 'post-4',
        authorName: '컴공 4학년 선배',
        authorNation: '🇰🇷 한국',
        authorBadge: '인증 유학생 튜터',
        isAnonymous: false,
        content: '너무 걱정 마세요! ppt 자료 조사나 해외 사례 조사(영어/외국어 자료 조사)를 맡겠다고 먼저 다가가면 팀원들이 정말 고마워합니다! 파이팅!',
        createdAt: '1시간 전',
        likes: 45,
      },
    ],
  },
  {
    id: 'post-5',
    category: 'national',
    categoryLabel: '국적별 소모임',
    title: '🇻🇳 베트남 유학생 신입생 환영 축구 소모임 부원 모집합니다!',
    content: '이번 학기 새로 입학한 베트남 유학생 여러분 환영합니다! 매주 토요일 명지전문대 운동장에서 축구 경기 및 맛집 모임 진행합니다. 편하게 연락주세요!',
    authorName: 'Tran Minh',
    authorNation: '🇻🇳 베트남',
    isAnonymous: false,
    views: 510,
    likes: 67,
    commentsCount: 11,
    createdAt: '3시간 전',
    isHot: false,
  },
  {
    id: 'post-6',
    category: 'major',
    categoryLabel: '학과별 소모임',
    title: '💻 컴퓨터공학과 유학생 알고리즘 & 백엔드 코딩 스터디원 모집 (2명)',
    content: 'B동 301호 SW실습실에서 주 2회 파이썬/자바 알고리즘 및 웹 스터디 진행합니다. 한국어 서툴러도 함께 공부해요!',
    authorName: 'Kaito',
    authorNation: '🇯🇵 일본',
    isAnonymous: false,
    views: 430,
    likes: 31,
    commentsCount: 6,
    createdAt: '5시간 전',
    isHot: false,
  },
];
