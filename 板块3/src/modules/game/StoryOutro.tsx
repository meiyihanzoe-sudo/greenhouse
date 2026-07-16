/**
 * 结局动画 — 收集满 4 颗星球之心后触发
 *
 * 星宝的火箭沿着金色光线飞回地球，
 * 妈妈在门口拥抱他。
 *
 * 严肃温暖风格，ASD 友好。
 */

import { useState, useEffect } from 'react';

interface StoryOutroProps {
  show: boolean;
  onComplete: () => void;
}

export default function StoryOutro({ show, onComplete }: StoryOutroProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!show) return;
    setStep(0);

    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3500),
      setTimeout(() => setStep(3), 5500),
      setTimeout(() => onComplete(), 8000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
      <div className="max-w-lg mx-auto px-6 py-12 text-center space-y-8">
        {/* 步骤 0: 火箭准备 */}
        {step === 0 && (
          <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <p className="text-6xl mb-6">🚀</p>
            <p
              className="text-3xl font-bold text-white"
              style={{ fontSize: '32px' }}
            >
              星光能量充满！
            </p>
            <p
              className="text-xl text-white/70 mt-4"
              style={{ fontSize: '22px' }}
            >
              星宝的火箭可以回家了...
            </p>
          </div>
        )}

        {/* 步骤 1: 飞行 */}
        {step === 1 && (
          <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <p className="text-6xl mb-6" style={{ animation: 'flyHome 2s ease-in-out infinite' }}>
              🚀✨
            </p>
            <p
              className="text-3xl font-bold text-white"
              style={{ fontSize: '32px' }}
            >
              飞越星空...
            </p>
            <div className="flex justify-center gap-1 mt-4">
              {['💎', '💎', '💎', '💎'].map((h, i) => (
                <span
                  key={i}
                  className="text-2xl"
                  style={{ animation: `starFly 0.5s ease-out ${i * 0.2}s both` }}
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 步骤 2: 到家 */}
        {step === 2 && (
          <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <p className="text-7xl mb-6">🏠</p>
            <p
              className="text-3xl font-bold text-white"
              style={{ fontSize: '32px' }}
            >
              到家了！
            </p>
            <p
              className="text-xl text-white/70 mt-4 leading-relaxed"
              style={{ fontSize: '22px', lineHeight: '1.8' }}
            >
              妈妈在门口等着星宝，
              <br />
              给了他一个大大的拥抱。
            </p>
          </div>
        )}

        {/* 步骤 3: 总结 */}
        {step === 3 && (
          <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <p className="text-5xl mb-6">🤗</p>
            <p
              className="text-2xl font-bold text-white"
              style={{ fontSize: '28px' }}
            >
              "你真勇敢，星宝！"
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-lg text-white/60" style={{ fontSize: '20px' }}>
                🌻 你学会了打招呼
              </p>
              <p className="text-lg text-white/60" style={{ fontSize: '20px' }}>
                🙏 你学会了说谢谢
              </p>
              <p className="text-lg text-white/60" style={{ fontSize: '20px' }}>
                💝 你学会了表达感受
              </p>
              <p className="text-lg text-white/60" style={{ fontSize: '20px' }}>
                🗣️ 你学会了说出需求
              </p>
            </div>
            <button
              onClick={onComplete}
              className="mt-8 px-8 py-4 text-xl font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl active:scale-95"
              style={{
                fontSize: '22px',
                minHeight: '56px',
                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                color: '#5c3d2e',
              }}
            >
              回到星球地图
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes flyHome {
          0%, 100% { transform: translateX(-10px) translateY(0); }
          50% { transform: translateX(10px) translateY(-5px); }
        }
        @keyframes starFly {
          0% { transform: translateY(20px) scale(0); opacity: 0; }
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
