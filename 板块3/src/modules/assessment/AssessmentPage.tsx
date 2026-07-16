/**
 * 能力评估页面 — 「星宝出发前的准备」
 *
 * ASD 友好设计：
 *   - 大字体（≥20px）
 *   - 大按钮（≥48px）
 *   - 每次只展示一道题
 *   - 温和的过渡动画
 *   - 明确的进度指示
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSESSMENT_QUESTIONS } from './questions';
import { calculateResult } from './scoring';
import { saveAssessmentResult } from './storage';
import { useGameStore } from '@/modules/game/gameStore';
import { ABILITY_LEVEL_LABELS, ABILITY_LEVEL_DESCRIPTIONS } from './types';
import type { UserAnswers } from './scoring';
import type { AbilityLevel } from './types';

type AssessmentPhase = 'intro' | 'questioning' | 'result';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const applyAssessment = useGameStore((s) => s.applyAssessment);
  const setShowAssessment = useGameStore((s) => s.setShowAssessment);

  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];

  // 开始评估
  const handleStart = useCallback(() => {
    setPhase('questioning');
  }, []);

  // 选择选项
  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (isTransitioning || selectedOption !== null) return;

      setSelectedOption(optionIndex);
      setIsTransitioning(true);

      // 记录答案
      const newAnswers = { ...answers, [currentQuestion.id]: optionIndex };
      setAnswers(newAnswers);

      // 延迟后进入下一题或结果
      setTimeout(() => {
        if (currentQuestionIndex + 1 < totalQuestions) {
          setCurrentQuestionIndex((i) => i + 1);
          setSelectedOption(null);
          setIsTransitioning(false);
        } else {
          // 所有题目完成 → 计算结果
          const result = calculateResult(newAnswers);
          saveAssessmentResult(result).catch(() => {});
          applyAssessment(result.overallLevel);
          setPhase('result');
        }
      }, 600);
    },
    [currentQuestionIndex, currentQuestion.id, answers, totalQuestions, isTransitioning, selectedOption, applyAssessment],
  );

  // 返回星图
  const handleBackToMap = useCallback(() => {
    setShowAssessment(false);
    navigate('/game');
  }, [navigate, setShowAssessment]);

  // ========== 开场引导 ==========
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6 text-center">
          <div className="text-5xl">🚀</div>
          <h1
            className="text-2xl font-bold text-gray-800"
            style={{ fontSize: '28px' }}
          >
            出发前的准备
          </h1>
          <p
            className="text-gray-600 leading-relaxed"
            style={{ fontSize: '20px' }}
          >
            星宝即将开始宇宙冒险！先来回答几个小问题，
            让飞船为你准备最合适的路线吧～
          </p>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <p
              className="text-amber-700"
              style={{ fontSize: '18px' }}
            >
              💡 一共 {totalQuestions} 道小题，大约需要 2 分钟
            </p>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-4 text-xl font-bold rounded-2xl text-white shadow-md transition-transform active:scale-95"
            style={{
              fontSize: '22px',
              minHeight: '56px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            🌟 开始准备
          </button>
        </div>
      </div>
    );
  }

  // ========== 结果展示 ==========
  if (phase === 'result') {
    return <AssessmentResultView onBackToMap={handleBackToMap} />;
  }

  // ========== 答题中 ==========
  const progress = Math.round(((currentQuestionIndex) / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* 进度条 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-gray-500 font-medium"
              style={{ fontSize: '18px' }}
            >
              第 {currentQuestionIndex + 1} / {totalQuestions} 题
            </span>
            <span
              className="text-indigo-500 font-semibold"
              style={{ fontSize: '18px' }}
            >
              {progress}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
              }}
            />
          </div>
        </div>

        {/* 题目卡片 */}
        <div
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6 transition-all duration-300"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(-10px)' : 'none',
          }}
        >
          {/* 情境 emoji */}
          <div className="text-center text-4xl">{currentQuestion.emoji}</div>

          {/* 情境描述 */}
          <p
            className="text-gray-800 text-center leading-relaxed font-medium"
            style={{ fontSize: '22px' }}
          >
            {currentQuestion.scenario}
          </p>

          {/* 选项 */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = option.score === 2;
              const showCorrect = selectedOption !== null && isCorrectOption;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isTransitioning}
                  className={`w-full py-4 px-5 rounded-2xl text-left font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-100 border-2 border-indigo-400 shadow-md scale-[0.98]'
                      : showCorrect && selectedOption !== null
                        ? 'bg-green-50 border-2 border-green-400'
                        : 'bg-gray-50 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 active:scale-[0.98]'
                  }`}
                  style={{
                    fontSize: '20px',
                    minHeight: '56px',
                  }}
                >
                  <span className="mr-2">
                    {['🅰️', '🅱️', '©️'][idx] || '•'}
                  </span>
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== 结果展示组件 ==========

function AssessmentResultView({ onBackToMap }: { onBackToMap: () => void }) {
  const difficultyLevel = useGameStore((s) => s.difficultyLevel);
  const levelKey = difficultyLevel as AbilityLevel;
  const levelLabel = ABILITY_LEVEL_LABELS[levelKey] || '🌱 萌芽期';
  const levelDesc = ABILITY_LEVEL_DESCRIPTIONS[levelKey] || '';

  return (
    <div className="max-w-md w-full space-y-6">
      {/* 结果卡片 */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 space-y-6 text-center">
        <div className="text-5xl">🎉</div>
        <h2
          className="text-2xl font-bold text-gray-800"
          style={{ fontSize: '28px' }}
        >
          准备完成！
        </h2>

        {/* 等级徽章 */}
        <div
          className="inline-block px-6 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <span
            className="text-white font-bold"
            style={{ fontSize: '24px' }}
          >
            {levelLabel}
          </span>
        </div>

        <p
          className="text-gray-600 leading-relaxed"
          style={{ fontSize: '20px' }}
        >
          {levelDesc}
        </p>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <p
            className="text-amber-700"
            style={{ fontSize: '18px' }}
          >
            💡 飞船已经为你规划好了最合适的路线，星球难度会根据你的情况自动调整哦～
          </p>
        </div>

        <button
          onClick={onBackToMap}
          className="w-full py-4 text-xl font-bold rounded-2xl text-white shadow-md transition-transform active:scale-95"
          style={{
            fontSize: '22px',
            minHeight: '56px',
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
          }}
        >
          🚀 开始冒险！
        </button>
      </div>
    </div>
  );
}
