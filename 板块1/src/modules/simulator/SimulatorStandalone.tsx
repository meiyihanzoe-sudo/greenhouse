/**
 * 生理数据模拟端 - 独立页面（无需角色选择，可直接打开）
 * 通过 BroadcastChannel 向同浏览器的仪表盘标签页广播数据
 */

import SimulatorInline from './SimulatorInline';

export default function SimulatorStandalone() {
  return (
    <div className="min-h-screen bg-[#F4F7F2]">
      <SimulatorInline />
    </div>
  );
}
