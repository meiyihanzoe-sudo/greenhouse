/**
 * 家长回顾页 — 板块3 v2
 *
 * 家长通过星球地图长按入口进入。
 * 展示星宝的学习进展和练习建议。
 *
 * 设计原则：
 *   - 正面语言，不展示"答错次数"
 *   - 简洁有洞察，不做复杂数据分析
 *   - 数据仅存本地 IndexedDB
 *
 * ASD 友好：字体 ≥ 20px，按钮 ≥ 48px。
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useGame } from './useGame';
import { getGameProgress } from '@/lib/storage';
import { getActiveScenes, CATEGORY_LABELS } from '@/data/scenes';
import { StarProgress } from '@/components/shared/StarProgress';
import { AchievementSummary } from '@/modules/achievements';
import {
  PLANET_NAMES,
  PLANET_EMOJIS,
  PARENT_ADVICE,
} from '@/types';
import type { GameProgress, PracticeRecord } from '@/types';

export default function ParentReview() {
  const navigate = useNavigate();
  const {
    stars,
    totalScenes,
    planetProgress,
    collectibles,
    combo,
    newArchive,
  } = useGame();

  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  useEffect(() => {
    async function loadRecords() {
      try {
        const progress = await getGameProgress();
        const scenes = getActiveScenes();
        const sceneMap = new Map(scenes.map((s) => [s.id, s]));

        const practiceRecords: PracticeRecord[] = progress
          .filter((p) => p.completed)
          .map((p) => {
            const scene = sceneMap.get(p.sceneId);
            return {
              sceneId: p.sceneId,
              sceneTitle: scene?.title || p.sceneId,
              category: scene?.category || '',
              completedAt: Date.now(), // IndexedDB 不存时间戳，用当前时间替代
              voiceAttempts: p.attempts,
            };
          })
          .sort((a, b) => b.completedAt - a.completedAt);

        setRecords(practiceRecords);
      } catch {
        // 静默降级
      }
      setLoading(false);
    }
    loadRecords();
  }, []);

  // 统计
  const shiningStars = collectibles.filter((c) => c.type === 'shining_star').length;
  const planetHearts = collectibles.filter((c) => c.type === 'planet_heart').length;
  const totalVoiceAttempts = records.reduce((sum, r) => sum + r.voiceAttempts, 0);

  // 找到需要练习的星球
  const needsPractice = planetProgress
    .filter((p) => !p.completed && p.completedScenes > 0)
    .map((p) => p.category);

  // 最近练习日期
  const lastPracticeDate = records.length > 0
    ? new Date(records[0].completedAt).toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
      })
    : '暂无';

  // 新建存档
  const handleNewArchive = useCallback(async () => {
    setResetting(true);
    await newArchive();
    setRecords([]);
    setShowResetConfirm(false);
    setResetting(false);
    navigate('/game');
  }, [newArchive, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
        {/* 顶部 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/game')}
            className="flex items-center gap-2 px-4 py-2 text-base text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/50 transition-colors"
            style={{ fontSize: '18px', minHeight: '48px' }}
          >
            ← 返回
          </button>
          <h1
            className="text-xl font-bold text-gray-700"
            style={{ fontSize: '24px' }}
          >
            📊 星宝的学习旅程
          </h1>
          <button
            onClick={() => navigate('/game/custom')}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            style={{ fontSize: '16px', minHeight: '48px' }}
            title="管理自定义场景"
          >
            🛠️
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">⏳</p>
            <p className="text-xl text-gray-400" style={{ fontSize: '22px' }}>
              加载中...
            </p>
          </div>
        ) : (
          <>
            {/* 概览卡片 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2
                className="font-bold text-gray-700"
                style={{ fontSize: '22px' }}
              >
                学习概览
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-indigo-600" style={{ fontSize: '30px' }}>
                    {stars}
                  </p>
                  <p className="text-sm text-gray-500 mt-1" style={{ fontSize: '16px' }}>
                    🌟 星光能量
                  </p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600" style={{ fontSize: '30px' }}>
                    {records.length}/{totalScenes}
                  </p>
                  <p className="text-sm text-gray-500 mt-1" style={{ fontSize: '16px' }}>
                    ✅ 完成场景
                  </p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600" style={{ fontSize: '30px' }}>
                    {totalVoiceAttempts}
                  </p>
                  <p className="text-sm text-gray-500 mt-1" style={{ fontSize: '16px' }}>
                    🎤 语音练习
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600" style={{ fontSize: '30px' }}>
                    {lastPracticeDate}
                  </p>
                  <p className="text-sm text-gray-500 mt-1" style={{ fontSize: '16px' }}>
                    📅 最近练习
                  </p>
                </div>
              </div>

              {/* 收集物 */}
              {(shiningStars > 0 || planetHearts > 0) && (
                <div className="flex gap-3 text-center">
                  {shiningStars > 0 && (
                    <div className="flex-1 bg-yellow-50 rounded-xl p-3">
                      <span style={{ fontSize: '20px' }}>🌟 闪耀星 x{shiningStars}</span>
                    </div>
                  )}
                  {planetHearts > 0 && (
                    <div className="flex-1 bg-purple-50 rounded-xl p-3">
                      <span style={{ fontSize: '20px' }}>💎 星球之心 x{planetHearts}/4</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 星球进度 */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2
                className="font-bold text-gray-700"
                style={{ fontSize: '22px' }}
              >
                星球进度
              </h2>
              {planetProgress.map((planet) => (
                <div key={planet.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '20px' }}>
                      {PLANET_EMOJIS[planet.category]} {PLANET_NAMES[planet.category]}
                    </span>
                    <span className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
                      {planet.completed ? '✅ 完成' : planet.completedScenes > 0 ? '🔄 进行中' : '⏳ 未开始'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round((planet.completedScenes / (planet.totalScenes || 1)) * 100)}%`,
                        background: planet.completed
                          ? 'linear-gradient(90deg, #f6d365, #fda085)'
                          : 'linear-gradient(90deg, #667eea, #764ba2)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 给家长的建议 */}
            {needsPractice.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-indigo-100 p-6 space-y-3">
                <h2
                  className="font-bold text-gray-700 flex items-center gap-2"
                  style={{ fontSize: '22px' }}
                >
                  💡 给家长的建议
                </h2>
                {needsPractice.map((cat) => (
                  <div
                    key={cat}
                    className="bg-indigo-50 rounded-2xl p-4"
                  >
                    <p
                      className="font-semibold text-indigo-700 mb-1"
                      style={{ fontSize: '20px' }}
                    >
                      {PLANET_EMOJIS[cat]} {PLANET_NAMES[cat]}
                    </p>
                    <p
                      className="text-gray-600 leading-relaxed"
                      style={{ fontSize: '18px', lineHeight: '1.7' }}
                    >
                      {PARENT_ADVICE[cat]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 全部完成的肯定 */}
            {planetHearts >= 4 && (
              <div className="bg-yellow-50 rounded-3xl border border-yellow-200 p-6 text-center">
                <p className="text-4xl mb-2">🎉</p>
                <p
                  className="text-xl font-bold text-yellow-700"
                  style={{ fontSize: '22px' }}
                >
                  星宝完成了所有星球的冒险！
                </p>
                <p
                  className="text-gray-600 mt-2"
                  style={{ fontSize: '18px' }}
                >
                  他已经具备了基础的社交表达能力。继续在日常生活中练习，会越来越好的！
                </p>
              </div>
            )}

            {/* 最近练习记录 */}
            {records.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h2
                  className="font-bold text-gray-700"
                  style={{ fontSize: '22px' }}
                >
                  练习记录
                </h2>
                <div className="space-y-2">
                  {records.map((record) => (
                    <div
                      key={record.sceneId}
                      className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-700" style={{ fontSize: '20px' }}>
                          {record.sceneTitle}
                        </p>
                        <p className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
                          {CATEGORY_LABELS[record.category] || record.category}
                          {' · '}
                          语音 {record.voiceAttempts} 次
                        </p>
                      </div>
                      <span className="text-lg">✅</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 暂无记录 */}
            {records.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                <p className="text-5xl mb-4">🚀</p>
                <p
                  className="text-xl text-gray-400"
                  style={{ fontSize: '22px' }}
                >
                  星宝还没开始冒险呢～
                </p>
                <p
                  className="text-gray-300 mt-2"
                  style={{ fontSize: '18px' }}
                >
                  完成一些场景后，这里会显示练习记录
                </p>
              </div>
            )}

            {/* 成就摘要 */}
            <AchievementSummary />

            {/* 自定义场景管理 */}
            <div className="pt-4">
              <button
                onClick={() => navigate('/game/custom')}
                className="w-full py-3 text-base font-medium rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                style={{ fontSize: '20px', minHeight: '52px' }}
              >
                🛠️ 管理自定义场景
              </button>
            </div>

            {/* 新建存档 */}
            <div className="pt-4 border-t border-gray-100">
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-3 text-base text-gray-400 hover:text-red-500 transition-colors rounded-xl"
                  style={{ fontSize: '18px', minHeight: '48px' }}
                >
                  🗑️ 新建存档（清除所有进度）
                </button>
              ) : (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-4 space-y-3 text-center">
                  <p
                    className="text-red-600 font-semibold"
                    style={{ fontSize: '20px' }}
                  >
                    ⚠️ 确定要清除所有进度吗？
                  </p>
                  <p
                    className="text-red-400"
                    style={{ fontSize: '16px' }}
                  >
                    所有星宝的学习记录将被删除，无法恢复。
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      disabled={resetting}
                      className="flex-1 py-3 text-base font-medium rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      style={{ fontSize: '18px', minHeight: '48px' }}
                    >
                      取消
                    </button>
                    <button
                      onClick={handleNewArchive}
                      disabled={resetting}
                      className="flex-1 py-3 text-base font-medium rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                      style={{ fontSize: '18px', minHeight: '48px' }}
                    >
                      {resetting ? '清除中...' : '确认清除'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
