import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User as UserIcon, Globe, CheckCircle2, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

export interface User {
  name: string;
  studentId: string;
  nationality: string;
  email: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (user: User) => void;
}

const STORAGE_USERS_KEY = 'mjc_registered_users';
const DEMO_USER: User & { password: string } = {
  email: 'student@mjc.ac.kr',
  password: 'password123',
  name: '김명지 (Alex)',
  studentId: '20260001',
  nationality: 'South Korea',
};

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // initialMode prop이 변경될 때 내부 mode 동기화
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [nationality, setNationality] = useState('South Korea');

  // Sync mode with initialMode prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setIsSubmitted(false);
      setEmail('');
      setPassword('');
      setName('');
      setStudentId('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Helper to get registered users from localStorage
  const getRegisteredUsers = (): (User & { password: string })[] => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (!stored) {
        return [DEMO_USER];
      }
      const users = JSON.parse(stored);
      // Ensure DEMO_USER is included if empty
      if (!users.some((u: any) => u.email === DEMO_USER.email)) {
        return [DEMO_USER, ...users];
      }
      return users;
    } catch {
      return [DEMO_USER];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const users = getRegisteredUsers();

    if (mode === 'login') {
      const foundUser = users.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (!foundUser) {
        setErrorMessage('가입되지 않은 이메일 주소입니다.');
        return;
      }

      if (foundUser.password !== password) {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
        return;
      }

      const loggedInUser: User = {
        name: foundUser.name,
        studentId: foundUser.studentId,
        nationality: foundUser.nationality,
        email: foundUser.email,
      };

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onLoginSuccess(loggedInUser);
        onClose();
      }, 1200);
    } else {
      // Signup flow
      const existingUser = users.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (existingUser) {
        setErrorMessage('이미가입된 이메일 주소입니다.');
        return;
      }

      const newUser = {
        email: email.trim(),
        password,
        name: name.trim(),
        studentId: studentId.trim(),
        nationality,
      };

      const updatedUsers = [...users, newUser];
      try {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
      } catch (err) {
        console.error('Failed to save user to localStorage', err);
      }

      const loggedInUser: User = {
        name: newUser.name,
        studentId: newUser.studentId,
        nationality: newUser.nationality,
        email: newUser.email,
      };

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onLoginSuccess(loggedInUser);
        onClose();
      }, 1200);
    }
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setErrorMessage('');

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onLoginSuccess({
        name: DEMO_USER.name,
        studentId: DEMO_USER.studentId,
        nationality: DEMO_USER.nationality,
        email: DEMO_USER.email,
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-white overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close / Back button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          ✕
        </button>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <CheckCircle2 size={64} className="text-emerald-400 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold mb-2">
              {mode === 'login' ? '로그인 성공!' : '회원가입 완료!'}
            </h3>
            <p className="text-sm text-neutral-400">
              {mode === 'login'
                ? '환영합니다. 글로벌 캠퍼스로 이동합니다.'
                : '회원가입이 성공적으로 완료되어 자동 로그인되었습니다.'}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <span className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase">
                Myongji College International Hub
              </span>
              <h2 className="text-3xl font-black mt-1">
                {mode === 'login' ? '로그인' : '회원가입'}
              </h2>
              <p className="text-xs text-neutral-400 mt-2">
                {mode === 'login'
                  ? '글로벌 캠퍼스 서비스를 이용하기 위해 로그인하세요.'
                  : '유학생 포털 계정을 생성하고 다양한 혜택을 누리세요.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex bg-neutral-800/60 p-1 rounded-2xl mb-6 border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                회원가입
              </button>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">이름 (Full Name)</label>
                    <div className="relative">
                      <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        required
                        placeholder="Hong Gildong"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-800/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Student ID */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">학번 (Student ID)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">ID</span>
                      <input
                        type="text"
                        required
                        placeholder="20261234"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-800/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Nationality */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-300">국적 (Nationality)</label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-800/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                      >
                        <option value="Vietnam" className="bg-neutral-900">베트남 (Vietnam)</option>
                        <option value="China" className="bg-neutral-900">중국 (China)</option>
                        <option value="Uzbekistan" className="bg-neutral-900">우즈베키스탄 (Uzbekistan)</option>
                        <option value="Mongolia" className="bg-neutral-900">몽골 (Mongolia)</option>
                        <option value="Japan" className="bg-neutral-900">일본 (Japan)</option>
                        <option value="South Korea" className="bg-neutral-900">한국 (South Korea)</option>
                        <option value="Others" className="bg-neutral-900">기타 (Others)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">이메일 주소</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@mjc.ac.kr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-800/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">비밀번호</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-neutral-800/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                {mode === 'login' ? '로그인하기' : '회원가입하기'}
              </button>
            </form>

            {/* Quick Demo Login Option */}
            {mode === 'login' && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles size={14} className="text-cyan-400" />
                  <span>데모 계정으로 즉시 로그인</span>
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

