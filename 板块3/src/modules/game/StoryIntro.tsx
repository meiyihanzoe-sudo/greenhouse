/**
 * 开场故事 — 首次进入游戏时展示
 *
 * 星宝收到"语言星球"邀请信，展开冒险旅程。
 * 严肃温暖风格，贴近真实社交训练。
 *
 * ASD 友好：字体 ≥ 20px，按钮 ≥ 48px，无闪烁动画。
 */

import { useState } from 'react';

interface StoryIntroProps {
  onStart: () => void;
}

/** 故事分页 */
const STORY_PAGES = [
  {
    emoji: '📨',
    title: '一封信',
    text: '星宝收到了一封特别的信。\n\n信上说：\n"亲爱的小宇航员，\n四颗语言星球正在等着你。\n在那里，你会学会用话语\n去打招呼、说谢谢、\n表达感受、说出需求。"',
  },
  {
    emoji: '🚀',
    title: '准备出发',
    text: '星宝穿上宇航服，坐上小火箭。\n\n妈妈在发射台边挥手：\n"去吧，勇敢的星宝！\n每学会一句话，\n你的火箭就会多一份能量。"',
  },
  {
    emoji: '🌍',
    title: '四颗星球',
    text: '前方有四颗星球：\n\n🌻 问候星 — 学会打招呼\n🙏 感谢星 — 学会说谢谢\n💝 情绪星 — 学会说感受\n🗣️ 表达星 — 学会说需求\n\n全部点亮后，星宝就能回家。',
  },
  {
    emoji: '⭐',
    title: '星宝，准备好了吗？',
    text: '记住：说错也没关系。\n每一次尝试都是勇敢的一步。\n\n妈妈在家里等你，\n带着满满的星光回来吧！',
  },
];

export default function StoryIntro({ onStart }: StoryIntroProps) {
  const [page, setPage] = useState(0);

  const currentPage = STORY_PAGES[page];
  const isLastPage = page === STORY_PAGES.length - 1;

  const handleNext = () => {
    if (isLastPage) {
      onStart();
    } else {
      setPage((p) => p + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 py-12 w-full">
        {/* 翻页卡片 */}
        <div
          className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center space-y-6 transition-all duration-500"
          style={{ animation: 'fadeInUp 0.5s ease-out' }}
          key={page}
        >
          {/* 页数指示器 */}
          <div className="flex justify-center gap-2">
            {STORY_PAGES.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === page ? 'bg-white w-6' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* emoji */}
          <p className="text-7xl" aria-hidden="true">
            {currentPage.emoji}
          </p>

          {/* 标题 */}
          <h2
            className="text-3xl font-bold text-white"
            style={{ fontSize: '32px' }}
          >
            {currentPage.title}
          </h2>

          {/* 正文 */}
          <div className="bg-white/5 rounded-2xl p-6">
            <p
              className="text-xl leading-relaxed text-white/90 whitespace-pre-line"
              style={{ fontSize: '22px', lineHeight: '1.8' }}
            >
              {currentPage.text}
            </p>
          </div>

          {/* 按钮 */}
          <button
            onClick={handleNext}
            className="w-full py-5 text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
            style={{
              fontSize: '24px',
              minHeight: '64px',
              background: isLastPage
                ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
                : 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
              color: isLastPage ? '#5c3d2e' : '#ffffff',
            }}
          >
            {isLastPage ? '🌟 开始冒险！' : '下一页 →'}
          </button>

          {/* 跳过按钮 */}
          {!isLastPage && (
            <button
              onClick={onStart}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
              style={{ fontSize: '18px', minHeight: '48px' }}
            >
              跳过故事，直接开始
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
