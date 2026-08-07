import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, GraduationCap, ShieldCheck, MessageCircle, Coffee, LogOut, UserCheck, LayoutGrid, X } from 'lucide-react';
import AuthModal from './components/AuthModal';
import type { UserSession } from './components/AuthModal';
import AcademicsPage from './pages/AcademicsPage';
import CampusMapPage from './pages/CampusMapPage';
import VisaCarePage from './pages/VisaCarePage';
import CommunityPage from './pages/CommunityPage';
import LoungePage from './pages/LoungePage';

const CATEGORIES = [
  {
    id: 'campus-map',
    title: 'Campus Map',
    subtitle: '3D & Floor Map',
    description: '3D building map, facility operating hours, and floor blueprint navigation.',
    icon: Map,
    image: '/images/img1_campus_map.jpg',
  },
  {
    id: 'academics',
    title: 'Academics',
    subtitle: 'Academics & Scholarships',
    description: 'Monthly academic calendar, scholarship notices, and competition team recruiting.',
    icon: GraduationCap,
    image: '/images/img5_academics.jpg',
  },
  {
    id: 'visa-care',
    title: 'Visa Care',
    subtitle: 'Visa & Admin Care',
    description: 'Visa D-Day countdown alerts, document preparation checklists, and immigration Q&A.',
    icon: ShieldCheck,
    image: '/images/img2_visa_care.jpg',
  },
  {
    id: 'community',
    title: 'Community',
    subtitle: 'Community Forum',
    description: 'International student board, anonymous Q&A, and real-time hot feed.',
    icon: MessageCircle,
    image: '/images/img3_community.jpg',
  },
  {
    id: 'lounge',
    title: 'Lounge',
    subtitle: 'Lounge & Friends',
    description: 'Tinder-style AI Friends matching, 10s Speed Attack Quiz, and campus events.',
    icon: Coffee,
    image: '/images/img4_lounge.jpg',
  },
];

interface CircularMenuProps {
  onSelectCategory: (id: string) => void;
}

function CircularMenu({ onSelectCategory }: CircularMenuProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHover = (i: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveIndex(i);
    }, 250);
  };

  const handleHoverEnd = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const radius = 350;

  return (
    <div className="relative w-full max-w-[800px] h-[550px] scale-[0.85] md:scale-100 origin-top">
      {/* Outer subtle ring */}
      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border-t-2 border-dashed border-white/10 pointer-events-none" />
      
      {/* Center Logo */}
      <div className="absolute top-[90%] left-1/2 -translate-x-1/2 -translate-y-[45%] w-[380px] h-[380px] flex items-center justify-center z-10 pointer-events-none">
        <img 
          src="/images/myongji_tree_logo_nobg.png" 
          alt="Myongji Tree Logo" 
          className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,160,233,0.6)]"
        />
      </div>

      {CATEGORIES.map((cat, i) => {
        let diff = i - activeIndex;
        const n = CATEGORIES.length;
        if (diff > Math.floor(n/2)) diff -= n;
        if (diff < -Math.floor(n/2)) diff += n;

        const isCenter = diff === 0;
        const isAdjacent = Math.abs(diff) === 1;
        const isFar = Math.abs(diff) === 2;

        const angleDeg = -90 + diff * 35;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        return (
          <motion.div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="absolute top-[90%] left-1/2 rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/10 shadow-2xl origin-center group"
            style={{
              width: 160,
              height: 200,
              marginLeft: -80,
              marginTop: -100,
              zIndex: isCenter ? 50 : (isAdjacent ? 40 : 10),
              pointerEvents: (isCenter || isAdjacent) ? 'auto' : 'none'
            }}
            animate={{
              x, y,
              opacity: isCenter ? 1 : (isAdjacent ? 0.8 : (isFar ? 0.3 : 0)),
              scale: isCenter ? 1.2 : (isAdjacent ? 0.9 : (isFar ? 0.65 : 0.5)),
              filter: isFar ? 'blur(4px)' : 'blur(0px)',
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => {
              if (isCenter || isAdjacent) handleHover(i);
            }}
            onMouseLeave={handleHoverEnd}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ 
                backgroundImage: `url(${cat.image})`,
                transform: isCenter ? 'scale(1.1)' : 'scale(1)'
              }}
            />
            
            {/* Overlay Gradient */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-80'}`} 
            />
            
            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <motion.div 
                className={`flex flex-col gap-2 ${isCenter ? 'items-start' : 'items-center'} transition-all duration-300`}
                animate={{ y: isCenter ? 0 : 5 }}
              >
                <motion.div 
                  className={`p-3 rounded-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg shadow-blue-500/30 ${isCenter ? 'block' : 'hidden'}`}
                  animate={{ scale: isCenter ? [1, 1.25, 1.15] : 1 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 15 }}
                >
                   <cat.icon size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </motion.div>
                <span className={`font-bold transition-all duration-300 ${isCenter ? 'text-lg text-left' : 'text-sm text-center w-full tracking-wide'}`}>
                  {cat.title} <span className="text-xs font-normal text-neutral-300 block md:inline">({cat.subtitle})</span>
                </span>
              </motion.div>
              
              <AnimatePresence>
                {isCenter && (
                  <motion.p
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="text-xs text-neutral-300 leading-relaxed font-light"
                  >
                    {cat.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'academics' | 'campus-map' | 'visa-care' | 'community' | 'lounge'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  // Ensure app always starts on home page
  useEffect(() => {
    setCurrentPage('home');
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mjc_current_user');
    setCurrentUser(null);
  };

  const handleCategorySelect = (id: string) => {
    if (id === 'academics') {
      setCurrentPage('academics');
    } else if (id === 'campus-map') {
      setCurrentPage('campus-map');
    } else if (id === 'visa-care') {
      setCurrentPage('visa-care');
    } else if (id === 'community') {
      setCurrentPage('community');
    } else if (id === 'lounge') {
      setCurrentPage('lounge');
    }
  };

  if (currentPage === 'academics') {
    return <AcademicsPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'campus-map') {
    return <CampusMapPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'visa-care') {
    return <VisaCarePage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'community') {
    return <CommunityPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'lounge') {
    return <LoungePage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center pt-16 md:pt-24 relative overflow-hidden bg-[#0a0a0a]">
       
       {/* Top Auth Navigation */}
       <div className="absolute top-6 left-8 flex items-center gap-3 z-50">
         {currentUser ? (
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs font-semibold backdrop-blur-md">
               <UserCheck size={16} className="text-emerald-400" />
               <span>{currentUser.name} ({currentUser.studentId})</span>
               <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/80 text-white rounded-md uppercase">
                 {currentUser.nationality}
               </span>
             </div>
             <button
               onClick={handleLogout}
               className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-neutral-300 hover:text-white bg-transparent border border-white/20 rounded-full hover:bg-white/10 transition-colors tracking-wide cursor-pointer"
             >
               <LogOut size={16} />
               <span>Log Out</span>
             </button>
           </div>
         ) : (
           <>
             <button 
               onClick={() => openAuth('login')}
               className="px-5 py-2 text-sm font-bold text-white bg-transparent border border-white/20 rounded-full hover:bg-white/10 transition-colors tracking-wide cursor-pointer"
             >
               Login
             </button>
             <button 
               onClick={() => openAuth('signup')}
               className="px-5 py-2 text-sm font-bold text-white bg-transparent border border-white/20 rounded-full hover:bg-white/10 transition-colors tracking-wide cursor-pointer"
             >
               Sign Up
             </button>
           </>
         )}
       </div>

       <div className="text-center z-10 shrink-0 mt-8 md:mt-0">
         <p className="text-neutral-500 text-sm tracking-[0.2em] uppercase mb-4 font-bold">For International Students</p>
         <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">MYONGJI COLLEGE</h2>
         <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase mt-4 font-bold">"Click category to enter"</p>
       </div>
       
       <div className="w-full flex justify-center mt-12 md:mt-16 shrink-0">
          <CircularMenu onSelectCategory={handleCategorySelect} />
       </div>

       {/* Floating Quick Menu Button (bottom-right) */}
       <div className="absolute bottom-8 right-8 z-50 flex flex-col items-end gap-3">
         <AnimatePresence>
           {isQuickMenuOpen && (
             <motion.div
               initial={{ opacity: 0, y: 16, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 16, scale: 0.95 }}
               transition={{ duration: 0.2, ease: 'easeOut' }}
               className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] min-w-[180px]"
             >
               <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold px-3 pb-2 border-b border-white/10 mb-2">Quick Access</p>
               <div className="flex flex-col gap-1">
                 {CATEGORIES.map((cat) => (
                   <button
                     key={cat.id}
                     onClick={() => { handleCategorySelect(cat.id); setIsQuickMenuOpen(false); }}
                     className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/10 transition-colors text-left cursor-pointer group w-full"
                   >
                     <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-white group-hover:bg-white/20 transition-colors shrink-0">
                       <cat.icon size={14} />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-white">{cat.title}</p>
                       <p className="text-[10px] text-neutral-500">{cat.subtitle}</p>
                     </div>
                   </button>
                 ))}
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         <motion.button
           onClick={() => setIsQuickMenuOpen(prev => !prev)}
           whileHover={{ scale: 1.08 }}
           whileTap={{ scale: 0.95 }}
           className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:bg-white/20 transition-colors cursor-pointer"
         >
           <AnimatePresence mode="wait">
             {isQuickMenuOpen ? (
               <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                 <X size={18} />
               </motion.span>
             ) : (
               <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                 <LayoutGrid size={18} />
               </motion.span>
             )}
           </AnimatePresence>
         </motion.button>
       </div>

       {/* Auth Modal */}
       <AuthModal 
         isOpen={authModalOpen} 
         onClose={() => setAuthModalOpen(false)} 
         initialMode={authMode} 
         onLoginSuccess={(user) => setCurrentUser(user)}
       />
    </div>
  );
}
