import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Map as MapIcon,
  Building2,
  Home,
  Clock,
  ArrowLeft,
  MapPin,
  Utensils,
  Coffee,
  Printer,
  ShoppingBag,
  Info,
  Phone,
  Layers,
  Layers as LayersIcon,
  X,
  Compass,
} from 'lucide-react';
import {
  MOCK_BUILDINGS,
  MOCK_FACILITIES,
  MOCK_DORM_NOTICES,
  MOCK_FACILITY_GUIDES,
} from '../services/campusMapApi';
import type { Building3D } from '../services/campusMapApi';
import Campus3DViewer from '../components/Campus3DViewer';
import CampusNavigationModal from '../components/CampusNavigationModal';

interface CampusMapPageProps {
  onBack: () => void;
}

export default function CampusMapPage({ onBack }: CampusMapPageProps) {
  const [activeTab, setActiveTab] = useState<'3d-map' | 'dormitory' | 'hours'>('3d-map');
  const [selectedBuilding, setSelectedBuilding] = useState<Building3D>(MOCK_BUILDINGS[0]);
  const [facilityCategory, setFacilityCategory] = useState<string>('all');

  // Detailed Floor Map Modal State
  const [floorModalBuilding, setFloorModalBuilding] = useState<Building3D | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  // Starfield Navigation Modal State
  const [naviModalOpen, setNaviModalOpen] = useState<boolean>(false);
  const [naviDestBuilding, setNaviDestBuilding] = useState<Building3D | null>(null);

  const openNaviForBuilding = (bld: Building3D) => {
    setNaviDestBuilding(bld);
    setNaviModalOpen(true);
  };

  // Filtered facilities
  const filteredFacilities = facilityCategory === 'all'
    ? MOCK_FACILITIES
    : MOCK_FACILITIES.filter((f) => f.category === facilityCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '편의점':
        return <ShoppingBag size={14} className="text-emerald-400" />;
      case '학생식당':
      case '식당':
        return <Utensils size={14} className="text-amber-400" />;
      case '카페':
        return <Coffee size={14} className="text-cyan-400" />;
      case '프린트실':
        return <Printer size={14} className="text-purple-400" />;
      default:
        return <Building2 size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-white/10 bg-neutral-950/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <MapIcon size={22} className="text-blue-400" />
              <h1 className="text-xl font-black tracking-tight">CAMPUS MAP</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                캠퍼스 맵
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              명지전문대학 360° 3D 입체 건물 지도, 층별 지적도 및 기숙사 종합 안내
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-neutral-900 p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveTab('3d-map')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === '3d-map'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers size={16} />
            <span>360° 3D 지형 & 편의시설</span>
          </button>
          <button
            onClick={() => setActiveTab('dormitory')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'dormitory'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Home size={16} />
            <span>기숙사 정보</span>
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'hours'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock size={16} />
            <span>시설 운영안내</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 overflow-hidden relative flex">
        {/* TAB 1: 3D MAP & FACILITIES */}
        {activeTab === '3d-map' && (
          <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
            {/* Left 360 Interactive 3D Model Viewer */}
            <div className="flex-1 relative flex flex-col overflow-hidden border-r border-white/10">
              <Campus3DViewer
                buildings={MOCK_BUILDINGS}
                selectedBuilding={selectedBuilding}
                onSelectBuilding={(bld) => setSelectedBuilding(bld)}
                onOpenFloorMap={(bld) => {
                  setFloorModalBuilding(bld);
                  setSelectedFloor(1);
                }}
              />

              {/* Bottom Category Filter Bar */}
              <div className="flex items-center justify-between gap-2 p-3 bg-neutral-950 border-t border-white/10 z-10 overflow-x-auto">
                <span className="text-xs font-bold text-neutral-400 px-2 flex items-center gap-1 shrink-0">
                  <MapPin size={14} className="text-blue-400" />
                  편의시설 분류:
                </span>
                <div className="flex gap-1.5 shrink-0">
                  {[
                    { key: 'all', label: '전체 보기' },
                    { key: '편의점', label: '편의점' },
                    { key: '학생식당', label: '학생식당' },
                    { key: '카페', label: '카페' },
                    { key: '프린트실', label: '프린트실' },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setFacilityCategory(cat.key)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        facilityCategory === cat.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Building Details & Facilities List Panel */}
            <div className="w-full md:w-[420px] bg-neutral-950 p-6 overflow-y-auto space-y-6 shrink-0">
              {/* Building Info Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {selectedBuilding.code}: {selectedBuilding.name.split('(')[0]}
                  </span>
                  <span className="text-xs text-neutral-400">{selectedBuilding.floors}층 건물</span>
                </div>

                <h2 className="text-xl font-black">{selectedBuilding.name}</h2>
                <p className="text-xs text-neutral-400 leading-relaxed">{selectedBuilding.description}</p>

                {/* Action Buttons: Floor Map & Starfield Navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setFloorModalBuilding(selectedBuilding);
                      setSelectedFloor(1);
                    }}
                    className="py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <MapIcon size={16} />
                    <span>층별 상세 지도</span>
                  </button>

                  <button
                    onClick={() => openNaviForBuilding(selectedBuilding)}
                    className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Compass size={16} className="animate-spin" />
                    <span>GPS 길찾기</span>
                  </button>
                </div>

                {/* Entrances */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-neutral-300 block">🚪 건물 출입구 정보</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBuilding.entrances.map((ent, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 border border-white/5 text-neutral-300">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Classrooms */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-neutral-300 block">🏫 주요 강의실 및 실습실</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBuilding.classrooms.map((cls, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filtered Facilities List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-300 flex items-center justify-between">
                  <span>편의시설 위치 및 운영시간</span>
                  <span className="text-xs text-neutral-500">{filteredFacilities.length}개 검색됨</span>
                </h3>

                <div className="space-y-2.5">
                  {filteredFacilities.map((fac) => (
                    <div
                      key={fac.id}
                      className="p-4 rounded-2xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(fac.category)}
                          <h4 className="text-sm font-bold">{fac.name}</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                          {fac.floor}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-400 space-y-1">
                        <p>📍 {fac.buildingName} - {fac.locationDetails}</p>
                        <p className="text-blue-400 font-semibold">⏰ {fac.operatingHours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DORMITORY INFORMATION */}
        {activeTab === 'dormitory' && (
          <div className="w-full h-full p-8 overflow-y-auto space-y-8">
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black">명지 사회교육관 & 국제 기숙사 종합 안내</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  모집 선발 공고, 입퇴사 일정, 공동생활 수칙 및 주간 식단표 안내
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_DORM_NOTICES.map((dorm) => (
                  <div
                    key={dorm.id}
                    className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-md space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                          {dorm.category}
                        </span>
                        <span className="text-xs text-neutral-500">{dorm.date}</span>
                      </div>

                      <h3 className="text-lg font-bold">{dorm.title}</h3>
                      <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">{dorm.content}</p>
                    </div>

                    {/* Meal Menu Table */}
                    {dorm.mealMenu && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-neutral-300 block mb-2">🍽️ 이번 주 주간 식단표</span>
                        <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-950">
                          <table className="w-full text-[11px] text-left">
                            <thead className="bg-neutral-800 text-neutral-400 border-b border-white/5">
                              <tr>
                                <th className="p-2">요일</th>
                                <th className="p-2">조식</th>
                                <th className="p-2">중식</th>
                                <th className="p-2">석식</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-neutral-300">
                              {dorm.mealMenu.map((m, i) => (
                                <tr key={i} className="hover:bg-white/5">
                                  <td className="p-2 font-bold text-cyan-400">{m.day}</td>
                                  <td className="p-2">{m.breakfast}</td>
                                  <td className="p-2">{m.lunch}</td>
                                  <td className="p-2">{m.dinner}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FACILITY OPERATING HOURS */}
        {activeTab === 'hours' && (
          <div className="w-full h-full p-8 overflow-y-auto space-y-8">
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black">주요 시설 운영시간 & 행정 안내</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  예체능관 실내체육관, 오프라인 학사행정실 및 유학생지원센터 운영 안내
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_FACILITY_GUIDES.map((fg) => (
                  <div
                    key={fg.id}
                    className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 w-fit">
                        <Building2 size={24} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold">{fg.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1">📍 {fg.building} ({fg.location})</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-2 text-xs">
                        <div>
                          <span className="text-neutral-500 font-bold block mb-0.5">평일 운영시간</span>
                          <span className="text-neutral-200 font-semibold">{fg.weekdayHours}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 font-bold block mb-0.5">주말 / 공휴일</span>
                          <span className="text-neutral-200 font-semibold">{fg.weekendHours}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                        <Info size={16} className="shrink-0 mt-0.5" />
                        <span>{fg.notice}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-xs text-neutral-300 font-semibold">
                      <Phone size={16} className="text-blue-400" />
                      <span>문의: {fg.contact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DETAILED FLOOR-BY-FLOOR BUILDING MAP MODAL */}
      <AnimatePresence>
        {floorModalBuilding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-white flex flex-col space-y-4 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setFloorModalBuilding(null)}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {floorModalBuilding.code}
                  </span>
                  <h3 className="text-xl font-black">{floorModalBuilding.name} 층별 상세 지적도</h3>
                </div>
                <p className="text-xs text-neutral-400">
                  선택하신 건물의 각 층별 강의실, 학과 사무실, 편의시설 및 출입구 정밀 지도입니다.
                </p>
              </div>

              {/* Floor Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 bg-neutral-950 rounded-2xl border border-white/5 overflow-x-auto">
                <span className="text-xs font-bold text-neutral-500 px-3 flex items-center gap-1 shrink-0">
                  <LayersIcon size={14} className="text-blue-400" />
                  층 선택:
                </span>
                {Array.from({ length: Math.min(5, floorModalBuilding.floors) }, (_, idx) => idx + 1).map((fNum) => (
                  <button
                    key={fNum}
                    onClick={() => setSelectedFloor(fNum)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 ${
                      selectedFloor === fNum
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {fNum}층
                  </button>
                ))}
              </div>

              {/* 2D Floor Plan Visual Canvas */}
              <div className="flex-1 min-h-[300px] p-6 rounded-2xl bg-neutral-950 border border-white/10 flex flex-col justify-between relative overflow-hidden">
                {/* Blueprint Grid & Compass */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }}
                />

                <div className="flex items-center justify-between text-xs text-neutral-400 z-10">
                  <span className="font-mono text-blue-400 font-bold">
                    FLOOR PLAN :: {floorModalBuilding.code} [{selectedFloor}F]
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Compass size={14} className="text-neutral-500" />
                    북향(N) 정면 출입
                  </span>
                </div>

                {/* Interactive Rooms Grid Blueprint */}
                <div className="my-4 grid grid-cols-3 gap-3 z-10">
                  <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/40 text-center space-y-1">
                    <span className="text-[10px] text-blue-400 font-bold block">
                      {floorModalBuilding.code} {selectedFloor}01호
                    </span>
                    <span className="text-xs font-bold">
                      {selectedFloor === 1 ? '메인 로비 & 종합 안내' : selectedFloor === 2 ? '대강당 / 세미나실' : '전공 이론 강의실'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-900/30 border border-cyan-500/40 text-center space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold block">
                      {floorModalBuilding.code} {selectedFloor}02호
                    </span>
                    <span className="text-xs font-bold">
                      {selectedFloor === 1 ? '유학생 지원 센터' : selectedFloor === 2 ? '학과 실습실' : '컴퓨터 LAB실'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-500/40 text-center space-y-1">
                    <span className="text-[10px] text-purple-400 font-bold block">
                      {floorModalBuilding.code} {selectedFloor}03호
                    </span>
                    <span className="text-xs font-bold">
                      {selectedFloor === 1 ? '편의시설 (CU/카페)' : '교수 연구실'}
                    </span>
                  </div>
                </div>

                {/* Corridor & Exit Legend */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 z-10">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> 주 출입구 / 엘리베이터
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> 비상 계단 / 화장실
                    </span>
                  </div>
                  <span className="text-neutral-500">실시간 층별 안내 시스템</span>
                </div>
              </div>

              {/* Modal Footer Info */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-neutral-400">
                  시설 관련 문의: <strong>02-300-9999 (학사행정실)</strong>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (floorModalBuilding) {
                        openNaviForBuilding(floorModalBuilding);
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Compass size={14} className="animate-spin" />
                    <span>이 건물로 길찾기</span>
                  </button>
                  <button
                    onClick={() => setFloorModalBuilding(null)}
                    className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STARFIELD STYLE CAMPUS NAVIGATION MODAL */}
      <CampusNavigationModal
        isOpen={naviModalOpen}
        onClose={() => setNaviModalOpen(false)}
        destinationBuilding={naviDestBuilding}
        allBuildings={MOCK_BUILDINGS}
      />
    </div>
  );
}
