import { type RouteObject } from 'react-router-dom';
import App from './App';
import MonitorDashboard from './modules/monitor/MonitorDashboard';
import AlertHistory from './modules/alert/AlertHistory';
import SimulatorStandalone from './modules/simulator/SimulatorStandalone';

// [板块2实现] 取消注释并导入 AacPage
// import AacPage from './modules/aac/AacPage';
// [板块3实现] 取消注释并导入 GamePage
// import GamePage from './modules/game/GamePage';

// 占位组件 — 各板块实现后替换
function Placeholder({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-2xl">🚧 {name} 开发中...</p>
    </div>
  );
}

export const routes: RouteObject[] = [
  // 模拟端 — 独立路由，无需角色选择
  {
    path: '/simulator',
    element: <SimulatorStandalone />,
  },
  // 主应用 — 需要角色选择
  {
    path: '/',
    element: <App />,
    children: [
      // [板块1实现] ✅ 已替换
      { path: 'monitor', element: <MonitorDashboard /> },
      // [板块2实现] 替换为真实页面
      { path: 'aac', element: <Placeholder name="板块2 - AAC沟通" /> },
      // [板块2实现]
      { path: 'aac/customize', element: <Placeholder name="板块2 - 自定义按钮" /> },
      // [板块3实现] 替换为真实页面
      { path: 'game', element: <Placeholder name="板块3 - 游戏" /> },
      // [板块3实现]
      { path: 'game/:sceneId', element: <Placeholder name="板块3 - 游戏场景" /> },
      // [板块1实现] ✅ 已替换
      { path: 'alert/history', element: <AlertHistory /> },
    ],
  },
];
