/**
 * LUXE BOUTIQUE - Interactive Auth Portal Application Script
 * Full Login, Signup, Password Reset, Profile Dashboard & Toast Notification System
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. DOM Elements
  // ==========================================================================
  // Toast & Navigation
  const toastContainer = document.getElementById('toastContainer');
  const authSubtitle = document.getElementById('authSubtitle');
  const authTabsNav = document.getElementById('authTabsNav');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginContent = document.getElementById('loginContent');
  const signupContent = document.getElementById('signupContent');
  const dashboardContent = document.getElementById('dashboardContent');

  // Quick Demo Login
  const btnDemoUser = document.getElementById('btnDemoUser');
  const btnDemoAdmin = document.getElementById('btnDemoAdmin');

  // Login Form Elements
  const loginForm = document.getElementById('loginForm');
  const loginEmailInput = document.getElementById('loginEmail');
  const loginPasswordInput = document.getElementById('loginPassword');
  const toggleLoginPasswordBtn = document.getElementById('toggleLoginPassword');
  const loginEmailFeedback = document.getElementById('loginEmailFeedback');
  const loginPasswordFeedback = document.getElementById('loginPasswordFeedback');
  const btnLoginSubmit = document.getElementById('btnLoginSubmit');
  const loginSpinner = document.getElementById('loginSpinner');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const linkToSignup = document.getElementById('linkToSignup');
  const linkToLogin = document.getElementById('linkToLogin');

  // Signup Form Elements
  const signupForm = document.getElementById('signupForm');
  const emailInput = document.getElementById('email');
  const btnCheckEmail = document.getElementById('btnCheckEmail');
  const emailFeedback = document.getElementById('emailFeedback');

  const passwordInput = document.getElementById('password');
  const passwordConfirmInput = document.getElementById('passwordConfirm');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const togglePasswordConfirmBtn = document.getElementById('togglePasswordConfirm');
  const passwordFeedback = document.getElementById('passwordFeedback');
  const passwordConfirmFeedback = document.getElementById('passwordConfirmFeedback');

  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  const ruleLength = document.getElementById('ruleLength');
  const ruleLetter = document.getElementById('ruleLetter');
  const ruleNumber = document.getElementById('ruleNumber');
  const ruleSpecial = document.getElementById('ruleSpecial');

  const nameInput = document.getElementById('name');
  const nameFeedback = document.getElementById('nameFeedback');
  const phoneInput = document.getElementById('phone');
  const phoneFeedback = document.getElementById('phoneFeedback');

  const btnSearchAddress = document.getElementById('btnSearchAddress');
  const zipcodeInput = document.getElementById('zipcode');
  const addressInput = document.getElementById('address');
  const detailAddressInput = document.getElementById('detailAddress');

  const agreeAll = document.getElementById('agreeAll');
  const termItems = document.querySelectorAll('.term-item');
  const agreeTerms = document.getElementById('agreeTerms');
  const agreePrivacy = document.getElementById('agreePrivacy');
  const termsFeedback = document.getElementById('termsFeedback');

  const btnSubmit = document.getElementById('btnSubmit');
  const btnSpinner = document.getElementById('btnSpinner');

  // Dashboard Elements
  const dashAvatar = document.getElementById('dashAvatar');
  const dashUserName = document.getElementById('dashUserName');
  const dashUserRole = document.getElementById('dashUserRole');
  const dashUserEmail = document.getElementById('dashUserEmail');
  const dashUserPhone = document.getElementById('dashUserPhone');
  const dashUserAddress = document.getElementById('dashUserAddress');
  const dashUserDate = document.getElementById('dashUserDate');
  const btnLogout = document.getElementById('btnLogout');
  const btnExploreShop = document.getElementById('btnExploreShop');

  // Modals
  const successModal = document.getElementById('successModal');
  const modalUserName = document.getElementById('modalUserName');
  const btnGoLogin = document.getElementById('btnGoLogin');

  const findPasswordModal = document.getElementById('findPasswordModal');
  const btnOpenFindPassword = document.getElementById('btnOpenFindPassword');
  const btnCloseFindPassword = document.getElementById('btnCloseFindPassword');
  const findPasswordForm = document.getElementById('findPasswordForm');
  const findPasswordEmail = document.getElementById('findPasswordEmail');

  const infoModal = document.getElementById('infoModal');
  const infoModalTitle = document.getElementById('infoModalTitle');
  const infoModalContent = document.getElementById('infoModalContent');
  const btnCloseInfoModal = document.getElementById('btnCloseInfoModal');
  const btnConfirmInfoModal = document.getElementById('btnConfirmInfoModal');

  // State Variables
  let isEmailVerified = false;
  let currentUser = null;

  // ==========================================================================
  // 2. Helper Utilities & Toast Notification
  // ==========================================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function setFeedback(element, message, isValid) {
    if (!element) return;
    element.textContent = message;
    if (isValid === true) {
      element.className = 'feedback-msg valid';
    } else if (isValid === false) {
      element.className = 'feedback-msg invalid';
    } else {
      element.className = 'feedback-msg';
    }
  }

  // Password Visibility Toggle
  function setupPasswordToggle(button, input) {
    if (!button || !input) return;
    button.addEventListener('click', () => {
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      const icon = button.querySelector('i');
      if (type === 'text') {
        icon.className = 'fa-regular fa-eye-slash';
      } else {
        icon.className = 'fa-regular fa-eye';
      }
    });
  }

  setupPasswordToggle(toggleLoginPasswordBtn, loginPasswordInput);
  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(togglePasswordConfirmBtn, passwordConfirmInput);

  // ==========================================================================
  // 3. Tab Switching Logic
  // ==========================================================================
  function switchTab(tabName) {
    if (tabName === 'login') {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      loginContent.classList.add('active');
      signupContent.classList.remove('active');
      dashboardContent.classList.remove('active');
      authTabsNav.style.display = 'flex';
      authSubtitle.textContent = 'LUXE 하우스의 독점 서비스와 맞춤형 혜택을 이용해보세요.';
    } else if (tabName === 'signup') {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      signupContent.classList.add('active');
      loginContent.classList.remove('active');
      dashboardContent.classList.remove('active');
      authTabsNav.style.display = 'flex';
      authSubtitle.textContent = 'LUXE 하우스의 프라이빗 멤버십에 가입하고 혜택을 누리세요.';
    } else if (tabName === 'dashboard') {
      authTabsNav.style.display = 'none';
      loginContent.classList.remove('active');
      signupContent.classList.remove('active');
      dashboardContent.classList.add('active');
      authSubtitle.textContent = '인증된 계정 정보 및 회원 전용 마이페이지입니다.';
    }
  }

  tabLogin.addEventListener('click', () => switchTab('login'));
  tabSignup.addEventListener('click', () => switchTab('signup'));
  if (linkToSignup) linkToSignup.addEventListener('click', () => switchTab('signup'));
  if (linkToLogin) linkToLogin.addEventListener('click', () => switchTab('login'));

  // ==========================================================================
  // 4. Quick Demo Login Presets
  // ==========================================================================
  if (btnDemoUser) {
    btnDemoUser.addEventListener('click', () => {
      loginEmailInput.value = 'user@example.com';
      loginPasswordInput.value = 'user123!';
      showToast('일반 회원 계정 정보가 입력되었습니다.', 'info');
      handleLogin();
    });
  }

  if (btnDemoAdmin) {
    btnDemoAdmin.addEventListener('click', () => {
      loginEmailInput.value = 'admin@luxe.com';
      loginPasswordInput.value = 'admin123!';
      showToast('관리자 계정 정보가 입력되었습니다.', 'info');
      handleLogin();
    });
  }

  // ==========================================================================
  // 5. User Authentication & Login Form
  // ==========================================================================
  async function handleLogin() {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    let valid = true;
    if (!email) {
      setFeedback(loginEmailFeedback, '이메일 주소를 입력해 주세요.', false);
      valid = false;
    } else {
      setFeedback(loginEmailFeedback, '', null);
    }

    if (!password) {
      setFeedback(loginPasswordFeedback, '비밀번호를 입력해 주세요.', false);
      valid = false;
    } else {
      setFeedback(loginPasswordFeedback, '', null);
    }

    if (!valid) return;

    // Show spinner
    btnLoginSubmit.disabled = true;
    loginSpinner.style.display = 'inline-block';
    const btnText = btnLoginSubmit.querySelector('.btn-text');
    if (btnText) btnText.textContent = '인증 진행 중...';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        currentUser = data.user;
        const storage = rememberMeCheckbox.checked ? localStorage : sessionStorage;
        storage.setItem('luxe_user', JSON.stringify(currentUser));
        storage.setItem('luxe_token', data.token);

        showToast(data.message || '로그인 되었습니다!', 'success');
        updateDashboardView(currentUser);
        switchTab('dashboard');
      } else {
        showToast(data.message || '로그인 실패', 'error');
        setFeedback(loginPasswordFeedback, data.message, false);
      }
    } catch (err) {
      console.error('Login Error:', err);
      showToast('서버와의 통신 오류가 발생했습니다.', 'error');
    } finally {
      btnLoginSubmit.disabled = false;
      loginSpinner.style.display = 'none';
      if (btnText) btnText.textContent = '로그인';
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
  });

  // ==========================================================================
  // 6. User Profile Dashboard & Logout
  // ==========================================================================
  function updateDashboardView(user) {
    if (!user) return;
    dashUserName.textContent = `${user.name} 님`;
    dashUserRole.textContent = user.role || 'VIP Member';
    dashUserEmail.textContent = user.email || '-';
    dashUserPhone.textContent = user.phone || '-';
    dashUserAddress.textContent = user.address || '미등록 주소';
    
    if (user.createdAt) {
      const dateObj = new Date(user.createdAt);
      dashUserDate.textContent = dateObj.toLocaleDateString('ko-KR');
    } else {
      dashUserDate.textContent = new Date().toLocaleDateString('ko-KR');
    }
  }

  // Check saved session on load
  const savedUser = localStorage.getItem('luxe_user') || sessionStorage.getItem('luxe_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateDashboardView(currentUser);
      switchTab('dashboard');
      showToast(`${currentUser.name}님으로 자동으로 로그인되었습니다.`, 'success');
    } catch (e) {
      localStorage.removeItem('luxe_user');
      sessionStorage.removeItem('luxe_user');
    }
  }

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('luxe_user');
    localStorage.removeItem('luxe_token');
    sessionStorage.removeItem('luxe_user');
    sessionStorage.removeItem('luxe_token');
    currentUser = null;
    showToast('로그아웃 되었습니다.', 'info');
    switchTab('login');
  });

  btnExploreShop.addEventListener('click', () => {
    showToast('LUXE 메인 쇼핑몰 컬렉션으로 이동 중입니다!', 'success');
  });

  // ==========================================================================
  // 7. Password Recovery Modal Handling
  // ==========================================================================
  btnOpenFindPassword.addEventListener('click', () => {
    findPasswordModal.classList.add('active');
  });

  btnCloseFindPassword.addEventListener('click', () => {
    findPasswordModal.classList.remove('active');
  });

  findPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = findPasswordEmail.value.trim();
    if (!email) {
      showToast('이메일 주소를 입력해 주세요.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/find-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        showToast(data.message, 'success');
        findPasswordModal.classList.remove('active');
        findPasswordEmail.value = '';
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('비밀번호 재설정 요청 실패', 'error');
    }
  });

  // ==========================================================================
  // 8. Sign-Up Form Real-Time Validation
  // ==========================================================================
  const validateEmailFormat = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  emailInput.addEventListener('input', () => {
    isEmailVerified = false;
    const val = emailInput.value.trim();
    if (!val) {
      setFeedback(emailFeedback, '', null);
    } else if (!validateEmailFormat(val)) {
      setFeedback(emailFeedback, '유효한 이메일 형식이 아닙니다 (예: name@luxe.com).', false);
    } else {
      setFeedback(emailFeedback, '이메일 중복 확인 버튼을 눌러주세요.', null);
    }
  });

  btnCheckEmail.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email || !validateEmailFormat(email)) {
      setFeedback(emailFeedback, '올바른 이메일 주소를 입력한 후 시도해 주세요.', false);
      return;
    }

    btnCheckEmail.disabled = true;
    try {
      const res = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (data.available) {
        isEmailVerified = true;
        setFeedback(emailFeedback, '✓ 사용 가능한 이메일입니다.', true);
        showToast('사용 가능한 이메일입니다.', 'success');
      } else {
        isEmailVerified = false;
        setFeedback(emailFeedback, data.message || '이미 가입된 이메일입니다.', false);
        showToast(data.message || '이미 가입된 이메일입니다.', 'error');
      }
    } catch (err) {
      setFeedback(emailFeedback, '서버 검증 오류가 발생했습니다.', false);
    } finally {
      btnCheckEmail.disabled = false;
    }
  });

  // Password Rules & Gauge
  function updateRuleState(ruleElement, isPassed) {
    if (isPassed) {
      ruleElement.classList.add('passed');
      ruleElement.querySelector('i').className = 'fa-solid fa-circle-check';
    } else {
      ruleElement.classList.remove('passed');
      ruleElement.querySelector('i').className = 'fa-solid fa-circle-check';
    }
  }

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const hasMinLength = val.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val);

    updateRuleState(ruleLength, hasMinLength);
    updateRuleState(ruleLetter, hasLetter);
    updateRuleState(ruleNumber, hasNumber);
    updateRuleState(ruleSpecial, hasSpecial);

    let score = 0;
    if (val.length > 0) {
      if (hasMinLength) score += 25;
      if (hasLetter) score += 25;
      if (hasNumber) score += 25;
      if (hasSpecial) score += 25;
    }

    strengthFill.style.width = score + '%';
    if (score === 0) {
      strengthFill.style.backgroundColor = 'transparent';
      strengthText.textContent = '입력 대기';
      strengthText.style.color = 'var(--color-text-dim)';
    } else if (score <= 50) {
      strengthFill.style.backgroundColor = 'var(--color-error)';
      strengthText.textContent = '취약';
      strengthText.style.color = 'var(--color-error)';
    } else if (score < 100) {
      strengthFill.style.backgroundColor = 'var(--color-warning)';
      strengthText.textContent = '보통';
      strengthText.style.color = 'var(--color-warning)';
    } else {
      strengthFill.style.backgroundColor = 'var(--color-success)';
      strengthText.textContent = '매우 안전';
      strengthText.style.color = 'var(--color-success)';
    }

    checkPasswordConfirmMatch();
  });

  function checkPasswordConfirmMatch() {
    const pwd = passwordInput.value;
    const pwdConfirm = passwordConfirmInput.value;

    if (!pwdConfirm) {
      setFeedback(passwordConfirmFeedback, '', null);
      return false;
    }

    if (pwd === pwdConfirm) {
      setFeedback(passwordConfirmFeedback, '✓ 비밀번호가 일치합니다.', true);
      return true;
    } else {
      setFeedback(passwordConfirmFeedback, '비밀번호가 일치하지 않습니다.', false);
      return false;
    }
  }

  passwordConfirmInput.addEventListener('input', checkPasswordConfirmMatch);

  // Auto-format Phone Number (010-XXXX-XXXX)
  phoneInput.addEventListener('input', (e) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11);
    
    let formatted = raw;
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
    }
    e.target.value = formatted;

    if (raw.length === 10 || raw.length === 11) {
      setFeedback(phoneFeedback, '✓ 올바른 전화번호 형식입니다.', true);
    } else if (raw.length > 0) {
      setFeedback(phoneFeedback, '전화번호를 올바르게 입력해 주세요.', false);
    } else {
      setFeedback(phoneFeedback, '', null);
    }
  });

  // Name Input
  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim();
    if (val.length >= 2) {
      setFeedback(nameFeedback, '✓ 확인되었습니다.', true);
    } else if (val.length === 1) {
      setFeedback(nameFeedback, '이름은 2자 이상 입력해 주세요.', false);
    } else {
      setFeedback(nameFeedback, '', null);
    }
  });

  // Daum Address Lookup Integration
  if (btnSearchAddress) {
    btnSearchAddress.addEventListener('click', () => {
      if (typeof daum !== 'undefined' && daum.Postcode) {
        new daum.Postcode({
          oncomplete: function(data) {
            let addr = '';
            if (data.userSelectedType === 'R') {
              addr = data.roadAddress;
            } else {
              addr = data.jibunAddress;
            }
            zipcodeInput.value = data.zonecode;
            addressInput.value = addr;
            detailAddressInput.focus();
            showToast('주소가 입력되었습니다.', 'success');
          }
        }).open();
      } else {
        // Fallback demo address populator if SDK blocked/offline
        zipcodeInput.value = "06164";
        addressInput.value = "서울 강남구 테헤란로 123 LUXE 타워";
        detailAddressInput.focus();
        showToast('우편번호 06164 주소가 테스트 입력되었습니다.', 'info');
      }
    });
  }

  // Terms Checklist Handling
  agreeAll.addEventListener('change', () => {
    const isChecked = agreeAll.checked;
    termItems.forEach(item => item.checked = isChecked);
    if (isChecked) {
      setFeedback(termsFeedback, '✓ 모든 약관에 동의하셨습니다.', true);
    } else {
      setFeedback(termsFeedback, '', null);
    }
  });

  termItems.forEach(item => {
    item.addEventListener('change', () => {
      const allChecked = Array.from(termItems).every(i => i.checked);
      agreeAll.checked = allChecked;
      
      const requiredChecked = agreeTerms.checked && agreePrivacy.checked;
      if (requiredChecked) {
        setFeedback(termsFeedback, '✓ 필수 약관에 동의하셨습니다.', true);
      } else {
        setFeedback(termsFeedback, '필수 약관에 동의해 주세요.', false);
      }
    });
  });

  // Terms Detail Modal Viewers
  const termsTextMap = {
    modalTerms: {
      title: "LUXE 하우스 이용약관",
      content: `
        <h4>제 1 조 (목적)</h4>
        <p>본 약관은 LUXE 하우스가 제공하는 온라인 쇼핑몰 및 회원 서비스의 이용조건 및 절차, 회원과 당사의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        <h4 style="margin-top:12px;">제 2 조 (회원가입 및 계정)</h4>
        <p>1. 이용자는 당사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
        <p>2. 회원가입의 성립 시기는 당사의 승낙이 회원에게 도달한 시점으로 합니다.</p>
      `
    },
    modalPrivacy: {
      title: "개인정보 수집 및 이용 동의",
      content: `
        <h4>1. 수집하는 개인정보 항목</h4>
        <p>- 필수항목: 이메일, 비밀번호, 이름, 휴대폰 번호</p>
        <p>- 선택항목: 주소, 생년월일, 성별, 마케팅 수신동의 여부</p>
        <h4 style="margin-top:12px;">2. 개인정보의 수집 및 이용목적</h4>
        <p>- 서비스 제공, 본인 인증, 고객 상담 및 주문 배송</p>
        <p>- 신규 서비스 개발 및 맞춤형 혜택 제공</p>
      `
    }
  };

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-modal');
      const data = termsTextMap[key];
      if (data) {
        infoModalTitle.textContent = data.title;
        infoModalContent.innerHTML = data.content;
        infoModal.classList.add('active');
      }
    });
  });

  btnCloseInfoModal.addEventListener('click', () => infoModal.classList.remove('active'));
  btnConfirmInfoModal.addEventListener('click', () => infoModal.classList.remove('active'));

  // ==========================================================================
  // 9. Sign-Up Submission Logic
  // ==========================================================================
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Email Check
    const emailVal = emailInput.value.trim();
    if (!emailVal || !validateEmailFormat(emailVal)) {
      setFeedback(emailFeedback, '올바른 이메일을 입력해 주세요.', false);
      isFormValid = false;
    } else if (!isEmailVerified) {
      setFeedback(emailFeedback, '이메일 중복 확인을 진행해 주세요.', false);
      isFormValid = false;
    }

    // Password Check
    const pwdVal = passwordInput.value;
    const hasMinLength = pwdVal.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(pwdVal);
    const hasNumber = /[0-9]/.test(pwdVal);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwdVal);

    if (!(hasMinLength && hasLetter && hasNumber && hasSpecial)) {
      setFeedback(passwordFeedback, '비밀번호 규칙을 모두 충족해야 합니다.', false);
      isFormValid = false;
    }

    if (!checkPasswordConfirmMatch()) {
      isFormValid = false;
    }

    // Name Check
    if (nameInput.value.trim().length < 2) {
      setFeedback(nameFeedback, '이름을 2자 이상 입력해 주세요.', false);
      isFormValid = false;
    }

    // Phone Check
    const rawPhone = phoneInput.value.replace(/[^0-9]/g, '');
    if (rawPhone.length < 10) {
      setFeedback(phoneFeedback, '올바른 휴대폰 번호를 입력해 주세요.', false);
      isFormValid = false;
    }

    // Required Terms Check
    if (!agreeTerms.checked || !agreePrivacy.checked) {
      setFeedback(termsFeedback, '필수 약관에 동의하셔야 가입이 진행됩니다.', false);
      isFormValid = false;
    }

    if (!isFormValid) {
      showToast('입력 항목 및 필수 약관을 확인해 주세요.', 'error');
      return;
    }

    // Show Loading Spinner
    btnSubmit.disabled = true;
    btnSpinner.style.display = 'inline-block';
    const btnText = btnSubmit.querySelector('.btn-text');
    if (btnText) btnText.textContent = '회원가입 처리 중...';

    const payload = {
      email: emailVal,
      password: pwdVal,
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      zipcode: zipcodeInput.value,
      address: addressInput.value,
      detailAddress: detailAddressInput.value,
      gender: document.querySelector('input[name="gender"]:checked')?.value || 'none',
      birthdate: document.getElementById('birthdate').value,
      agreements: {
        terms: agreeTerms.checked,
        privacy: agreePrivacy.checked,
        marketing: document.getElementById('agreeMarketing').checked
      }
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        modalUserName.textContent = result.user.name;
        currentUser = result.user;
        successModal.classList.add('active');
        showToast('회원가입이 성공적으로 완료되었습니다!', 'success');
      } else {
        showToast(result.message || '가입에 실패했습니다.', 'error');
      }
    } catch (err) {
      console.error('Registration error:', err);
      showToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    } finally {
      btnSubmit.disabled = false;
      btnSpinner.style.display = 'none';
      if (btnText) btnText.textContent = 'LUXE 회원가입 완료';
    }
  });

  // Success Modal -> Auto-login to Dashboard
  btnGoLogin.addEventListener('click', () => {
    successModal.classList.remove('active');
    if (currentUser) {
      localStorage.setItem('luxe_user', JSON.stringify(currentUser));
      updateDashboardView(currentUser);
      switchTab('dashboard');
    } else {
      switchTab('login');
    }
  });

  // Social Login Mock Handlers
  document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.textContent.trim();
      showToast(`${provider} 계정으로 간편 인증을 진행합니다...`, 'info');
      setTimeout(() => {
        const demoUser = {
          name: `${provider} 회원`,
          email: `social_${Date.now()}@${provider.toLowerCase()}.com`,
          phone: "010-8888-9999",
          role: "Social Member",
          address: "소셜 인증 사용자",
          createdAt: new Date().toISOString()
        };
        currentUser = demoUser;
        localStorage.setItem('luxe_user', JSON.stringify(currentUser));
        updateDashboardView(currentUser);
        switchTab('dashboard');
        showToast(`${provider} 연동 로그인에 성공하였습니다!`, 'success');
      }, 1000);
    });
  });
});
