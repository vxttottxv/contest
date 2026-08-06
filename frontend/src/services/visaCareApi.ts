export interface VisaProfile {
  visaType: 'D-2' | 'D-4' | 'D-10' | 'E-7' | 'F-2';
  visaName: string;
  arcNumber: string;
  expiryDate: string; // YYYY-MM-DD
  recommendedExtensionDate: string; // YYYY-MM-DD (45 days before expiry)
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'EXPIRED';
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'extension' | 'address' | 'parttime';
  required: boolean;
  description: string;
  downloadUrl?: string;
  downloadName?: string;
}

export interface ChecklistGroup {
  id: string;
  category: 'extension' | 'address' | 'parttime';
  title: string;
  subtitle: string;
  notice: string;
  items: ChecklistItem[];
}

export interface StepGuide {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
  linkUrl?: string;
  linkLabel?: string;
}

export interface VisaFAQ {
  id: string;
  category: '출입국' | '비자연장' | '시간제취업' | '외국인등록증';
  question: string;
  answer: string;
}

export const MOCK_DEFAULT_VISA: VisaProfile = {
  visaType: 'D-2',
  visaName: 'D-2 (유학 / Regular Academic Student)',
  arcNumber: '040315-4******',
  expiryDate: '2026-09-30',
  recommendedExtensionDate: '2026-08-16',
  status: 'WARNING',
};

export const MOCK_CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    id: 'grp-ext',
    category: 'extension',
    title: '비자 체류기간 연장 (Visa Extension)',
    subtitle: 'D-2/D-4 비자 만료 4개월 전부터 연장 신청 가능',
    notice: '⚠️ 만료일 이후 연장 신청 시 범칙금이 부과되며 출국 조치될 수 있습니다.',
    items: [
      {
        id: 'ext-1',
        category: 'extension',
        title: '통합신청서 (출입국 서식 34호)',
        required: true,
        description: '여권 사진 1매 부착 (6개월 이내 촬영)',
        downloadUrl: '#',
        downloadName: '통합신청서_서식34호.pdf',
      },
      {
        id: 'ext-2',
        category: 'extension',
        title: '여권 원본 및 사본 + 외국인등록증(ARC)',
        required: true,
        description: '여권 유효기간이 연장 기간보다 길어야 합니다.',
      },
      {
        id: 'ext-3',
        category: 'extension',
        title: '재학증명서 & 성적증명서 원본',
        required: true,
        description: '최근 1개월 이내 대학 행정실에서 발급받은 원본',
      },
      {
        id: 'ext-4',
        category: 'extension',
        title: '체류지 입증 서류',
        required: true,
        description: '임대차계약서 사본, 기숙사 입사확인서, 또는 거주/숙식 제공 확인서',
      },
      {
        id: 'ext-5',
        category: 'extension',
        title: '재정 입증 서류 (통장잔고증명서)',
        required: true,
        description: '평균 평점 2.0 미만 시 잔고증명서(약 1,000만원~2,000만원 이상) 필수 제출',
      },
      {
        id: 'ext-6',
        category: 'extension',
        title: '수수료 (60,000원)',
        required: true,
        description: '하이코리아 온라인 신청 시 50,000원 할인 적용',
      },
    ],
  },
  {
    id: 'grp-addr',
    category: 'address',
    title: '체류지 변경 신고 (Address Change)',
    subtitle: '이사 후 14일 이내 신속 신고 필수',
    notice: '⚠️ 14일 초과 시 출입국관리법 제36조에 따라 과태료(최대 100만원) 부과',
    items: [
      {
        id: 'ext-addr-1',
        category: 'address',
        title: '체류지 변경신고서 (통합신청서)',
        required: true,
        description: '하이코리아 온라인 전자민원 무료 신고 가능',
      },
      {
        id: 'ext-addr-2',
        category: 'address',
        title: '여권 원본 및 외국인등록증(ARC)',
        required: true,
        description: '외국인등록증 뒷면에 새로운 주소  estamp 표기',
      },
      {
        id: 'ext-addr-3',
        category: 'address',
        title: '새로운 체류지 증명 서류',
        required: true,
        description: '본인 명의 임대차계약서 원본/사본 또는 기숙사 입사 확인서',
      },
      {
        id: 'ext-addr-4',
        category: 'address',
        title: '거주/숙식 제공 확인서 (해당자)',
        required: false,
        description: '타인(친구, 친척) 명의 집 거주 시 거주제공자 신분증 사본 동첨',
      },
    ],
  },
  {
    id: 'grp-work',
    category: 'parttime',
    title: '시간제 취업 허가 / 알바 (Part-time Work)',
    subtitle: 'D-2/D-4 유학생 합법적 알바 사전 허가 절차',
    notice: '⚠️ 사전 허가 없이 알바 적발 시 출국 명령 및 3년간 비자 연장 불허',
    items: [
      {
        id: 'ext-work-1',
        category: 'parttime',
        title: '외국인유학생 시간제취업 확인서',
        required: true,
        description: '고용주 작성 ➔ 대학 유학생 담당자 직인 날인 필수',
        downloadUrl: '#',
        downloadName: '시간제취업확인서_서식.pdf',
      },
      {
        id: 'ext-work-2',
        category: 'parttime',
        title: '표준근로계약서 사본',
        required: true,
        description: '근로시간, 시급(최저임금 이상), 근무내용 명시',
      },
      {
        id: 'ext-work-3',
        category: 'parttime',
        title: '사업자등록증 사본',
        required: true,
        description: '근무할 사업장의 사업자등록증 사본 1부',
      },
      {
        id: 'ext-work-4',
        category: 'parttime',
        title: 'TOPIK 한국어능력시험 성적표',
        required: true,
        description: 'TOPIK 3급 이상 (미소지 시 허가 시간 50% 단축)',
      },
      {
        id: 'ext-work-5',
        category: 'parttime',
        title: '전학기 성적증명서 (GPA 2.0 이상)',
        required: true,
        description: '평점 2.0 미만 시 시간제 취업 허가 불가',
      },
    ],
  },
];

export const MOCK_HIKOREA_STEPS: StepGuide[] = [
  {
    stepNumber: 1,
    title: '하이코리아(HiKorea) 회원가입 및 로그인',
    description: '외국인등록번호(ARC) 또는 여권번호로 하이코리아 회원가입 후 로그인합니다.',
    tip: '한국 휴대폰 번호 또는 PASS 인증서가 있으면 간편 접속이 가능합니다.',
    linkUrl: 'https://www.hikorea.go.kr',
    linkLabel: '하이코리아 공식 홈페이지 바로가기 🔗',
  },
  {
    stepNumber: 2,
    title: '방문예약 신청 메뉴 선택',
    description: '상단 메뉴 [방문예약] ➔ [방문예약 신청(비회원/회원)]을 클릭합니다.',
    tip: '온라인 전자민원이 가능한 서류는 방문 없이 인터넷 접수가 10% 더 저렴합니다.',
  },
  {
    stepNumber: 3,
    title: '관할 출입국·외국인관서 및 방문일시 선택',
    description: '주소지 관할 출입국사무소(예: 서울출입국·외국인청)를 선택하고 방문 희망 날짜와 시간을 지정합니다.',
    tip: '개강 직후(3월, 9월)는 방문예약이 일찍 마감되므로 최소 3~4주 전 예약하세요.',
  },
  {
    stepNumber: 4,
    title: '방문예약 접수증 출력 및 사무소 방문',
    description: '예약 완료 후 [방문예약 접수증]을 인쇄하여 예약 시간 10분 전 관할 출입국사무소 창구에 방문합니다.',
    tip: '접수증 미소지 시 입장 차순이 뒤로 밀릴 수 있으므로 모바일 캡처본 또는 출력본을 지참하세요.',
  },
];

export const MOCK_ARC_STEPS: StepGuide[] = [
  {
    stepNumber: 1,
    title: '입국 후 90일 이내 발급 신청',
    description: '대한민국 입국일로부터 90일 이내에 주소지 관할 출입국·외국인관서에 외국인등록을 완료해야 합니다.',
    tip: '학교 단체발급 기간(3월 초 / 9월 초)에 신청하면 대리 접수로 편하게 발급받을 수 있습니다.',
  },
  {
    stepNumber: 2,
    title: '필수 제출 서류 지참 및 방문',
    description: '여권 원본, 통합신청서, 여권용 사진 1매, 재학증명서, 체류지 입증서류, 수수료 30,000원을 준비합니다.',
  },
  {
    stepNumber: 3,
    title: '출입국 창구 지문 등록 (Biometrics)',
    description: '방문 당일 출입국 창구 담당자 안내에 따라 양손 지문 등록 및 얼굴 촬영 조사를 진행합니다.',
  },
  {
    stepNumber: 4,
    title: '외국인등록증(ARC) 수령 (약 3~4주 소요)',
    description: '신청 후 약 3~4주 뒤 출입국 방문 수령 또는 등기 우편(배송비 추가)으로 실물 카드를 수령합니다.',
  },
];

export const MOCK_VISA_FAQS: VisaFAQ[] = [
  {
    id: 'faq-1',
    category: '비자연장',
    question: '비자 체류기간 연장은 언제부터 신청할 수 있나요?',
    answer: '체류기간 만료일 4개월 전부터 만료 당일까지 신청 가능합니다. 만료일이 지나면 불법체류자로 처리되어 범칙금이 부과되므로 최소 1개월 전에 신청하는 것을 강력히 권장합니다.',
  },
  {
    id: 'faq-2',
    category: '시간제취업',
    question: '유학생(D-2)은 일주일에 몇 시간까지 알바(시간제 취업)가 가능한가요?',
    answer: '학부생(1~3학년) 기준으로 주당 최대 20시간(TOPIK 3급 이상 소지 시 25시간)까지 가능하며, 주말 및 방학 중에는 시간 제한 없이 근무할 수 있습니다. 단, 사전 허가가 필수입니다.',
  },
  {
    id: 'faq-3',
    category: '출입국',
    question: '이사 후 주소 변경 신고는 언제까지 해야 하나요?',
    answer: '새로운 거주지로 이사한 날(계약 시작일)로부터 14일 이내에 관할 출입국사무소 또는 주민센터, 하이코리아 온라인 전자민원으로 체류지 변경 신고를 해야 합니다. 14일 초과 시 과태료가 부과됩니다.',
  },
  {
    id: 'faq-4',
    category: '외국인등록증',
    question: '외국인등록증(ARC)을 분실했을 때는 어떻게 재발급받나요?',
    answer: '분실을 안 날로부터 14일 이내에 여권, 여권사진 1매, 사유서, 수수료 30,000원을 지참하여 관할 출입국사무소 방문 또는 하이코리아 전자민원으로 재발급 신청해야 합니다.',
  },
];

// Calculate D-Day utility
export function calculateDDay(expiryDateStr: string): {
  dDayNumber: number;
  dDayText: string;
  status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'EXPIRED';
  statusLabel: string;
  recommendedText: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: 'SAFE' | 'WARNING' | 'CRITICAL' | 'EXPIRED' = 'SAFE';
  let statusLabel = '체류기간 안전 (Safe)';
  let recommendedText = '비자 만료까지 여유가 있습니다. 만료 2개월 전에 준비를 시작하세요.';

  if (diffDays <= 0) {
    status = 'EXPIRED';
    statusLabel = '🚨 비자 만료됨 (Expired)';
    recommendedText = '비자 기간이 이미 경과했습니다! 즉시 학교 유학생지원센터로 연락하세요.';
  } else if (diffDays <= 30) {
    status = 'CRITICAL';
    statusLabel = '🔥 긴급 연장 필요 (Critical)';
    recommendedText = '만료까지 30일 미만입니다! 지금 바로 하이코리아 방문예약 및 서류를 접수하세요.';
  } else if (diffDays <= 90) {
    status = 'WARNING';
    statusLabel = '⚠️ 비자 연장 권장 기간 (Warning)';
    recommendedText = '체류기간 연장 서류 준비 적기입니다. 체크리스트를 확인하고 서류를 준비하세요.';
  }

  const dDayText = diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? 'D-DAY' : `D+${Math.abs(diffDays)}`;

  return {
    dDayNumber: diffDays,
    dDayText,
    status,
    statusLabel,
    recommendedText,
  };
}
