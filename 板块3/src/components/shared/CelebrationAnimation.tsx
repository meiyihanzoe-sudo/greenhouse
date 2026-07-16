/**
 * 庆祝动画 v2 — 板块2 实现，板块3 调用
 *
 * 三种级别：
 *   - normal: 小星星飞出
 *   - shining: 金色星星 + 连击文案
 *   - planet: 星球之心 + 能量爆发
 *
 * 约束：非阻塞（≥1.5s 后自动完成，期间可点击跳过）、无快速闪烁（≥0.3s 过渡）、ASD 友好。
 */

import { useEffect, useState } from 'react';

export type CelebrationLevel = 'normal' | 'shining' | 'planet';

export interface CelebrationAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  level?: CelebrationLevel;
}

const LEVEL_CONFIG: Record<CelebrationLevel, {
  stars: string[];
  bgColor: string;
  duration: number;
}> = {
  normal: {
    stars: ['⭐', '🌟', '⭐', '✨', '💫'],
    bgColor: 'bg-black/20',
    duration: 1500,
  },
  shining: {
    stars: ['🌟', '💫', '🌟', '✨', '🌟', '⚡', '🌟'],
    bgColor: 'bg-yellow-900/30',
    duration: 2000,
  },
  planet: {
    stars: ['💎', '🌟', '💎', '✨', '💎', '🌟', '💎', '✨', '💎'],
    bgColor: 'bg-purple-900/40',
    duration: 2500,
  },
};

export function CelebrationAnimation({
  show,
  message = '太棒了！🎉',
  onComplete,
  level = 'normal',
}: CelebrationAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const config = LEVEL_CONFIG[level];

  useEffect(() => {
    if (show) {
      setVisible(true);
      setSkipped(false);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, config.duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [show, onComplete, config.duration]);

  if (!show && !visible) return null;

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    setVisible(false);
    onComplete?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="alert"
      aria-live="polite"
    >
      {/* 半透明背景 */}
      <div
        className={`absolute inset-0 ${config.bgColor} transition-opacity duration-300`}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
        onClick={handleSkip}
      />

      {/* 庆祝内容 */}
      <div
        className={`relative flex flex-col items-center gap-6 p-8 rounded-3xl shadow-2xl transition-all ${
          level === 'planet'
            ? 'bg-gradient-to-b from-purple-50 to-pink-50 border-2 border-purple-300'
            : level === 'shining'
              ? 'bg-gradient-to-b from-yellow-50 to-orange-50 border-2 border-yellow-300'
              : 'bg-white'
        }`}
        style={{
          animation: level === 'planet'
            ? 'celebratePlanet 0.6s ease-out'
            : 'celebrateBounce 0.5s ease-out',
          minWidth: '280px',
          minHeight: '200px',
        }}
      >
        {/* 星星飞出动画 */}
        <div className="flex flex-wrap justify-center gap-2" aria-hidden="true">
          {config.stars.map((star, i) => (
            <span
              key={i}
              className={`${level === 'planet' ? 'text-4xl' : 'text-3xl'}`}
              style={{
                animation: `starFly 0.6s ease-out ${i * 0.08}s both`,
              }}
            >
              {star}
            </span>
          ))}
        </div>

        {/* 文案 */}
        <p
          className={`text-2xl font-bold text-center ${
            level === 'planet' ? 'text-purple-700' : level === 'shining' ? 'text-yellow-700' : 'text-gray-800'
          }`}
          style={{ fontSize: '28px' }}
        >
          {message}
        </p>

        {/* 跳过按钮 */}
        <button
          onClick={handleSkip}
          className="px-6 py-3 text-base text-gray-400 hover:text-gray-600 transition-colors duration-300 rounded-xl hover:bg-gray-100"
          style={{ fontSize: '20px', minWidth: '48px', minHeight: '48px' }}
          aria-label="关闭庆祝动画"
        >
          继续 →
        </button>
      </div>

      {/* 内联动画定义（ASD 友好：无闪烁，≥0.3s） */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes celebrateBounce {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes celebratePlanet {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.15) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes starFly {
          0% { transform: translateY(30px) scale(0); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
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
