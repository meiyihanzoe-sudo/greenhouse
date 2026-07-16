/**
 * DailyTaskList — 每日任务列表
 *
 * 3 个任务纵向排列，每个显示进度条 + 领取按钮。
 */

import type { DailyTask, DailyTaskProgress } from './types';

interface DailyTaskListProps {
  tasks: DailyTask[];
  progress: DailyTaskProgress | null;
  onClaimReward: (taskId: string) => void;
}

export function DailyTaskList({ tasks, progress, onClaimReward }: DailyTaskListProps) {
  const todayStr = new Date().toLocaleDateString('zh-CN');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-lg text-gray-500" style={{ fontSize: '18px' }}>
          📅 {todayStr}
        </p>
        <p className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
          每天 0 点刷新，完成任务领取星星奖励！
        </p>
      </div>

      {tasks.map((task) => {
        const taskProgress = progress?.tasks.find((t) => t.taskId === task.id);
        const current = taskProgress?.current ?? 0;
        const completed = taskProgress?.completed ?? false;
        const claimed = taskProgress?.rewardClaimed ?? false;

        return (
          <div
            key={task.id}
            className={`bg-white rounded-2xl border-2 p-4 space-y-3 transition-all ${
              completed && claimed
                ? 'border-green-200 bg-green-50/30'
                : completed
                  ? 'border-yellow-200'
                  : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {task.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800" style={{ fontSize: '20px' }}>
                  {task.name}
                </p>
                <p className="text-sm text-gray-500" style={{ fontSize: '16px' }}>
                  {task.description}
                </p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    completed ? 'bg-green-400' : 'bg-indigo-400'
                  }`}
                  style={{ width: `${Math.min((current / task.target) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600" style={{ fontSize: '16px', minWidth: '36px' }}>
                {current}/{task.target}
              </span>
            </div>

            {/* 领取按钮 */}
            <div className="flex justify-end">
              {claimed ? (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm"
                  style={{ fontSize: '16px' }}
                >
                  ✅ 已领取
                </span>
              ) : completed ? (
                <button
                  onClick={() => onClaimReward(task.id)}
                  className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-bold shadow transition-all active:scale-95"
                  style={{ fontSize: '18px', minHeight: '48px' }}
                >
                  🎁 领取 ⭐x{task.reward}
                </button>
              ) : (
                <span className="text-sm text-gray-400" style={{ fontSize: '16px' }}>
                  奖励 ⭐x{task.reward}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
