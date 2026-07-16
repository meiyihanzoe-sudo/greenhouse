/**
 * AchievementToast — 成就解锁弹窗
 *
 * 场景完成后弹出，3 秒自动消失。
 * 非阻塞，不影响游戏流程。
 */

import { useEffect, useState } from 'react';
import type { Achievement } from './types';

interface AchievementToastProps {
  achievement: Achievement;
  visible: boolean;
  onClose: () => void;
}

export function AchievementToast({ achievement, visible, onClose }: AchievementToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, achievement.id]);

  if (!visible && !show) return null;

  return (
    <div
      className={`fixed bottom-6 left-4 right-4 z-50 flex justify-center transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div
        className="max-w-sm w-full rounded-2xl p-5 text-center shadow-xl border-2 border-yellow-300"
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        }}
      >
        <p className="text-sm text-yellow-600 mb-1" style={{ fontSize: '16px' }}>
          🎉 新成就解锁！
        </p>
        <p className="text-4xl mb-2" aria-hidden="true">
          {achievement.icon}
        </p>
        <p
          className="font-bold text-yellow-800"
          style={{ fontSize: '24px' }}
        >
          {achievement.name}
        </p>
        <p className="text-sm text-yellow-600 mt-1" style={{ fontSize: '18px' }}>
          {achievement.description}
        </p>
      </div>
    </div>
  );
}
