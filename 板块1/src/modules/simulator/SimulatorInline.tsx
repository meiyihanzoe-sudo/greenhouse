/**
 * 生理数据模拟端 - 内联版
 * 每秒通过 BroadcastChannel 广播 {heartRate, hrvRmssd}
 * HRV（心率变异性）比单纯心率更适合情绪监测——紧张时 HRV 显著下降
 */

import { useEffect, useRef, useState } from 'react';

const CHANNEL_NAME = 'green-house-vitals';

const SCENARIOS = ['overstim', 'anxiety', 'excite', 'fatigue', 'pain'] as const;

const SCENARIO_LABELS: Record<string, string> = {
  overstim: '过度刺激 / 感官超载',
  anxiety: '焦虑升高 / 不安累积',
  excite: '兴奋失控前兆',
  fatigue: '疲劳 / shutdown（关闭式退缩）',
  pain: '痛感 / 身体不适',
};

export default function SimulatorInline() {
  const [hr, setHr] = useState(84);
  const [hrv, setHrv] = useState(42);
  const [broadcasting, setBroadcasting] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const eventRef = useRef({ type: null as string | null, t: 0, dur: 0 });
  const baselineRef = useRef(84);

  useEffect(() => {
    try {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = ch;
      setBroadcasting(true);
    } catch {
      setBroadcasting(false);
    }
    return () => channelRef.current?.close();
  }, []);

  // 主循环
  useEffect(() => {
    const timer = setInterval(() => {
      const baseline = baselineRef.current;
      const ev = eventRef.current;
      let targetHr = baseline + (Math.random() * 4 - 2);
      let targetHrv = 42 + (Math.random() * 6 - 3); // 正常 HRV 30-50

      if (ev.type && ev.t < ev.dur) {
        ev.t++;
        switch (ev.type) {
          case 'excite':
            targetHr = baseline + 35 + Math.sin(ev.t / 3) * 15;
            targetHrv = 15 + Math.random() * 5; // HRV 很低
            break;
          case 'anxiety':
            targetHr = baseline + 25 + Math.sin(ev.t / 4) * 8;
            targetHrv = 10 + Math.random() * 6; // HRV 非常低——焦虑时最明显
            break;
          case 'overstim':
            targetHr = baseline + 30 + Math.random() * 10;
            targetHrv = 18 + Math.random() * 5; // HRV 低
            break;
          case 'fatigue':
            targetHr = baseline + 18;
            targetHrv = 25 + Math.random() * 8; // HRV 偏低
            break;
          case 'pain':
            targetHr = baseline + 40 + Math.random() * 8;
            targetHrv = 8 + Math.random() * 5; // HRV 极低——疼痛最明显
            break;
        }
      } else {
        if (ev.type && ev.t >= ev.dur) {
          ev.type = null;
          ev.t = 0;
          setActiveScenario(null);
        }
        // 恢复基线
        targetHrv = 38 + Math.random() * 8;
      }

      const newHr = Math.round(targetHr);
      const newHrv = Math.round(targetHrv);
      setHr(newHr);
      setHrv(newHrv);

      // 广播
      try {
        channelRef.current?.postMessage({ heartRate: newHr, hrvRmssd: newHrv });
      } catch { /* silent */ }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function triggerSimulation() {
    const type = SCENARIOS[scenarioIndex % SCENARIOS.length];
    setScenarioIndex((i) => i + 1);
    setActiveScenario(SCENARIO_LABELS[type]);
    eventRef.current = { type, t: 0, dur: 14 };
  }

  const isElevated = hrv < 25;
  const hrvState = hrv < 15 ? 'HRV 极低🔴' : hrv < 25 ? 'HRV 偏低🟠' : hrv < 35 ? 'HRV 正常🟡' : 'HRV 良好🟢';

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif' }}>
      {/* 顶栏 */}
      <div style={{ background: 'linear-gradient(135deg,#7FB069,#5E8C4E)', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>🌿 绿房子 · 模拟端</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>BroadcastChannel: {broadcasting ? '✅ HRV 广播中' : '❌ 不可用'}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.22)', borderRadius: 20, padding: '4px 10px', fontSize: 11 }}>
          演示信号
        </div>
      </div>

      <div style={{ padding: '14px' }}>
        {/* 心率 + HRV 双指标 */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
          <div style={{ fontSize: 12, color: '#7A8A78', marginBottom: 8 }}>实时生理信号 · HRV 情绪监测</div>

          {/* 心率 */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: '#7A8A78', marginBottom: 2 }}>心率</div>
              <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{hr}</span>
              <span style={{ fontSize: 14, color: '#7A8A78', marginLeft: 4 }}>bpm</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#7A8A78', marginBottom: 2 }}>HRV (RMSSD)</div>
              <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: isElevated ? '#E2574C' : '#2E3A2E' }}>{hrv}</span>
              <span style={{ fontSize: 14, color: '#7A8A78', marginLeft: 4 }}>ms</span>
            </div>
          </div>

          {/* HRV 状态条 */}
          <div style={{
            fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 20,
            background: hrv < 15 ? '#FBE3E0' : hrv < 25 ? '#FCF1DE' : '#EAF4E5',
            color: hrv < 15 ? '#E2574C' : hrv < 25 ? '#E8A33D' : '#5E8C4E',
            textAlign: 'center',
          }}>
            {hrvState}
          </div>

          {/* HRV 可视化条 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <span style={{ fontSize: 11, color: '#7A8A78' }}>HRV</span>
            <div style={{ flex: 1, height: 10, background: '#E4EAE0', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, (hrv / 60) * 100))}%`,
                background: 'linear-gradient(90deg,#E2574C,#E8A33D,#7FB069)',
                transition: 'width .4s',
              }} />
            </div>
            <span style={{ fontSize: 11, color: '#7A8A78' }}>60</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#ccc', marginTop: 2, paddingLeft: 36 }}>
            <span>⬅ 紧张</span>
            <span>平静 ➡</span>
          </div>
        </div>

        {/* 模拟按钮 */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
          <div style={{ fontSize: 12, color: '#7A8A78', marginBottom: 8 }}>模拟控制</div>
          <button
            onClick={triggerSimulation}
            style={{
              width: '100%', border: 'none', borderRadius: 12, padding: 14,
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              background: '#7FB069', color: '#fff',
            }}
          >
            ⚡ 模拟一次情绪波动
          </button>
          {activeScenario && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: '#FCF1DE', borderRadius: 10, fontSize: 13, color: '#E8A33D' }}>
              ⚡ 正在模拟：<b>{activeScenario}</b>（持续 14 秒，HRV 下降中…）
            </div>
          )}
          <div style={{ fontSize: 11, color: '#7A8A78', marginTop: 8, lineHeight: 1.5 }}>
            情绪波动 → HRV 下降 → L2/L3 触发。HRV 比单纯心率更适合情绪监测，不易被运动误判。
          </div>
        </div>

        {/* 场景说明 */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
          <div style={{ fontSize: 12, color: '#7A8A78', marginBottom: 8 }}>5 种情绪波动场景（轮询）</div>
          {SCENARIOS.map((s) => (
            <div key={s} style={{ fontSize: 13, padding: '6px 0', borderBottom: '1px solid #E4EAE0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E2574C', flexShrink: 0 }} />
              <span>{SCENARIO_LABELS[s]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
