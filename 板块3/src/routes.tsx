/**
 * 路由配置 — 绿房子
 *
 * 板块3 实现：替换 /game 和 /game/:sceneId 的 Placeholder。
 * 其他板块的占位保持不变。
 */

import { type RouteObject } from 'react-router-dom';
import App from './App';

// [板块1实现] 取消注释并实现
// import MonitorPage from './modules/monitor/MonitorPage';
// [板块2实现] 取消注释并实现
// import AacPage from './modules/aac/AacPage';
// [板块3实现]
import GameHome from './modules/game/GameHome';
import ScenePlay from './modules/game/ScenePlay';
import ParentReview from './modules/game/ParentReview';
import AchievementPage from './modules/achievements/AchievementPage';
import CustomSceneEditor from './modules/game/CustomSceneEditor';

// 占位组件 — 非板块3 的路由暂时保留
function Placeholder({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-2xl text-gray-400" style={{ fontSize: '24px' }}>
        🚧 {name} 开发中...
      </p>
    </div>
  );
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      // [板块1实现] 替换为真实页面
      { path: 'monitor', element: <Placeholder name="板块1 - 情绪监测" /> },
      // [板块2实现] 替换为真实页面
      { path: 'aac', element: <Placeholder name="板块2 - AAC沟通" /> },
      // [板块2实现]
      { path: 'aac/customize', element: <Placeholder name="板块2 - 自定义按钮" /> },
      // [板块3实现] ✅ 已实现
      { path: 'game', element: <GameHome /> },
      // [板块3 v3] ✅ 成就页面（必须在 :sceneId 之前）
      { path: 'game/achievements', element: <AchievementPage /> },
      // [板块3 v6] ✅ 自定义场景管理
      { path: 'game/custom', element: <CustomSceneEditor /> },
      // [板块3实现] ✅ 已实现
      { path: 'game/:sceneId', element: <ScenePlay /> },
      // [板块3 v2] ✅ 家长回顾页
      { path: 'game/review', element: <ParentReview /> },
      // [板块1实现]
      { path: 'alert/history', element: <Placeholder name="板块1 - 情绪日志" /> },
    ],
  },
];
