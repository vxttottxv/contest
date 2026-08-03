const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database Simulation with preset users for each role
const registeredUsers = [
  {
    id: 1,
    email: "organizer@competehub.com",
    password: "organizer123!",
    name: "김주최",
    phone: "010-1234-5678",
    role: "organizer",
    roleLabel: "주최자 (기업/기관)",
    orgName: "한국인공지능협회",
    orgType: "public", // public, enterprise, startup, university, etc.
    bizRegNum: "123-45-67890",
    website: "https://ai-association.kr",
    address: "[06164] 서울 강남구 테헤란로 123 AI타워 10층",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: "participant@competehub.com",
    password: "participant123!",
    name: "이참가",
    phone: "010-9876-5432",
    role: "participant",
    roleLabel: "참가자 (학생/개인)",
    affiliation: "university", // university, student, jobseeker, professional, etc.
    interests: ["SW/AI", "디자인/기획", "아이디어"],
    address: "[04524] 서울 중구 세종대로 110",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    email: "academy@competehub.com",
    password: "academy123!",
    name: "박학원",
    phone: "010-5555-7777",
    role: "academy",
    roleLabel: "관련 학원 / 광고주",
    academyName: "코드마스터 IT 아카데미",
    academyCategory: "SW/코딩/AI",
    bizRegNum: "987-65-43210",
    address: "[06234] 서울 강남구 역삼로 456 코딩 빌딩 3층",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    email: "admin@competehub.com",
    password: "admin123!",
    name: "최관리",
    phone: "010-0000-0000",
    role: "admin",
    roleLabel: "플랫폼 통합 관리자",
    address: "[06164] 서울 강남구 테헤란로 123",
    createdAt: new Date().toISOString()
  }
];

// 1. Email Duplication Check API
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: "이메일을 입력해 주세요." });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: "올바른 이메일 형식이 아닙니다." });
  }

  const exists = registeredUsers.some(user => user.email.toLowerCase() === email.trim().toLowerCase());
  
  if (exists) {
    return res.json({ success: false, available: false, message: "이미 사용 중인 이메일입니다." });
  } else {
    return res.json({ success: true, available: true, message: "사용 가능한 이메일입니다." });
  }
});

// 2. Member Sign-up API (Supports Roles: organizer, participant, academy)
app.post('/api/register', (req, res) => {
  const {
    role, // 'organizer' | 'participant' | 'academy'
    email,
    password,
    name,
    phone,
    zipcode,
    address,
    detailAddress,
    agreements,
    // Role specific fields:
    orgName,
    orgType,
    bizRegNum,
    website,
    affiliation,
    interests,
    academyName,
    academyCategory
  } = req.body;

  if (!email || !password || !name || !phone || !role) {
    return res.status(400).json({ success: false, message: "필수 입력 항목이 누락되었습니다." });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "비밀번호는 8자 이상이어야 합니다." });
  }

  if (agreements && (!agreements.terms || !agreements.privacy)) {
    return res.status(400).json({ success: false, message: "필수 약관에 동의하셔야 합니다." });
  }

  const exists = registeredUsers.some(user => user.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, message: "이미 가입된 이메일 계정입니다." });
  }

  let roleLabel = "일반 회원";
  if (role === 'organizer') roleLabel = "주최자 (기업/기관)";
  else if (role === 'participant') roleLabel = "참가자 (학생/개인)";
  else if (role === 'academy') roleLabel = "관련 학원 / 광고주";

  const newUser = {
    id: registeredUsers.length + 1,
    role,
    roleLabel,
    email: email.trim(),
    password: password,
    name: name.trim(),
    phone: phone.trim(),
    address: zipcode && address ? `[${zipcode}] ${address} ${detailAddress || ''}`.trim() : (address || "주소 미입력"),
    marketingAgree: !!(agreements && agreements.marketing),
    createdAt: new Date().toISOString(),

    // Dynamic Role Specific Data
    orgName: orgName ? orgName.trim() : '',
    orgType: orgType || '',
    bizRegNum: bizRegNum ? bizRegNum.trim() : '',
    website: website ? website.trim() : '',
    affiliation: affiliation || '',
    interests: Array.isArray(interests) ? interests : (interests ? [interests] : []),
    academyName: academyName ? academyName.trim() : '',
    academyCategory: academyCategory || ''
  };

  registeredUsers.push(newUser);
  console.log('[COMPETE HUB SERVER] Registered new user:', newUser.email, 'Role:', newUser.role);

  // Return clean payload
  const { password: _, ...userWithoutPassword } = newUser;

  return res.status(201).json({
    success: true,
    message: `${newUser.name}님(${roleLabel}), 회원가입이 성공적으로 완료되었습니다!`,
    user: userWithoutPassword
  });
});

// 3. User Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "이메일과 비밀번호를 모두 입력해 주세요." });
  }

  const user = registeredUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: "가입되지 않은 이메일 주소입니다." });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
  }

  console.log('[COMPETE HUB SERVER] User logged in:', user.email, 'Role:', user.role);

  const { password: _, ...userWithoutPassword } = user;

  return res.json({
    success: true,
    message: `${user.name}님 환영합니다!`,
    token: `compete_hub_token_${Date.now()}_${user.id}`,
    user: userWithoutPassword
  });
});

// 4. Password Recovery Simulation API
app.post('/api/find-password', (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: "이메일 주소를 입력해 주세요." });
  }

  const user = registeredUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: "해당 이메일로 등록된 회원 정보가 없습니다." });
  }

  return res.json({
    success: true,
    message: `${email} 주소로 비밀번호 재설정 링크를 발송했습니다. 이메일을 확인해 주세요!`
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` COMPETE HUB Auth Server running at http://localhost:${PORT}`);
  console.log(`==================================================`);
});
