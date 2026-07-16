/**
 * 提醒触发 Hook
 *
 * 监听激烈程度变化：当 L2/L3 持续 30 秒 → 触发 alert 状态
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ArousalLevel } from '@/types';

export interface AlertState {
  /** 是否正在显示提醒 */
  showAlert: boolean;
  /** 触发提醒的级别 */
  alertLevel: ArousalLevel | null;
  /** 关闭提醒 */
  dismissAlert: () => void;
  /** 持续秒数 */
  sustainedSeconds: number;
}

export function useAlertWatcher(currentLevel: ArousalLevel): AlertState {
  const [showAlert, setShowAlert] = useState(false);
  const [alertLevel, setAlertLevel] = useState<ArousalLevel | null>(null);
  const [sustainedSeconds, setSustainedSeconds] = useState(0);
  const elevatedSince = useRef<number | null>(null);
  const triggeredRef = useRef(false);

  // 监听 level 变化
  useEffect(() => {
    const isElevated = currentLevel === 'L2' || currentLevel === 'L3';

    if (isElevated) {
      if (!elevatedSince.current) {
        elevatedSince.current = Date.now();
      }
    } else {
      // 回落到 L0/L1 → 重置
      elevatedSince.current = null;
      triggeredRef.current = false;
      setSustainedSeconds(0);
    }
  }, [currentLevel]);

  // 每秒检查持续时间
  useEffect(() => {
    const timer = setInterval(() => {
      if (!elevatedSince.current || triggeredRef.current) return;

      const elapsed = (Date.now() - elevatedSince.current) / 1000;
      setSustainedSeconds(Math.floor(elapsed));

      if (elapsed >= 8 && !triggeredRef.current) {
        triggeredRef.current = true;
        setAlertLevel(currentLevel);
        setShowAlert(true);

        // 浏览器通知
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🌿 绿房子提醒', {
            body: `孩子激烈程度达到 ${currentLevel}，已持续 ${Math.floor(elapsed)} 秒`,
            icon: '/manifest-icon-192.png',
            tag: 'green-house-alert',
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentLevel]);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
    setAlertLevel(null);
    triggeredRef.current = false;
    elevatedSince.current = null;
    setSustainedSeconds(0);
  }, []);

  return { showAlert, alertLevel, dismissAlert, sustainedSeconds };
}
