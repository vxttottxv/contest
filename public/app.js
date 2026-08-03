/**
 * COMPETE HUB - Client Application JS
 * Supports Role-based registration & Login (Organizer, Participant, Academy, Admin)
 */

document.addEventListener('DOMContentLoaded', () => {

  // Current State
  let selectedRole = 'participant'; // default
  let isEmailVerified = false;
  let currentUser = null;

  // DOM Elements
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginContent = document.getElementById('loginContent');
  const signupContent = document.getElementById('signupContent');
  const dashboardContent = document.getElementById('dashboardContent');
  const authSubtitle = document.getElementById('authSubtitle');

  // Role Selection & Form Steps
  const roleSelectionStep = document.getElementById('roleSelectionStep');
  const signupFormStep = document.getElementById('signupFormStep');
  const roleCards = document.querySelectorAll('.role-card');
  const signupRoleInput = document.getElementById('signupRole');
  const currentRoleTitle = document.getElementById('currentRoleTitle');
  const btnChangeRole = document.getElementById('btnChangeRole');
  const labelName = document.getElementById('labelName');

  // Dynamic Role Blocks
  const blockOrganizer = document.getElementById('blockOrganizer');
  const blockParticipant = document.getElementById('blockParticipant');
  const blockAcademy = document.getElementById('blockAcademy');

  // Forms & Inputs
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordConfirmInput = document.getElementById('passwordConfirm');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');

  // Modals & Toasts
  const successModal = document.getElementById('successModal');
  const findPasswordModal = document.getElementById('findPasswordModal');
  const infoModal = document.getElementById('infoModal');
  const toastContainer = document.getElementById('toastContainer');

  // ==========================================================================
  // 1. TABS SWITCHER (Login / Signup / Dashboard)
  // ==========================================================================

  function switchTab(tabName) {
    if (tabName === 'login') {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      loginContent.classList.add('active');
      signupContent.classList.remove('active');
      dashboardContent.classList.remove('active');
      authSubtitle.textContent = "모든 대회·공모전 공고 등록부터 참가 신청, 학원 홍보까지";
    } else if (tabName === 'signup') {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      signupContent.classList.add('active');
      loginContent.classList.remove('active');
      dashboardContent.classList.remove('active');
      authSubtitle.textContent = "가입하시는 회원 유형을 선택하고 맞춤 서비스를 이용하세요.";
    } else if (tabName === 'dashboard') {
      tabLogin.classList.remove('active');
      tabSignup.classList.remove('active');
      loginContent.classList.remove('active');
      signupContent.classList.remove('active');
      dashboardContent.classList.add('active');
      authSubtitle.textContent = "COMPETE HUB 마이페이지 대시보드입니다.";
    }
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabSignup.addEventListener('click', () => switchTab('signup'));
  document.getElementById('linkToSignup').addEventListener('click', () => switchTab('signup'));
  document.getElementById('linkToLogin').addEventListener('click', () => switchTab('login'));

  // ==========================================================================
  // 2. ROLE SELECTION STEPPER LOGIC (STEP 1 <-> STEP 2)
  // ==========================================================================

  function updateRoleUI(role) {
    selectedRole = role;
    signupRoleInput.value = role;

    // Update Cards Active State
    roleCards.forEach(card => {
      if (card.getAttribute('data-role') === role) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update Role Banner & Label
    if (role === 'organizer') {
      currentRoleTitle.innerHTML = '🏆 주최자 (기업/기관) 회원가입';
      labelName.innerHTML = '담당자 이름 <span class="required">*</span>';
      blockOrganizer.style.display = 'block';
      blockParticipant.style.display = 'none';
      blockAcademy.style.display = 'none';
    } else if (role === 'participant') {
      currentRoleTitle.innerHTML = '🎯 참가자 (학생/개인) 회원가입';
      labelName.innerHTML = '이름 <span class="required">*</span>';
      blockOrganizer.style.display = 'none';
      blockParticipant.style.display = 'block';
      blockAcademy.style.display = 'none';
    } else if (role === 'academy') {
      currentRoleTitle.innerHTML = '🏫 관련 학원 / 광고주 회원가입';
      labelName.innerHTML = '담당자 이름 <span class="required">*</span>';
      blockOrganizer.style.display = 'none';
      blockParticipant.style.display = 'none';
      blockAcademy.style.display = 'block';
    }
  }

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const role = card.getAttribute('data-role');
      updateRoleUI(role);
      // Smooth scroll/switch to step 2
      roleSelectionStep.style.display = 'none';
      signupFormStep.style.display = 'block';
      window.scrollTo({ top: signupContent.offsetTop - 40, behavior: 'smooth' });
    });
  });

  btnChangeRole.addEventListener('click', () => {
    roleSelectionStep.style.display = 'block';
    signupFormStep.style.display = 'none';
  });

  // Default: start at step 1 for signup, but show initial UI state
  updateRoleUI('participant');
  signupFormStep.style.display = 'none';

  // ==========================================================================
  // 3. INTEREST CHIPS TOGGLE
  // ==========================================================================
  const interestChips = document.querySelectorAll('.chip-item');
  interestChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const checkbox = chip.querySelector('input[type="checkbox"]');
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  });

  // ==========================================================================
  // 4. PASSWORD STRENGTH METER & TOGGLE
  // ==========================================================================

  function togglePasswordVisibility(inputEl, btnEl) {
    const type = inputEl.getAttribute('type') === 'password' ? 'text' : 'password';
    inputEl.setAttribute('type', type);
    const icon = btnEl.querySelector('i');
    if (type === 'text') {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }

  document.getElementById('toggleLoginPassword')?.addEventListener('click', function() {
    togglePasswordVisibility(loginPassword, this);
  });
  document.getElementById('togglePassword')?.addEventListener('click', function() {
    togglePasswordVisibility(passwordInput, this);
  });
  document.getElementById('togglePasswordConfirm')?.addEventListener('click', function() {
    togglePasswordVisibility(passwordConfirmInput, this);
  });

  passwordInput?.addEventListener('input', () => {
    const val = passwordInput.value;
    const ruleLength = document.getElementById('ruleLength');
    const ruleLetter = document.getElementById('ruleLetter');
    const ruleNumber = document.getElementById('ruleNumber');
    const ruleSpecial = document.getElementById('ruleSpecial');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    const hasLength = val.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    ruleLength.classList.toggle('valid', hasLength);
    ruleLetter.classList.toggle('valid', hasLetter);
    ruleNumber.classList.toggle('valid', hasNumber);
    ruleSpecial.classList.toggle('valid', hasSpecial);

    let score = 0;
    if (hasLength) score++;
    if (hasLetter) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (val.length === 0) {
      strengthFill.style.width = '0%';
      strengthText.textContent = '입력 대기';
    } else if (score <= 2) {
      strengthFill.style.width = '33%';
      strengthFill.style.backgroundColor = '#F43F5E';
      strengthText.textContent = '취약';
    } else if (score === 3) {
      strengthFill.style.width = '66%';
      strengthFill.style.backgroundColor = '#F59E0B';
      strengthText.textContent = '보통';
    } else {
      strengthFill.style.width = '100%';
      strengthFill.style.backgroundColor = '#10B981';
      strengthText.textContent = '안전 (강력함)';
    }
  });

  passwordConfirmInput?.addEventListener('input', () => {
    const feedback = document.getElementById('passwordConfirmFeedback');
    if (passwordConfirmInput.value && passwordConfirmInput.value !== passwordInput.value) {
      feedback.textContent = '비밀번호가 일치하지 않습니다.';
      feedback.className = 'feedback-msg error';
    } else if (passwordConfirmInput.value) {
      feedback.textContent = '비밀번호가 일치합니다.';
      feedback.className = 'feedback-msg success';
    } else {
      feedback.textContent = '';
    }
  });

  // Phone Format Auto Hyphen
  phoneInput?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 3 && val.length <= 7) {
      val = val.substring(0, 3) + '-' + val.substring(3);
    } else if (val.length > 7) {
      val = val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11);
    }
    e.target.value = val;
  });

  // Check Email Duplication API
  const btnCheckEmail = document.getElementById('btnCheckEmail');
  btnCheckEmail?.addEventListener('click', async () => {
    const emailVal = emailInput.value.trim();
    const feedback = document.getElementById('emailFeedback');

    if (!emailVal) {
      feedback.textContent = '이메일 주소를 입력해 주세요.';
      feedback.className = 'feedback-msg error';
      return;
    }

    try {
      btnCheckEmail.disabled = true;
      btnCheckEmail.textContent = '확인중...';
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal })
      });
      const data = await response.json();

      if (data.available) {
        isEmailVerified = true;
        feedback.textContent = data.message;
        feedback.className = 'feedback-msg success';
        showToast('사용 가능한 이메일입니다.', 'success');
      } else {
        isEmailVerified = false;
        feedback.textContent = data.message;
        feedback.className = 'feedback-msg error';
        showToast(data.message, 'error');
      }
    } catch (err) {
      feedback.textContent = '서버와의 통신 오류가 발생했습니다.';
      feedback.className = 'feedback-msg error';
    } finally {
      btnCheckEmail.disabled = false;
      btnCheckEmail.textContent = '중복 확인';
    }
  });

  emailInput?.addEventListener('input', () => {
    isEmailVerified = false;
    document.getElementById('emailFeedback').textContent = '';
  });

  // Daum Postcode Search API Integration
  const btnSearchAddress = document.getElementById('btnSearchAddress');
  btnSearchAddress?.addEventListener('click', () => {
    if (typeof daum === 'undefined' || !daum.Postcode) {
      showToast('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.', 'info');
      return;
    }
    new daum.Postcode({
      oncomplete: function(data) {
        let addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        document.getElementById('zipcode').value = data.zonecode;
        document.getElementById('address').value = addr;
        document.getElementById('detailAddress').focus();
      }
    }).open();
  });

  // Terms All Check
  const agreeAll = document.getElementById('agreeAll');
  const termItems = document.querySelectorAll('.term-item');

  agreeAll?.addEventListener('change', () => {
    termItems.forEach(item => item.checked = agreeAll.checked);
  });

  termItems.forEach(item => {
    item.addEventListener('change', () => {
      agreeAll.checked = Array.from(termItems).every(i => i.checked);
    });
  });

  // ==========================================================================
  // 5. QUICK DEMO LOGIN BUTTONS (Role Presets)
  // ==========================================================================

  const btnDemoOrganizer = document.getElementById('btnDemoOrganizer');
  const btnDemoParticipant = document.getElementById('btnDemoParticipant');
  const btnDemoAcademy = document.getElementById('btnDemoAcademy');
  const btnDemoAdmin = document.getElementById('btnDemoAdmin');

  async function executeDemoLogin(email, password) {
    loginEmail.value = email;
    loginPassword.value = password;
    loginForm.dispatchEvent(new Event('submit', { cancelable: true }));
  }

  btnDemoOrganizer?.addEventListener('click', () => executeDemoLogin('organizer@competehub.com', 'organizer123!'));
  btnDemoParticipant?.addEventListener('click', () => executeDemoLogin('participant@competehub.com', 'participant123!'));
  btnDemoAcademy?.addEventListener('click', () => executeDemoLogin('academy@competehub.com', 'academy123!'));
  btnDemoAdmin?.addEventListener('click', () => executeDemoLogin('admin@competehub.com', 'admin123!'));

  // ==========================================================================
  // 6. LOGIN FORM SUBMISSION
  // ==========================================================================

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    const loginSpinner = document.getElementById('loginSpinner');
    const loginSubmitBtn = document.getElementById('btnLoginSubmit');

    if (!email || !password) {
      showToast('이메일과 비밀번호를 입력해 주세요.', 'error');
      return;
    }

    try {
      loginSubmitBtn.disabled = true;
      loginSpinner.style.display = 'inline-block';

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        currentUser = data.user;
        showToast(data.message, 'success');
        renderDashboard(data.user);
        switchTab('dashboard');
      } else {
        showToast(data.message || '로그인에 실패했습니다.', 'error');
      }
    } catch (err) {
      showToast('로그인 요청 중 오류가 발생했습니다.', 'error');
    } finally {
      loginSubmitBtn.disabled = false;
      loginSpinner.style.display = 'none';
    }
  });

  // ==========================================================================
  // 7. SIGNUP FORM SUBMISSION
  // ==========================================================================

  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = signupRoleInput.value;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validation Check
    if (!email) { showToast('이메일 주소를 입력해 주세요.', 'error'); return; }
    if (!password) { showToast('비밀번호를 입력해 주세요.', 'error'); return; }
    if (password.length < 8) { showToast('비밀번호는 8자 이상이어야 합니다.', 'error'); return; }
    if (password !== passwordConfirm) { showToast('비밀번호가 일치하지 않습니다.', 'error'); return; }
    if (!name) { showToast('이름(또는 담당자명)을 입력해 주세요.', 'error'); return; }
    if (!phone) { showToast('휴대폰 번호를 입력해 주세요.', 'error'); return; }

    // Role Specific Validation
    let orgName = '', orgType = '', bizRegNum = '', website = '';
    let affiliation = '', interests = [];
    let academyName = '', academyCategory = '';

    if (role === 'organizer') {
      orgName = document.getElementById('orgName').value.trim();
      orgType = document.getElementById('orgType').value;
      bizRegNum = document.getElementById('bizRegNum').value.trim();
      website = document.getElementById('website').value.trim();
      if (!orgName) {
        showToast('주최 기관/기업명을 입력해 주세요.', 'error');
        return;
      }
    } else if (role === 'participant') {
      affiliation = document.getElementById('affiliation').value;
      const checkedChips = document.querySelectorAll('input[name="interests"]:checked');
      checkedChips.forEach(cb => interests.push(cb.value));
    } else if (role === 'academy') {
      academyName = document.getElementById('academyName').value.trim();
      academyCategory = document.getElementById('academyCategory').value;
      bizRegNum = document.getElementById('academyBizNum').value.trim();
      if (!academyName) {
        showToast('학원/업체명을 입력해 주세요.', 'error');
        return;
      }
      if (!bizRegNum) {
        showToast('사업자 등록번호를 입력해 주세요.', 'error');
        return;
      }
    }

    // Terms validation
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const agreePrivacy = document.getElementById('agreePrivacy').checked;
    const agreeMarketing = document.getElementById('agreeMarketing').checked;

    if (!agreeTerms || !agreePrivacy) {
      showToast('필수 약관에 동의해 주세요.', 'error');
      return;
    }

    const btnSubmit = document.getElementById('btnSubmit');
    const btnSpinner = document.getElementById('btnSpinner');

    try {
      btnSubmit.disabled = true;
      btnSpinner.style.display = 'inline-block';

      const payload = {
        role,
        email,
        password,
        name,
        phone,
        zipcode: document.getElementById('zipcode')?.value || '',
        address: document.getElementById('address')?.value || '',
        detailAddress: document.getElementById('detailAddress')?.value || '',
        agreements: { terms: agreeTerms, privacy: agreePrivacy, marketing: agreeMarketing },

        // Role fields
        orgName,
        orgType,
        bizRegNum,
        website,
        affiliation,
        interests,
        academyName,
        academyCategory
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        currentUser = data.user;
        document.getElementById('modalUserName').textContent = currentUser.name;
        document.getElementById('modalUserRoleDesc').textContent = `${currentUser.roleLabel} 서비스 이용이 준비되었습니다.`;
        openModal(successModal);
      } else {
        showToast(data.message || '회원가입에 실패했습니다.', 'error');
      }
    } catch (err) {
      showToast('회원가입 처리 중 서버 오류가 발생했습니다.', 'error');
    } finally {
      btnSubmit.disabled = false;
      btnSpinner.style.display = 'none';
    }
  });

  document.getElementById('btnGoLogin')?.addEventListener('click', () => {
    closeModal(successModal);
    if (currentUser) {
      renderDashboard(currentUser);
      switchTab('dashboard');
    } else {
      switchTab('login');
    }
  });

  // ==========================================================================
  // 8. RENDER DASHBOARD BASED ON LOGGED-IN ROLE
  // ==========================================================================

  function renderDashboard(user) {
    document.getElementById('dashUserName').textContent = `${user.name} 님`;
    document.getElementById('dashUserRole').textContent = user.roleLabel || 'COMPETE HUB 회원';
    document.getElementById('dashUserEmail').textContent = user.email;
    document.getElementById('dashUserPhone').textContent = user.phone;
    document.getElementById('dashUserDate').textContent = new Date(user.createdAt || Date.now()).toLocaleDateString('ko-KR');

    const rolePanel = document.getElementById('roleOverviewPanel');
    const dashExtra = document.getElementById('dashUserExtra');
    const dashActionText = document.getElementById('dashActionText');
    const avatar = document.getElementById('dashAvatar');

    // Role Customization
    if (user.role === 'organizer') {
      avatar.innerHTML = '<i class="fa-solid fa-building-columns"></i>';
      dashActionText.textContent = "새 대회·공모전 공고 등록하기";
      dashExtra.innerHTML = `<strong>주최 기관:</strong> ${user.orgName} | <strong>사업자번호:</strong> ${user.bizRegNum || '등록됨'}`;

      rolePanel.innerHTML = `
        <div class="metric-card">
          <div class="metric-value">3 건</div>
          <div class="metric-label">내 등록 대회</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">2 건</div>
          <div class="metric-label">진행중 공고</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">128 명</div>
          <div class="metric-label">누적 접수자</div>
        </div>
      `;
    } else if (user.role === 'participant') {
      avatar.innerHTML = '<i class="fa-solid fa-user-graduate"></i>';
      dashActionText.textContent = "추천 대회 공고 탐색하기";
      const interestStr = user.interests && user.interests.length ? user.interests.join(', ') : '전체 분야';
      dashExtra.innerHTML = `<strong>관심 분야:</strong> ${interestStr} | <strong>소속:</strong> 대학생`;

      rolePanel.innerHTML = `
        <div class="metric-card">
          <div class="metric-value">2 건</div>
          <div class="metric-label">지원 완료 대회</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">7 건</div>
          <div class="metric-label">스크랩 공고</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">1 건</div>
          <div class="metric-label">참여중인 팀</div>
        </div>
      `;
    } else if (user.role === 'academy') {
      avatar.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i>';
      dashActionText.textContent = "학원 특강 / 광고 등록하기";
      dashExtra.innerHTML = `<strong>학원명:</strong> ${user.academyName} | <strong>교육 분야:</strong> ${user.academyCategory || 'SW/코딩'}<br><strong>주소:</strong> ${user.address}`;

      rolePanel.innerHTML = `
        <div class="metric-card">
          <div class="metric-value">4 개</div>
          <div class="metric-label">등록 강좌</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">2 개</div>
          <div class="metric-label">게재중 광고</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">45 건</div>
          <div class="metric-label">수강 문의</div>
        </div>
      `;
    } else if (user.role === 'admin') {
      avatar.innerHTML = '<i class="fa-solid fa-user-shield"></i>';
      dashActionText.textContent = "플랫폼 통합 관리자 콘솔";
      dashExtra.innerHTML = `<strong>관리 권한:</strong> Super Administrator`;

      rolePanel.innerHTML = `
        <div class="metric-card">
          <div class="metric-value">1,420 명</div>
          <div class="metric-label">전체 회원</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">5 건</div>
          <div class="metric-label">승인 대기 공고</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">3,890 회</div>
          <div class="metric-label">오늘 방원 수</div>
        </div>
      `;
    }
  }

  document.getElementById('btnLogout')?.addEventListener('click', () => {
    currentUser = null;
    showToast('로그아웃 되었습니다.', 'info');
    switchTab('login');
  });

  document.getElementById('btnExploreContests')?.addEventListener('click', () => {
    showToast('대회 탐색 및 관리 서비스로 이동합니다.', 'success');
  });

  // ==========================================================================
  // 9. PASSWORD RECOVERY & MODALS HANDLERS
  // ==========================================================================

  const btnOpenFindPassword = document.getElementById('btnOpenFindPassword');
  const btnCloseFindPassword = document.getElementById('btnCloseFindPassword');
  const findPasswordForm = document.getElementById('findPasswordForm');

  btnOpenFindPassword?.addEventListener('click', () => openModal(findPasswordModal));
  btnCloseFindPassword?.addEventListener('click', () => closeModal(findPasswordModal));

  findPasswordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('findPasswordEmail').value.trim();
    if (!email) return;

    try {
      const response = await fetch('/api/find-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      showToast(data.message, data.success ? 'success' : 'error');
      if (data.success) closeModal(findPasswordModal);
    } catch (err) {
      showToast('오류가 발생했습니다.', 'error');
    }
  });

  // Terms Modal Details
  const btnCloseInfoModal = document.getElementById('btnCloseInfoModal');
  const btnConfirmInfoModal = document.getElementById('btnConfirmInfoModal');
  const infoModalTitle = document.getElementById('infoModalTitle');
  const infoModalContent = document.getElementById('infoModalContent');

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-modal');
      if (target === 'modalTerms') {
        infoModalTitle.textContent = 'COMPETE HUB 서비스 이용약관';
        infoModalContent.innerHTML = '<p>제1조 (목적) 본 약관은 COMPETE HUB 플랫폼이 제공하는 대회 공고 등록, 참가 신청, 학원 홍보 관련 서비스의 이용에 관한 제반 사항을 규정함을 목적으로 합니다.</p><p style="margin-top:10px;">제2조 (회원의 구분) 회원은 주최자 회원, 참가자 회원, 학원/광고주 회원으로 구분되며, 각 역할별 부여된 권한에 따라 플랫폼을 이용합니다.</p>';
      } else if (target === 'modalPrivacy') {
        infoModalTitle.textContent = '개인정보 수집 및 이용 동의';
        infoModalContent.innerHTML = '<p>1. 수집 항목: 이메일, 비밀번호, 이름, 휴대폰 번호, 소속/기관 정보, 관심 대회 분야 등</p><p style="margin-top:10px;">2. 수집 목적: 본인 확인, 대회 참가 접수 및 심사, 관련 정보 및 마케팅 제공</p>';
      }
      openModal(infoModal);
    });
  });

  btnCloseInfoModal?.addEventListener('click', () => closeModal(infoModal));
  btnConfirmInfoModal?.addEventListener('click', () => closeModal(infoModal));

  function openModal(modal) {
    modal.classList.add('active');
  }

  function closeModal(modal) {
    modal.classList.remove('active');
  }

  // Toast System Helper
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
