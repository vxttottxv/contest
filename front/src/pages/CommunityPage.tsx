import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Flame,
  Search,
  Plus,
  Heart,
  MessageSquare,
  Eye,
  ArrowLeft,
  X,
  Send,
  Tag,
  MapPin,
  CheckCircle2,
  Sparkles,
  Users,
  Shield,
  HelpCircle,
  ShoppingBag,
  Home,
  BookOpen,
} from 'lucide-react';
import { MOCK_POSTS } from '../services/communityApi';
import type { Post, Comment } from '../services/communityApi';

interface CommunityPageProps {
  onBack: () => void;
}

export default function CommunityPage({ onBack }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState<'hot' | 'board' | 'anonymous'>('hot');
  const [boardCategoryFilter, setBoardCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Posts State (Loaded from LocalStorage or MOCK)
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('user_community_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_POSTS;
  });

  // Selected Post for Detail Modal
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Create Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'national' | 'major' | 'market' | 'housing' | 'tips' | 'anonymous'>('tips');
  const [newIsAnonymous, setNewIsAnonymous] = useState<boolean>(false);
  const [newPrice, setNewPrice] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');

  // User Like Tracking State
  const [userLikedPosts, setUserLikedPosts] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('user_liked_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('user_community_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('user_liked_posts', JSON.stringify(userLikedPosts));
  }, [userLikedPosts]);

  const handleLikeToggle = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = !!userLikedPosts[postId];
    const newLikedState = !isLiked;

    setUserLikedPosts((prev) => ({ ...prev, [postId]: newLikedState }));
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: newLikedState ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, likes: newLikedState ? prev.likes + 1 : Math.max(0, prev.likes - 1) } : null));
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedPost) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: selectedPost.id,
      authorName: '유학생 작성자',
      authorNation: '🇻🇳 베트남',
      authorBadge: '인증 유학생',
      isAnonymous: false,
      content: newCommentText.trim(),
      createdAt: '방금 전',
      likes: 0,
    };

    const updatedPosts = posts.map((p) => {
      if (p.id === selectedPost.id) {
        const existingComments = p.comments || [];
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newComment, ...existingComments],
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    const updatedSelected = updatedPosts.find((p) => p.id === selectedPost.id) || null;
    setSelectedPost(updatedSelected);
    setNewCommentText('');
  };

  const handleCreatePost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const categoryMap: Record<string, string> = {
      national: '국적별 소모임',
      major: '학과별 소모임',
      market: '중고 거래',
      housing: '방 구하기',
      tips: '생활 팁 공유',
      anonymous: '익명 Q&A',
    };

    const createdPost: Post = {
      id: `post-${Date.now()}`,
      category: newCategory,
      categoryLabel: categoryMap[newCategory] || '생활 팁',
      title: newIsAnonymous ? `🔒 [익명] ${newTitle}` : newTitle,
      content: newContent,
      authorName: newIsAnonymous ? '익명 유학생' : '신규 작성자',
      authorNation: newIsAnonymous ? '🔒 익명' : '🇰🇷 글로벌',
      isAnonymous: newIsAnonymous,
      verifiedBadge: newIsAnonymous ? undefined : '인증 유학생',
      views: 1,
      likes: 0,
      commentsCount: 0,
      createdAt: '방금 전',
      isHot: false,
      price: newPrice || undefined,
      location: newLocation || undefined,
      comments: [],
    };

    setPosts([createdPost, ...posts]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewPrice('');
    setNewLocation('');
  };

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    if (activeTab === 'hot') {
      if (!p.isHot && p.likes < 30) return false;
    } else if (activeTab === 'anonymous') {
      if (p.category !== 'anonymous' && !p.isAnonymous) return false;
    } else if (activeTab === 'board') {
      if (boardCategoryFilter !== 'all' && p.category !== boardCategoryFilter) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span>메인으로</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/20">
              <MessageCircle size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">Community (유학생 소통 커뮤니티)</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Sparkles size={10} />
                  Global Lounge Feed
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                국적별/학과별 소모임, 중고거래, 방 구하기 및 익명 고민 Q&A 피드
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>새 글 작성하기</span>
        </button>
      </header>

      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-8 space-y-6 flex-1">
        {/* TOP SEARCH BAR & TAB SWITCHER */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Main Tabs */}
            <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('hot')}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'hot'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30 font-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame size={15} className="text-amber-300" />
                <span>🔥 실시간 인기글</span>
              </button>

              <button
                onClick={() => setActiveTab('board')}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'board'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users size={15} />
                <span>💬 유학생 자유게시판</span>
              </button>

              <button
                onClick={() => setActiveTab('anonymous')}
                className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'anonymous'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Shield size={15} />
                <span>🔒 익명 Q&A</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="게시글 제목, 내용, 국적 검색..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* BOARD CATEGORY SUB-FILTERS (Only visible on 'board' tab) */}
          {activeTab === 'board' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { key: 'all', label: '전체 보기', icon: BookOpen },
                { key: 'tips', label: '💡 생활 팁', icon: Sparkles },
                { key: 'market', label: '🛍️ 중고 거래', icon: ShoppingBag },
                { key: 'housing', label: '🏠 방 구하기', icon: Home },
                { key: 'national', label: '🌍 국적별 모임', icon: Users },
                { key: 'major', label: '💻 학과 스터디', icon: Tag },
              ].map((subCat) => (
                <button
                  key={subCat.key}
                  onClick={() => setBoardCategoryFilter(subCat.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    boardCategoryFilter === subCat.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-950 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {subCat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* POSTS LIST FEED */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-white/10 bg-neutral-950 space-y-3">
              <HelpCircle size={36} className="text-neutral-500 mx-auto" />
              <p className="text-sm font-bold text-neutral-400">조건에 맞는 게시글이 존재하지 않습니다.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
              >
                첫 번째 글 작성하기
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isLiked = !!userLikedPosts[post.id];
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedPost(post)}
                  className="p-5 md:p-6 rounded-3xl border border-white/10 bg-neutral-900/80 hover:bg-neutral-900 hover:border-white/20 transition-all cursor-pointer space-y-3 shadow-xl group"
                >
                  {/* Category & Author Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        post.category === 'tips'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : post.category === 'market'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : post.category === 'housing'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : post.category === 'anonymous'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}>
                        {post.categoryLabel}
                      </span>

                      {post.isHot && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-0.5">
                          <Flame size={10} /> HOT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="font-bold text-neutral-300">{post.authorName}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-extrabold text-neutral-300 border border-white/5">
                        {post.authorNation}
                      </span>
                      {post.verifiedBadge && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> {post.verifiedBadge}
                        </span>
                      )}
                      <span className="text-neutral-500">| {post.createdAt}</span>
                    </div>
                  </div>

                  {/* Title & Content Preview */}
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mt-1 line-clamp-2 font-medium">
                      {post.content}
                    </p>
                  </div>

                  {/* Optional Price & Location tags for Flea Market / Housing */}
                  {(post.price || post.location) && (
                    <div className="flex items-center gap-3 pt-1 text-xs">
                      {post.price && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-extrabold">
                          💰 가격: {post.price}
                        </span>
                      )}
                      {post.location && (
                        <span className="px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 font-extrabold flex items-center gap-1">
                          <MapPin size={12} /> {post.location}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Interaction Stats Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-neutral-400">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => handleLikeToggle(post.id, e)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${
                          isLiked ? 'text-red-400 font-bold' : 'hover:text-red-400'
                        }`}
                      >
                        <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
                        <span>{post.likes}</span>
                      </button>

                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        <span>{post.commentsCount}</span>
                      </span>

                      <span className="flex items-center gap-1 text-neutral-500">
                        <Eye size={14} />
                        <span>{post.views}</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      자세히 보기 ➔
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      {/* POST DETAIL & COMMENTS MODAL */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-3xl max-h-[90vh] bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-white flex flex-col space-y-4 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600/30 border border-blue-400/40 text-blue-300">
                    {selectedPost.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-neutral-400">작성자: {selectedPost.authorName} ({selectedPost.authorNation})</span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Post Content */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <h2 className="text-xl font-black text-white leading-tight">{selectedPost.title}</h2>
                <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 text-xs text-neutral-200 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedPost.content}
                </div>

                {(selectedPost.price || selectedPost.location) && (
                  <div className="flex gap-2 text-xs">
                    {selectedPost.price && <span className="px-3 py-1 bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl">💰 희망가격: {selectedPost.price}</span>}
                    {selectedPost.location && <span className="px-3 py-1 bg-amber-900/50 border border-amber-500/40 text-amber-300 font-bold rounded-xl">📍 거래/위치: {selectedPost.location}</span>}
                  </div>
                )}

                {/* Like Button */}
                <div className="flex items-center justify-between border-y border-white/10 py-3">
                  <button
                    onClick={() => handleLikeToggle(selectedPost.id)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      userLikedPosts[selectedPost.id]
                        ? 'bg-red-950/60 border-red-500/50 text-red-300'
                        : 'bg-neutral-800 border-white/10 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Heart size={16} className={userLikedPosts[selectedPost.id] ? 'fill-red-500 text-red-500' : ''} />
                    <span>좋아요 / 공감 ({selectedPost.likes})</span>
                  </button>

                  <span className="text-xs text-neutral-400">댓글 {selectedPost.commentsCount}개</span>
                </div>

                {/* Comments List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-neutral-400">댓글 및 답변 목록</h4>
                  {(!selectedPost.comments || selectedPost.comments.length === 0) ? (
                    <p className="text-xs text-neutral-500 italic py-2">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                  ) : (
                    selectedPost.comments.map((cm) => (
                      <div key={cm.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{cm.authorName}</span>
                            <span className="text-[10px] text-neutral-400">{cm.authorNation}</span>
                            {cm.authorBadge && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {cm.authorBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500">{cm.createdAt}</span>
                        </div>
                        <p className="text-xs text-neutral-300 pt-1 leading-relaxed">{cm.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Comment Input Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10 shrink-0">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="댓글 또는 답변을 입력하세요..."
                  className="flex-1 px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Send size={14} />
                  <span>등록</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW POST MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-black">유학생 게시글 작성하기</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">게시글 카테고리</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="tips">💡 생활 팁 공유</option>
                    <option value="market">🛍️ 중고 거래 (벼룩시장)</option>
                    <option value="housing">🏠 방 구하기 / 룸메이트 모집</option>
                    <option value="national">🌍 국적별 소모임</option>
                    <option value="major">💻 학과별 스터디 모임</option>
                    <option value="anonymous">🔒 익명 고민 Q&A</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">제목</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="게시글 제목을 입력하세요"
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {(newCategory === 'market' || newCategory === 'housing') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-300 block">가격 / 보증금</label>
                      <input
                        type="text"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="예: 30,000원 / 보증금 300"
                        className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-300 block">위치 / 거래장소</label>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="예: 공학관 로비 / 정문 3분"
                        className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-neutral-300 block">내용</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={5}
                    placeholder="상세 내용을 자유롭게 작성하세요..."
                    className="w-full p-3 bg-neutral-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="chk-anon"
                    checked={newIsAnonymous}
                    onChange={(e) => setNewIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded bg-neutral-950 border-white/20"
                  />
                  <label htmlFor="chk-anon" className="text-xs font-bold text-neutral-300 cursor-pointer">
                    익명으로 게시하기 (🔒 이름 및 국적 비공개)
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  등록하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
