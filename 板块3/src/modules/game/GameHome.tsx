/**
 * 游戏主页 — 板块3 实现 v2
 *
 * 整合：
 *   1. StoryIntro（首次进入展示故事，可回看）
 *   2. StarMap（星球地图主界面）
 *   3. 家长入口 → ParentReview
 *
 * ASD 友好：字体 ≥ 20px，按钮 ≥ 48px，高对比度。
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from './useGame';
import StarMap from './StarMap';
import StoryIntro from './StoryIntro';

export default function GameHome() {
  const navigate = useNavigate();
  const {
    stars,
    totalScenes,
    currentSceneIndex,
    planetProgress,
    collectibles,
    hasSeenIntro,
    markIntroSeen,
  } = useGame();

  const [showIntro, setShowIntro] = useState(false);

  // 首次进入 → 展示开场故事
  if (!hasSeenIntro && !showIntro) {
    return (
      <StoryIntro
        onStart={() => {
          markIntroSeen();
          setShowIntro(false);
        }}
      />
    );
  }

  // 用户主动回看故事
  if (showIntro) {
    return (
      <StoryIntro
        onStart={() => {
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <StarMap
      stars={stars}
      totalScenes={totalScenes}
      planetProgress={planetProgress}
      collectibles={collectibles}
      currentSceneIndex={currentSceneIndex}
      hasSeenIntro={hasSeenIntro}
      onStartScene={(sceneId) => navigate(`/game/${sceneId}`)}
      onShowIntro={() => setShowIntro(true)}
      onParentReview={() => navigate('/game/review')}
    />
  );
}
