export interface Building3D {
  id: string;
  name: string;
  code: string;
  floors: number;
  coordinates: { x: number; y: number }; // Relative percentage position on 3D canvas
  description: string;
  facilities: string[];
  entrances: string[];
  classrooms: string[];
}

export interface FacilityItem {
  id: string;
  name: string;
  buildingName: string;
  floor: string;
  category: '편의점' | '식당' | '카페' | '프린트실' | '학생식당';
  operatingHours: string;
  locationDetails: string;
}

export interface DormNotice {
  id: string;
  title: string;
  category: '모집공고' | '입퇴사일정' | '룸메이트수칙' | '식단표';
  date: string;
  content: string;
  mealMenu?: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  }[];
}

export interface FacilityGuide {
  id: string;
  name: string;
  building: string;
  location: string;
  weekdayHours: string;
  weekendHours: string;
  contact: string;
  notice: string;
}

// ── Mock Data Repository ──────────────────────────────────────────

export const MOCK_BUILDINGS: Building3D[] = [
  {
    id: 'bld-1',
    name: '본관 / 본부동 (Main Administration)',
    code: 'A동',
    floors: 7,
    coordinates: { x: 50, y: 30 },
    description: '학사행정실, 종합지원센터, 총장실 및 주요 행정 부서가 위치한 본관입니다.',
    facilities: ['학사행정실', '학생식당', '카페', 'ATM인출기'],
    entrances: ['정문 주출입구(1F)', '후면 연결통로(2F)'],
    classrooms: ['A101 세미나홀', 'A202 대강당', 'A305 화상회의실'],
  },
  {
    id: 'bld-2',
    name: '공학관 / IT융합관 (Engineering Building)',
    code: 'B동',
    floors: 8,
    coordinates: { x: 25, y: 55 },
    description: '컴퓨터공학과, AI융합과 실습실 및 IT 랩실이 집중되어 있는 공학동입니다.',
    facilities: ['24시간 프린트실', 'CU 편의점', '학생 휴게라운지'],
    entrances: ['동측 중앙 입구(1F)', '서측 엘리베이터 입구(1F)'],
    classrooms: ['B104 AI컴퓨터랩', 'B301 SW코딩실습실', 'B402 캡스톤디자인실'],
  },
  {
    id: 'bld-3',
    name: '중앙도서관 & 체육관 (Central Library & Gym)',
    code: 'C동',
    floors: 5,
    coordinates: { x: 75, y: 55 },
    description: '열람실, 글로벌 스터디룸, 피트니스 센터 및 실내 체육관이 통합된 복합 공간입니다.',
    facilities: ['중앙도서관 열람실', '실내 체육관', '북카페', '무인 자율 프린트ゾーン'],
    entrances: ['도서관 정문(2F)', '체육관 남측 출입구(1F)'],
    classrooms: ['C201 글로벌스터디룸A', 'C202 미디어제작실', 'C305 자유열람실'],
  },
  {
    id: 'bld-4',
    name: '명지 국제 기숙사 (Global Dormitory)',
    code: 'D동',
    floors: 12,
    coordinates: { x: 50, y: 80 },
    description: '외국인 유학생 및 재학생을 위한 최신식 주거공간 및 기숙사 전용 식당입니다.',
    facilities: ['기숙사 전용 식당', '세탁실/건조실', 'GS25 편의점', '무인 택배함'],
    entrances: ['카드키 보안 출입구(1F)', '사무실 측 출입구(1F)'],
    classrooms: ['D101 유학생 커뮤니티홀', 'D102 스터디카페'],
  },
];

export const MOCK_FACILITIES: FacilityItem[] = [
  {
    id: 'fac-1',
    name: '학관 CU 편의점',
    buildingName: '공학관 (B동)',
    floor: '1층',
    category: '편의점',
    operatingHours: '08:00 - 22:00 (주말 미운영)',
    locationDetails: 'B동 중앙 엘리베이터 우측',
  },
  {
    id: 'fac-2',
    name: '명지 푸드코트 학생식당',
    buildingName: '본관 (A동)',
    floor: '지하 1층',
    category: '학생식당',
    operatingHours: '중식 11:30 - 14:00 / 석식 17:00 - 19:00',
    locationDetails: 'A동 계단 내려가서 중앙 통로',
  },
  {
    id: 'fac-3',
    name: '블루라인 북카페',
    buildingName: '중앙도서관 (C동)',
    floor: '2층',
    category: '카페',
    operatingHours: '08:30 - 20:00',
    locationDetails: 'C동 도서관 입구 로비 맞은편',
  },
  {
    id: 'fac-4',
    name: '24시 무인 프린트 & 출력존',
    buildingName: '공학관 (B동)',
    floor: '1층',
    category: '프린트실',
    operatingHours: '24시간 연중무휴 (학생증 태그)',
    locationDetails: 'B동 102호 앞 휴게실 내',
  },
];

export const MOCK_DORM_NOTICES: DormNotice[] = [
  {
    id: 'dorm-1',
    title: '2026학년도 2학기 기숙사 입사 모집 & 선발 공고',
    category: '모집공고',
    date: '2026-08-01',
    content: '외국인 유학생 및 지방 거주 학생을 위한 2학기 명지 국제 기숙사 입사 신청 안내입니다. 우선 선발 대상자는 유학생 지원센터 확인 후 신청하세요.',
  },
  {
    id: 'dorm-2',
    title: '2026학년도 입·퇴사 및 방역 점검 일정 안내',
    category: '입퇴사일정',
    date: '2026-08-10',
    content: '입사일: 2026년 8월 25일(화) ~ 8월 27일(목) 09:00~18:00. 입사 시 최근 3개월 이내 결핵 검진 결과서(X-ray) 제출 필수.',
  },
  {
    id: 'dorm-3',
    title: '기숙사 공동생활 수칙 & 룸메이트 에티켓 가이드',
    category: '룸메이트수칙',
    date: '2026-08-05',
    content: '1. 소음 자제 (22:00 이후 취침 침묵 시간)\n2. 사적 외부인 동반 입실 엄격 금지\n3. 취사도구 사용 금지 (1층 공동 주방 이용)\n4. 분리수거 및 청결 유지',
  },
  {
    id: 'dorm-4',
    title: '이번 주 기숙사 전용 식단표 (8월 4주차)',
    category: '식단표',
    date: '2026-08-18',
    content: '할랄 인증 메뉴 및 글로벌 유학생 맞춤형 아시안 푸드 포함 식단입니다.',
    mealMenu: [
      { day: '월요일', breakfast: '토스트 & 시리얼 & 우유', lunch: '치킨 카레라이스 & 샐러드', dinner: '불고기 덮밥 & 미역국' },
      { day: '화요일', breakfast: '야채죽 & 계란후라이', lunch: '해물 볶음밥 & 딤섬', dinner: '닭갈비 덮밥 & 콩나물국' },
      { day: '수요일', breakfast: '모닝빵 & 잼 & 커피/주스', lunch: '돈까스 & 스프', dinner: '마파두부밥 & 계란국' },
      { day: '목요일', breakfast: '쌀밥 & 소시지구이', lunch: '베트남 쌀국수 & 짜조', dinner: '제육볶음 & 상추쌈' },
      { day: '금요일', breakfast: '시리얼 & 모닝 세트', lunch: '짜장밥 & 군만두', dinner: '순살 찜닭 & 계란찜' },
    ],
  },
];

export const MOCK_FACILITY_GUIDES: FacilityGuide[] = [
  {
    id: 'fg-1',
    name: '중앙도서관 (Central Library)',
    building: 'C동 2층~5층',
    location: 'C동 도서관 출입 게이트',
    weekdayHours: '09:00 - 22:00 (열람실 24시간)',
    weekendHours: '10:00 - 18:00',
    contact: '02-300-1234',
    notice: '유학생 전용 1:1 맞춤 논문 및 자료 탐색 상담 창구 운영 (화/목 14:00)',
  },
  {
    id: 'fg-2',
    name: '명지 스포츠 센터 & 피트니스 체육관',
    building: 'C동 1층',
    location: 'C동 남측 전용 출입구',
    weekdayHours: '07:00 - 21:30',
    weekendHours: '09:00 - 17:00',
    contact: '02-300-5678',
    notice: '운동화 및 실내 전용 용품 착용 필수, 체육관 일일 입장권 2,000원',
  },
  {
    id: 'fg-3',
    name: '오프라인 학사행정실 & 유학생 지원 센터',
    building: 'A동 1층 101호',
    location: 'A동 본관 로비 우측',
    weekdayHours: '09:00 - 17:30 (점심시간 12:00 - 13:00)',
    weekendHours: '휴무 (공휴일 포함)',
    contact: '02-300-9999',
    notice: '외국인 등록증 발급, 비자 체류 연장, 재학증명서 오프라인 발급 처리',
  },
];
