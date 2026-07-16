/**
 * 情绪监测仪表盘 — 板块1 主页面
 *
 * 展示：ArousalBadge + 实时心率 + 折线图 + 安抚工具快捷栏
 */

import { useNavigate } from 'react-router-dom';
import { ArousalBadge } from '@/components/shared/ArousalBadge';
import { useArousalMonitor } from './useArousalMonitor';
import { useAlertWatcher } from '@/modules/alert/useAlertWatcher';
import AlertModal from '@/modules/alert/AlertModal';

const LEVEL_BG: Record<string, string> = {
  L0: 'from-green-50 to-emerald-50',
  L1: 'from-yellow-50 to-amber-50',
  L2: 'from-orange-50 to-amber-100',
  L3: 'from-red-50 to-rose-100',
};

export default function MonitorDashboard() {
  const { currentLevel, heartRate, hrvRmssd, history, connected } = useArousalMonitor();
  const navigate = useNavigate();

  // 提醒触发
  const { showAlert, alertLevel, dismissAlert } = useAlertWatcher(currentLevel);

  // HRV 折线图参数
  const chartW = 360;
  const chartH = 90;
  const minHrv = 0;
  const maxHrv = 60;

  const points = history
    .map((p, i) => {
      const x = history.length > 1 ? (i / (history.length - 1)) * chartW : chartW / 2;
      const y = chartH - ((Math.min(Math.max(p.hrvRmssd, minHrv), maxHrv) - minHrv) / (maxHrv - minHrv)) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  const isElevated = currentLevel === 'L2' || currentLevel === 'L3';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${LEVEL_BG[currentLevel]} transition-colors duration-500`}>
      {/* 顶栏 */}
      <div className="bg-white/80 backdrop-blur shadow-sm px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🌿 绿房子</h1>
          <p className="text-sm text-gray-500">情绪监测仪表盘</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-500">{connected ? '已连接' : '等待数据…'}</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 激烈程度徽章 */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500">当前激烈程度</p>
          <ArousalBadge level={currentLevel} pulse={isElevated} />
        </div>

        {/* 实时心率 + HRV */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500">心率</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-700">
                  {heartRate}
                </span>
                <span className="text-base text-gray-400">bpm</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">HRV (RMSSD)</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className={`text-4xl font-extrabold ${hrvRmssd < 25 ? 'text-red-600' : 'text-gray-800'}`}>
                  {hrvRmssd}
                </span>
                <span className="text-base text-gray-400">ms</span>
              </div>
            </div>
          </div>

          {/* HRV 趋势折线图 */}
          <div className="bg-gray-50 rounded-xl p-2 mt-2">
            <div className="text-xs text-gray-400 mb-1">HRV 趋势（越低 = 越紧张）</div>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-[90px]" preserveAspectRatio="none">
              {/* 阈值线: HRV=25 (L2), HRV=15 (L3) */}
              <line x1="0" y1={chartH - ((25 - minHrv) / (maxHrv - minHrv)) * chartH}
                    x2={chartW} y2={chartH - ((25 - minHrv) / (maxHrv - minHrv)) * chartH}
                    stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
              <line x1="0" y1={chartH - ((15 - minHrv) / (maxHrv - minHrv)) * chartH}
                    x2={chartW} y2={chartH - ((15 - minHrv) / (maxHrv - minHrv)) * chartH}
                    stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
              {points && (
                <polyline points={points} fill="none" stroke={isElevated ? '#ef4444' : '#7FB069'}
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </div>

          {/* HRV 状态条 */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-500 w-10">HRV</span>
            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, (hrvRmssd / 60) * 100))}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-10 text-right">{hrvRmssd}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-300 mt-1 px-10">
            <span>紧张</span>
            <span>平静</span>
          </div>
        </div>

        {/* 安抚工具快捷栏 */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">安抚工具</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/aac')}
              className="flex items-center justify-center gap-2 min-h-[56px] rounded-xl
                         bg-purple-50 text-purple-700 text-lg font-medium
                         hover:bg-purple-100 active:scale-[0.97] transition-all"
            >
              💬 AAC 沟通
            </button>
            <button
              onClick={() => navigate('/game')}
              className="flex items-center justify-center gap-2 min-h-[56px] rounded-xl
                         bg-blue-50 text-blue-700 text-lg font-medium
                         hover:bg-blue-100 active:scale-[0.97] transition-all"
            >
              🎮 游戏放松
            </button>
            <button
              onClick={() => navigate('/alert/history')}
              className="col-span-2 flex items-center justify-center gap-2 min-h-[56px] rounded-xl
                         bg-gray-50 text-gray-600 text-lg font-medium
                         hover:bg-gray-100 active:scale-[0.97] transition-all"
            >
              📋 情绪日志
            </button>
          </div>
        </div>

        {/* 未连接提示 */}
        {!connected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <p className="text-base text-yellow-700 mb-3">
              ⚠️ 未检测到生理数据源。请在新标签页打开模拟端，点击「⚡ 模拟一次情绪波动」。
            </p>
            <a
              href="/simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full min-h-[56px] rounded-xl bg-green-500 text-white text-lg font-bold
                         hover:bg-green-600 active:scale-[0.97] transition-all text-center leading-[56px]"
            >
              🎛️ 在新标签页打开模拟端
            </a>
          </div>
        )}

        {/* 已连接时也显示打开模拟端按钮 */}
        {connected && (
          <a
            href="/simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full min-h-[56px] rounded-xl border-2 border-green-500 text-green-600
                       text-lg font-bold hover:bg-green-50 active:scale-[0.97] transition-all text-center leading-[56px]"
          >
            🎛️ 在新标签页打开/切换模拟场景
          </a>
        )}
      </div>

      {/* 提醒弹窗 */}
      <AlertModal show={showAlert} level={alertLevel} onDismiss={dismissAlert} />
    </div>
  );
}
