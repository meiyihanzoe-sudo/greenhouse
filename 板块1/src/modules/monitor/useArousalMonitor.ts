/**
 * 激烈程度监测 Hook
 */

import { useState, useEffect } from 'react';
import type { ArousalLevel } from '@/types';
import { calculateArousalLevel } from '@/lib/arousal';
import { useBroadcastVitals } from './useBroadcastVitals';

export interface ArousalMonitorState {
  currentLevel: ArousalLevel;
  heartRate: number;
  hrvRmssd: number;
  history: Array<{ time: number; heartRate: number; hrvRmssd: number; level: ArousalLevel }>;
  connected: boolean;
}

export function useArousalMonitor(): ArousalMonitorState {
  const { heartRate, hrvRmssd, connected } = useBroadcastVitals();
  const [state, setState] = useState<ArousalMonitorState>({
    currentLevel: 'L0',
    heartRate,
    hrvRmssd,
    history: [],
    connected,
  });

  useEffect(() => {
    const level = calculateArousalLevel(heartRate, hrvRmssd);

    setState((prev) => {
      // 只有数据真正变化或级别变化时才加入历史
      const changed =
        prev.heartRate !== heartRate ||
        prev.hrvRmssd !== hrvRmssd ||
        prev.currentLevel !== level;

      const nextHistory = changed
        ? [...prev.history, { time: Date.now(), heartRate, hrvRmssd, level }].slice(-60)
        : prev.history;

      return {
        currentLevel: level,
        heartRate,
        hrvRmssd,
        history: nextHistory,
        connected,
      };
    });
  }, [heartRate, hrvRmssd, connected]);

  return state;
}
