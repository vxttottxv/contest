const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database Simulation with passwords for login support
const registeredUsers = [
  {
    id: 1,
    email: "admin@luxe.com",
    password: "admin123!",
    name: "LUXE 관리자",
    phone: "010-1234-5678",
    role: "VIP Administrator",
    address: "[06164] 서울 강남구 테헤란로 123 LUXE 타워 15층",
    gender: "male",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: "user@example.com",
    password: "user123!",
    name: "홍길동",
    phone: "010-9876-5432",
    role: "Gold Member",
    address: "[04524] 서울 중구 세종대로 110",
    gender: "male",
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

// 2. Member Sign-up API
app.post('/api/register', (req, res) => {
  const { email, password, name, phone, zipcode, address, detailAddress, gender, birthdate, agreements } = req.body;

  if (!email || !password || !name || !phone) {
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

  const newUser = {
    id: registeredUsers.length + 1,
    email: email.trim(),
    password: password,
    name: name.trim(),
    phone: phone.trim(),
    role: "Regular Member",
    address: zipcode && address ? `[${zipcode}] ${address} ${detailAddress || ''}`.trim() : "주소 미입력",
    gender: gender || 'unspecified',
    birthdate: birthdate || '',
    marketingAgree: !!(agreements && agreements.marketing),
    createdAt: new Date().toISOString()
  };

  registeredUsers.push(newUser);
  console.log('[NODE SERVER] Registered new user:', newUser.email);

  return res.status(201).json({
    success: true,
    message: `${newUser.name}님, 회원가입이 성공적으로 완료되었습니다!`,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      address: newUser.address,
      createdAt: newUser.createdAt
    }
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

  console.log('[NODE SERVER] User logged in:', user.email);

  // Return user info and simulated auth token
  return res.json({
    success: true,
    message: `${user.name}님 환영합니다!`,
    token: `luxe_token_${Date.now()}_${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role || "Member",
      address: user.address || "등록된 주소 없음",
      createdAt: user.createdAt
    }
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
  console.log(` LUXE Auth Server running at http://localhost:${PORT}`);
  console.log(`==================================================`);
});
