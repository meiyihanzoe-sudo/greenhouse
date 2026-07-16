/**
 * 情绪日志页面 — 板块1
 *
 * 从 IndexedDB 读取历史情绪事件，按时间倒序展示
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EmotionEvent } from '@/types';
import { EMOTION_TYPE_LABELS } from '@/types';
import { getEmotionEvents } from '@/lib/storage';

export default function AlertHistory() {
  const [events, setEvents] = useState<EmotionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await getEmotionEvents(50);
      setEvents(data);
    } catch {
      // IndexedDB 不可用
    } finally {
      setLoading(false);
    }
  }

  function formatTime(timestamp: number): string {
    const d = new Date(timestamp);
    return d.toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function levelColor(level: string): string {
    switch (level) {
      case 'L0': return 'bg-green-500';
      case 'L1': return 'bg-yellow-500';
      case 'L2': return 'bg-orange-500';
      case 'L3': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶栏 */}
      <div className="bg-white shadow-sm px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/monitor')}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl
                     bg-gray-100 text-gray-600 text-lg hover:bg-gray-200 transition-all"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">情绪日志</h1>
          <p className="text-sm text-gray-500">历史记录</p>
        </div>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-lg text-gray-400">加载中…</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-xl text-gray-500">暂无情绪事件记录</p>
            <p className="text-base text-gray-400 mt-2">
              当系统检测到 L2 或 L3 级别并触发提醒后，你选择的情绪类型会自动记录在这里。
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${levelColor(event.arousalLevel)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-800">
                      {event.emotionType ? EMOTION_TYPE_LABELS[event.emotionType] : '未选择'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {event.arousalLevel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{formatTime(event.timestamp)}</p>
                  {event.note && (
                    <p className="text-sm text-gray-500 mt-1">{event.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
