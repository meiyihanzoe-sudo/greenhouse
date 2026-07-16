/**
 * 通过 BroadcastChannel 接收模拟端广播的生理数据
 * 使用全局单例，避免 React StrictMode 多次创建/销毁导致消息丢失
 */

import { useState, useEffect } from 'react';

export interface BroadcastVitals {
  heartRate: number;
  hrvRmssd: number;
  connected: boolean;
  lastUpdate: number | null;
}

const CHANNEL_NAME = 'green-house-vitals';

let globalChannel: BroadcastChannel | null = null;
let globalListeners: Array<(data: BroadcastVitals) => void> = [];
let globalData: BroadcastVitals = {
  heartRate: 84,
  hrvRmssd: 42,
  connected: false,
  lastUpdate: null,
};
let globalTimeout: ReturnType<typeof setInterval> | null = null;

function initChannel() {
  if (globalChannel) return;

  try {
    globalChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch {
    console.warn('BroadcastChannel 不可用');
    return;
  }

  globalChannel.onmessage = (event: MessageEvent) => {
    const data = event.data;
    if (typeof data?.heartRate === 'number') {
      globalData = {
        heartRate: data.heartRate,
        hrvRmssd: typeof data.hrvRmssd === 'number' ? data.hrvRmssd : globalData.hrvRmssd,
        connected: true,
        lastUpdate: Date.now(),
      };
      globalListeners.forEach((cb) => cb(globalData));
    }
  };

  // 超时检测
  if (!globalTimeout) {
    globalTimeout = setInterval(() => {
      if (globalData.lastUpdate && Date.now() - globalData.lastUpdate > 5000) {
        globalData = { ...globalData, connected: false };
        globalListeners.forEach((cb) => cb(globalData));
      }
    }, 2000);
  }
}

export function useBroadcastVitals(): BroadcastVitals {
  const [state, setState] = useState<BroadcastVitals>(globalData);

  useEffect(() => {
    initChannel();

    // 订阅全局数据
    const listener = (data: BroadcastVitals) => setState(data);
    globalListeners.push(listener);

    // 立即同步一次当前值（如果 channel 已经收到过数据）
    setState(globalData);

    return () => {
      globalListeners = globalListeners.filter((cb) => cb !== listener);
    };
  }, []);

  return state;
}
