/**
 * 自定义场景编辑器 — 板块3 v6
 *
 * 家长在家长回顾页进入，可创建/编辑/删除自定义场景。
 * 支持三种交互类型：single-choice / multi-step / emotion-recognition。
 *
 * ASD 友好：字体 ≥ 20px，按钮 ≥ 48px。
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
  saveCustomScene,
  getCustomScenes as loadCustomScenes,
  deleteCustomScene,
} from '@/lib/storage';
import { CATEGORY_LABELS } from '@/data/scenes';
import { PLANET_NAMES, PLANET_EMOJIS } from '@/types';
import type { CustomScene, SceneType, DifficultyLevel } from '@/types';

// ========== 常量 ==========

const EMOJI_OPTIONS = ['🌟', '🎉', '💪', '😊', '🎈', '🏆', '💝', '🌈', '🦋', '🌸', '⭐', '🔥'];
const CATEGORIES: Array<'greeting' | 'thanks' | 'emotion' | 'request'> = [
  'greeting', 'thanks', 'emotion', 'request',
];
const SCENE_TYPE_LABELS: Record<SceneType, string> = {
  'single-choice': '📝 单选题',
  'multi-step': '🪜 多步场景',
  'emotion-recognition': '😊 情绪识别',
};
const DIFFICULTY_OPTIONS: DifficultyLevel[] = ['sprout', 'growing', 'blooming'];
const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  sprout: '🌱 简单',
  growing: '🌿 中等',
  blooming: '🌳 挑战',
};

// ========== 空场景模板 ==========

function emptyScene(): CustomScene {
  return {
    id: `custom-${Date.now()}`,
    title: '',
    emoji: '🌟',
    description: '',
    category: 'greeting',
    sceneType: 'single-choice',
    difficultyLevel: 'sprout',
    options: [
      { text: '', correct: true },
      { text: '', correct: false },
    ],
    voicePrompt: '',
    introText: '',
    successText: '',
    outroText: '',
    createdAt: Date.now(),
  };
}

// ========== 组件 ==========

export default function CustomSceneEditor() {
  const navigate = useNavigate();

  const [scenes, setScenes] = useState<CustomScene[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CustomScene | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // 加载场景列表
  const loadScenes = useCallback(async () => {
    try {
      const list = await loadCustomScenes();
      setScenes(list.sort((a, b) => b.createdAt - a.createdAt));
    } catch { /* 静默降级 */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadScenes(); }, [loadScenes]);

  // 开始创建
  const handleCreate = () => {
    setEditing(emptyScene());
    setIsCreating(true);
  };

  // 开始编辑
  const handleEdit = (scene: CustomScene) => {
    setEditing({ ...scene });
    setIsCreating(false);
  };

  // 取消编辑
  const handleCancel = () => {
    setEditing(null);
    setIsCreating(false);
    setShowDeleteConfirm(null);
  };

  // 保存
  const handleSave = async () => {
    if (!editing) return;
    // 基础校验
    if (!editing.title.trim()) return;
    if (!editing.description.trim()) return;
    if (!editing.voicePrompt.trim()) return;
    if (editing.options.some((o) => !o.text.trim())) return;
    if (!editing.options.some((o) => o.correct)) return;

    const scene: CustomScene = {
      ...editing,
      updatedAt: Date.now(),
    };

    try {
      await saveCustomScene(scene);
      await loadScenes();
      setEditing(null);
      setIsCreating(false);
    } catch { /* 静默降级 */ }
  };

  // 删除
  const handleDelete = async (id: string) => {
    try {
      await deleteCustomScene(id);
      await loadScenes();
      setShowDeleteConfirm(null);
      if (editing?.id === id) {
        setEditing(null);
        setIsCreating(false);
      }
    } catch { /* 静默降级 */ }
  };

  // ========== 渲染 ==========

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-6">
        {/* 顶部 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/game/review')}
            className="flex items-center gap-2 px-4 py-2 text-base text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/50 transition-colors"
            style={{ fontSize: '18px', minHeight: '48px' }}
          >
            ← 返回
          </button>
          <h1
            className="text-xl font-bold text-gray-700"
            style={{ fontSize: '24px' }}
          >
            🛠️ 自定义场景
          </h1>
          <div className="w-16" />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">⏳</p>
            <p className="text-xl text-gray-400" style={{ fontSize: '22px' }}>加载中...</p>
          </div>
        ) : editing ? (
          /* ====== 编辑表单 ====== */
          <SceneForm
            scene={editing}
            onChange={setEditing}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={isCreating ? undefined : () => setShowDeleteConfirm(editing.id)}
            isCreating={isCreating}
          />
        ) : (
          /* ====== 场景列表 ====== */
          <>
            {scenes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                <p className="text-5xl mb-4">📝</p>
                <p className="text-xl text-gray-400" style={{ fontSize: '22px' }}>
                  还没有自定义场景
                </p>
                <p className="text-gray-300 mt-2" style={{ fontSize: '18px' }}>
                  点击下方按钮创建属于星宝的专属场景
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scenes.map((scene) => (
                  <div
                    key={scene.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"
                  >
                    <span className="text-3xl">{scene.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-700 truncate" style={{ fontSize: '20px' }}>
                        {scene.title}
                      </p>
                      <p className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
                        {PLANET_EMOJIS[scene.category]} {PLANET_NAMES[scene.category]}
                        {' · '}
                        {SCENE_TYPE_LABELS[scene.sceneType]}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(scene)}
                        className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        style={{ fontSize: '18px', minHeight: '44px' }}
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(scene.id)}
                        className="px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        style={{ fontSize: '18px', minHeight: '44px' }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 创建按钮 */}
            <button
              onClick={handleCreate}
              className="w-full py-4 text-xl font-bold rounded-2xl text-white shadow-md transition-all hover:shadow-lg active:scale-95"
              style={{
                fontSize: '22px',
                minHeight: '56px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              + 创建新场景
            </button>
          </>
        )}

        {/* 删除确认弹窗 */}
        {showDeleteConfirm && (
          <DeleteConfirmDialog
            onConfirm={() => handleDelete(showDeleteConfirm)}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
      </div>
    </div>
  );
}

// ==================== 场景表单 ====================

interface SceneFormProps {
  scene: CustomScene;
  onChange: (scene: CustomScene) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isCreating: boolean;
}

function SceneForm({ scene, onChange, onSave, onCancel, onDelete, isCreating }: SceneFormProps) {
  const update = (patch: Partial<CustomScene>) => onChange({ ...scene, ...patch });

  // 选项操作
  const addOption = () => {
    if (scene.options.length >= 4) return;
    update({ options: [...scene.options, { text: '', correct: false }] });
  };
  const removeOption = (idx: number) => {
    if (scene.options.length <= 2) return;
    const opts = scene.options.filter((_, i) => i !== idx);
    // 如果删除的是正确答案，将第一个设为正确
    if (!opts.some((o) => o.correct)) opts[0] = { ...opts[0], correct: true };
    update({ options: opts });
  };
  const updateOption = (idx: number, field: 'text' | 'correct', value: string | boolean) => {
    const opts = [...scene.options];
    if (field === 'correct' && value === true) {
      // 单选：取消其他选项的正确标记
      opts.forEach((o, i) => { o.correct = i === idx; });
    } else if (field === 'text') {
      opts[idx] = { ...opts[idx], text: value as string };
    }
    update({ options: opts });
  };
  const updateOptionHint = (idx: number, value: string) => {
    const hints = [...(scene.optionHints || scene.options.map(() => null))];
    hints[idx] = value || null;
    update({ optionHints: hints });
  };

  // 多步场景操作
  const addStep = () => {
    const steps = [...(scene.steps || [])];
    steps.push({
      description: '',
      options: [
        { text: '', correct: true },
        { text: '', correct: false },
      ],
      hints: [null, null],
    });
    update({ steps });
  };
  const removeStep = (idx: number) => {
    const steps = (scene.steps || []).filter((_, i) => i !== idx);
    update({ steps: steps.length > 0 ? steps : undefined });
  };
  const updateStep = (stepIdx: number, field: 'description', value: string) => {
    const steps = [...(scene.steps || [])];
    steps[stepIdx] = { ...steps[stepIdx], [field]: value };
    update({ steps });
  };
  const updateStepOption = (stepIdx: number, optIdx: number, field: 'text' | 'correct', value: string | boolean) => {
    const steps = [...(scene.steps || [])];
    const opts = [...steps[stepIdx].options];
    if (field === 'correct' && value === true) {
      opts.forEach((o, i) => { o.correct = i === optIdx; });
    } else if (field === 'text') {
      opts[optIdx] = { ...opts[optIdx], text: value as string };
    }
    steps[stepIdx] = { ...steps[stepIdx], options: opts };
    update({ steps });
  };
  const addStepOption = (stepIdx: number) => {
    const steps = [...(scene.steps || [])];
    if (steps[stepIdx].options.length >= 4) return;
    steps[stepIdx] = {
      ...steps[stepIdx],
      options: [...steps[stepIdx].options, { text: '', correct: false }],
    };
    update({ steps });
  };
  const removeStepOption = (stepIdx: number, optIdx: number) => {
    const steps = [...(scene.steps || [])];
    if (steps[stepIdx].options.length <= 2) return;
    const opts = steps[stepIdx].options.filter((_, i) => i !== optIdx);
    if (!opts.some((o) => o.correct)) opts[0] = { ...opts[0], correct: true };
    steps[stepIdx] = { ...steps[stepIdx], options: opts };
    update({ steps });
  };

  // 情绪识别操作
  const addEmotion = () => {
    const list = [...(scene.emotionOptions || [])];
    list.push({ emoji: '😊', label: '', correct: false });
    update({ emotionOptions: list });
  };
  const removeEmotion = (idx: number) => {
    const list = (scene.emotionOptions || []).filter((_, i) => i !== idx);
    update({ emotionOptions: list.length > 0 ? list : undefined });
  };
  const updateEmotion = (idx: number, field: 'emoji' | 'label' | 'correct', value: string | boolean) => {
    const list = [...(scene.emotionOptions || [])];
    if (field === 'correct' && value === true) {
      list.forEach((e, i) => { e.correct = i === idx; });
    } else {
      (list[idx] as any)[field] = value;
    }
    update({ emotionOptions: list });
  };

  const isValid =
    scene.title.trim() &&
    scene.description.trim() &&
    scene.voicePrompt.trim() &&
    scene.options.every((o) => o.text.trim()) &&
    scene.options.some((o) => o.correct);

  return (
    <div className="space-y-6">
      {/* 基础信息 */}
      <Section title="📋 基础信息">
        <Field label="场景标题" required>
          <input
            type="text"
            value={scene.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="例如：在超市跟阿姨打招呼"
            className="input"
          />
        </Field>
        <Field label="Emoji 图标">
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => update({ emoji })}
                className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                  scene.emoji === emoji
                    ? 'border-indigo-400 bg-indigo-50 scale-110'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ minHeight: '48px' }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </Field>
        <Field label="所属星球">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => update({ category: cat })}
                className={`flex-1 py-2 rounded-xl border-2 transition-all ${
                  scene.category === cat
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-gray-200 text-gray-500'
                }`}
                style={{ fontSize: '18px', minHeight: '48px' }}
              >
                {PLANET_EMOJIS[cat]} {PLANET_NAMES[cat]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="场景类型">
          <div className="flex gap-2">
            {(Object.keys(SCENE_TYPE_LABELS) as SceneType[]).map((t) => (
              <button
                key={t}
                onClick={() => update({ sceneType: t })}
                className={`flex-1 py-2 rounded-xl border-2 transition-all ${
                  scene.sceneType === t
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-gray-200 text-gray-500'
                }`}
                style={{ fontSize: '18px', minHeight: '48px' }}
              >
                {SCENE_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="难度等级">
          <div className="flex gap-2">
            {DIFFICULTY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => update({ difficultyLevel: d })}
                className={`flex-1 py-2 rounded-xl border-2 transition-all ${
                  scene.difficultyLevel === d
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-gray-200 text-gray-500'
                }`}
                style={{ fontSize: '18px', minHeight: '48px' }}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* 情境描述 */}
      <Section title="📖 情境描述">
        <Field label="场景描述（星宝遇到什么情况？）" required>
          <textarea
            value={scene.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="例如：你在超市里看到了邻居阿姨，妈妈让你跟阿姨打招呼。"
            className="input min-h-[80px]"
            rows={3}
          />
        </Field>
        <Field label="开场文案（introText）">
          <textarea
            value={scene.introText}
            onChange={(e) => update({ introText: e.target.value })}
            placeholder={'例如：星宝的火箭降落在问候星上。这里的人们都喜欢微笑着说"你好"。'}
            className="input min-h-[60px]"
            rows={2}
          />
        </Field>
        <Field label="成功文案（successText）">
          <textarea
            value={scene.successText}
            onChange={(e) => update({ successText: e.target.value })}
            placeholder="例如：星宝勇敢地跟阿姨打了招呼！阿姨开心地夸他有礼貌。"
            className="input min-h-[60px]"
            rows={2}
          />
        </Field>
        <Field label="结束文案（outroText）">
          <textarea
            value={scene.outroText}
            onChange={(e) => update({ outroText: e.target.value })}
            placeholder="例如：你也像星宝一样，学会跟别人打招呼了！"
            className="input min-h-[60px]"
            rows={2}
          />
        </Field>
      </Section>

      {/* 单选题选项 */}
      {scene.sceneType === 'single-choice' && (
        <Section title="✅ 选项设置">
          <p className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
            设置 2-4 个选项，标记一个正确答案
          </p>
          {scene.options.map((opt, idx) => (
            <div key={idx} className="bg-gray-50 rounded-2xl p-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 w-6" style={{ fontSize: '16px' }}>
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => updateOption(idx, 'text', e.target.value)}
                  placeholder={`选项 ${idx + 1}`}
                  className="input flex-1"
                />
                <button
                  onClick={() => updateOption(idx, 'correct', true)}
                  className={`w-10 h-10 rounded-xl border-2 text-lg transition-all ${
                    opt.correct
                      ? 'border-green-400 bg-green-50 text-green-600'
                      : 'border-gray-200 text-gray-300'
                  }`}
                  style={{ minHeight: '40px' }}
                  title="标记为正确答案"
                >
                  ✓
                </button>
                {scene.options.length > 2 && (
                  <button
                    onClick={() => removeOption(idx)}
                    className="w-10 h-10 rounded-xl border border-red-200 text-red-400 hover:bg-red-50"
                    style={{ minHeight: '40px', fontSize: '18px' }}
                  >
                    ✕
                  </button>
                )}
              </div>
              {!opt.correct && (
                <input
                  type="text"
                  value={(scene.optionHints || [])[idx] || ''}
                  onChange={(e) => updateOptionHint(idx, e.target.value)}
                  placeholder="错误时的引导提示（可选）"
                  className="input text-sm"
                  style={{ fontSize: '16px' }}
                />
              )}
            </div>
          ))}
          {scene.options.length < 4 && (
            <button
              onClick={addOption}
              className="w-full py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
              style={{ fontSize: '18px', minHeight: '48px' }}
            >
              + 添加选项
            </button>
          )}
        </Section>
      )}

      {/* 多步场景 */}
      {scene.sceneType === 'multi-step' && (
        <Section title="🪜 步骤设置">
          <p className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
            每个步骤有独立的描述和选项
          </p>
          {(scene.steps || []).map((step, stepIdx) => (
            <div key={stepIdx} className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-600" style={{ fontSize: '20px' }}>
                  第 {stepIdx + 1} 步
                </span>
                {(scene.steps || []).length > 1 && (
                  <button
                    onClick={() => removeStep(stepIdx)}
                    className="text-red-400 text-sm hover:text-red-600"
                    style={{ fontSize: '16px', minHeight: '36px' }}
                  >
                    删除此步骤
                  </button>
                )}
              </div>
              <Field label="步骤描述">
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(stepIdx, 'description', e.target.value)}
                  placeholder="例如：第一步：你想让妈妈注意到你。你会怎么做？"
                  className="input min-h-[60px]"
                  rows={2}
                />
              </Field>
              <div className="space-y-2">
                {step.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateStepOption(stepIdx, optIdx, 'text', e.target.value)}
                      placeholder={`选项 ${optIdx + 1}`}
                      className="input flex-1"
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      onClick={() => updateStepOption(stepIdx, optIdx, 'correct', true)}
                      className={`w-8 h-8 rounded-lg border-2 text-sm ${
                        opt.correct
                          ? 'border-green-400 bg-green-50 text-green-600'
                          : 'border-gray-200 text-gray-300'
                      }`}
                      style={{ minHeight: '36px' }}
                    >
                      ✓
                    </button>
                    {step.options.length > 2 && (
                      <button
                        onClick={() => removeStepOption(stepIdx, optIdx)}
                        className="w-8 h-8 rounded-lg border border-red-200 text-red-400 text-sm"
                        style={{ minHeight: '36px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {step.options.length < 4 && (
                  <button
                    onClick={() => addStepOption(stepIdx)}
                    className="w-full py-1 rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm"
                    style={{ fontSize: '16px', minHeight: '36px' }}
                  >
                    + 添加选项
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addStep}
            className="w-full py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
            style={{ fontSize: '18px', minHeight: '48px' }}
          >
            + 添加步骤
          </button>
        </Section>
      )}

      {/* 情绪识别 */}
      {scene.sceneType === 'emotion-recognition' && (
        <Section title="😊 表情选项">
          <p className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
            设置多个表情选项，标记正确的情绪
          </p>
          {(scene.emotionOptions || []).map((emo, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-2xl p-3">
              <select
                value={emo.emoji}
                onChange={(e) => updateEmotion(idx, 'emoji', e.target.value)}
                className="input w-16 text-center text-2xl"
                style={{ fontSize: '24px', minHeight: '48px' }}
              >
                {['😊', '😢', '😨', '😤', '🤗', '😐', '😡', '🥰', '😴', '🤔'].map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              <input
                type="text"
                value={emo.label}
                onChange={(e) => updateEmotion(idx, 'label', e.target.value)}
                placeholder="表情标签，如：开心"
                className="input flex-1"
              />
              <button
                onClick={() => updateEmotion(idx, 'correct', true)}
                className={`w-10 h-10 rounded-xl border-2 text-lg transition-all ${
                  emo.correct
                    ? 'border-green-400 bg-green-50 text-green-600'
                    : 'border-gray-200 text-gray-300'
                }`}
                style={{ minHeight: '40px' }}
              >
                ✓
              </button>
              <button
                onClick={() => removeEmotion(idx)}
                className="w-10 h-10 rounded-xl border border-red-200 text-red-400"
                style={{ minHeight: '40px', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addEmotion}
            className="w-full py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
            style={{ fontSize: '18px', minHeight: '48px' }}
          >
            + 添加表情
          </button>
        </Section>
      )}

      {/* 跟读句子 */}
      <Section title="🗣️ 跟读练习">
        <Field label="跟读提示语（voicePrompt）" required>
          <input
            type="text"
            value={scene.voicePrompt}
            onChange={(e) => update({ voicePrompt: e.target.value })}
            placeholder={'例如：你也来说"阿姨好"吧！👋'}
            className="input"
          />
        </Field>
      </Section>

      {/* 操作按钮 */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onSave}
          disabled={!isValid}
          className={`w-full py-4 text-xl font-bold rounded-2xl text-white shadow-md transition-all ${
            isValid
              ? 'hover:shadow-lg active:scale-95'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            fontSize: '22px',
            minHeight: '56px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          }}
        >
          {isCreating ? '✅ 创建场景' : '💾 保存修改'}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="w-full py-3 text-lg font-medium rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-colors"
            style={{ fontSize: '20px', minHeight: '52px' }}
          >
            🗑️ 删除场景
          </button>
        )}
        <button
          onClick={onCancel}
          className="w-full py-3 text-lg font-medium rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          style={{ fontSize: '20px', minHeight: '52px' }}
        >
          取消
        </button>
      </div>
    </div>
  );
}

// ==================== 子组件 ====================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="font-bold text-gray-700" style={{ fontSize: '22px' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-600" style={{ fontSize: '18px' }}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function DeleteConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-6 space-y-4 max-w-sm w-full">
        <p className="text-center text-4xl">⚠️</p>
        <p className="text-center font-bold text-red-600" style={{ fontSize: '22px' }}>
          确定删除此场景？
        </p>
        <p className="text-center text-gray-500" style={{ fontSize: '18px' }}>
          删除后无法恢复
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-lg font-medium rounded-2xl bg-gray-100 text-gray-600"
            style={{ fontSize: '20px', minHeight: '52px' }}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-lg font-medium rounded-2xl bg-red-500 text-white"
            style={{ fontSize: '20px', minHeight: '52px' }}
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
}
