import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, GraduationCap, ShieldCheck, MessageCircle, Coffee } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'campus-map',
    title: 'Campus Map',
    subtitle: '캠퍼스 맵',
    description: '3D 건물 지도, 시설 운영 시간 및 기숙사 공고를 안내합니다.',
    icon: Map,
    image: '/images/img1_campus_map.jpg',
  },
  {
    id: 'academics',
    title: 'Academics',
    subtitle: '학사·장학',
    description: '학사일정, 장학금 지원 정보 및 공모전 소식을 확인하세요.',
    icon: GraduationCap,
    image: '/images/img5_academics.jpg',
  },
  {
    id: 'visa-care',
    title: 'Visa Care',
    subtitle: '비자·행정',
    description: '비자 D-Day 카운트다운, 서류 체크리스트 및 출입국 Q&A를 지원합니다.',
    icon: ShieldCheck,
    image: '/images/img2_visa_care.jpg',
  },
  {
    id: 'community',
    title: 'Community',
    subtitle: '커뮤니티',
    description: '유학생 종합 게시판, 익명 Q&A 및 실시간 인기글을 공유하세요.',
    icon: MessageCircle,
    image: '/images/img3_community.jpg',
  },
  {
    id: 'lounge',
    title: 'Lounge',
    subtitle: '라운지·교류',
    description: '버디/프렌즈 매칭, 한국어 미니게임 및 교내 이벤트를 즐겨보세요.',
    icon: Coffee,
    image: '/images/img4_lounge.jpg',
  },
];

function CircularMenu() {
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
          <motion.a
            href={`#${cat.id}`}
            key={cat.id}
            className="absolute top-[90%] left-1/2 rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/10 shadow-2xl origin-center"
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
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
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
          </motion.a>
        );
      })}
    </div>
  );
}

export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col items-center pt-16 md:pt-24 relative overflow-hidden bg-[#0a0a0a]">
       
       {/* Top Auth Navigation */}
       <div className="absolute top-6 left-8 flex gap-3 z-50">
         <button className="px-5 py-2 text-sm font-bold text-white bg-transparent border border-white/20 rounded-full hover:bg-white/10 transition-colors tracking-wide">로그인</button>
         <button className="px-5 py-2 text-sm font-bold text-white bg-transparent border border-white/20 rounded-full hover:bg-white/10 transition-colors tracking-wide">회원가입</button>
       </div>

       <div className="text-center z-10 shrink-0 mt-8 md:mt-0">
         <p className="text-neutral-500 text-sm tracking-[0.2em] uppercase mb-4 font-bold">For International Students</p>
         <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">MYONGJI COLLEGE</h2>
         <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase mt-4 font-bold">"Hover over the category"</p>
       </div>
       
       <div className="w-full flex justify-center mt-12 md:mt-16 shrink-0">
          <CircularMenu />
       </div>
    </div>
  );
}
