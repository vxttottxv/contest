import { useState } from 'react';
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
} from 'lucide-react';
import {
  MOCK_BUILDINGS,
  MOCK_FACILITIES,
  MOCK_DORM_NOTICES,
  MOCK_FACILITY_GUIDES,
} from '../services/campusMapApi';
import type { Building3D } from '../services/campusMapApi';

import Campus3DViewer from '../components/Campus3DViewer';

interface CampusMapPageProps {
  onBack: () => void;
}

export default function CampusMapPage({ onBack }: CampusMapPageProps) {
  const [activeTab, setActiveTab] = useState<'3d-map' | 'dormitory' | 'hours'>('3d-map');
  const [selectedBuilding, setSelectedBuilding] = useState<Building3D>(MOCK_BUILDINGS[0]);
  const [facilityCategory, setFacilityCategory] = useState<string>('all');

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
              명지전문대학 360° 3D 입체 모형 지도, 편의시설 및 기숙사 종합 안내
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
                    {selectedBuilding.code} ({selectedBuilding.floors}층 건물)
                  </span>
                  <span className="text-xs text-neutral-400">선택한 건물</span>
                </div>

                <h2 className="text-xl font-black">{selectedBuilding.name}</h2>
                <p className="text-xs text-neutral-400 leading-relaxed">{selectedBuilding.description}</p>

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
                <h2 className="text-2xl font-black">명지 국제 기숙사 종합 안내</h2>
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

                    {/* Meal Menu Table if available */}
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
                  중앙도서관, 스포츠센터 체육관 및 오프라인 학사행정실/유학생센터 정보
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
    </div>
  );
}
