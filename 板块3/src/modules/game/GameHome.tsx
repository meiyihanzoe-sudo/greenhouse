/**
 * 游戏主页 — 板块3 实现 v4
 *
 * 整合：
 *   1. StoryIntro（首次进入展示故事，可回看）
 *   2. 能力评估（首次进入在故事后展示）
 *   3. StarMap（星球地图主界面）
 *   4. 家长入口 → ParentReview
 *
 * ASD 友好：字体 ≥ 20px，按钮 ≥ 48px，高对比度。
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from './useGame';
import StarMap from './StarMap';
import StoryIntro from './StoryIntro';
import { AssessmentPage } from '@/modules/assessment';

type ViewMode = 'story' | 'assessment' | 'starmap';

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
    hasAssessment,
    difficultyLevel,
  } = useGame();

  const [showIntro, setShowIntro] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // 如果还没看过故事，先展示故事
    if (!localStorage.getItem('star-adventure-intro-seen')) {
      return 'story';
    }
    return 'starmap';
  });

  // 当 initGame 完成且确认有评估结果后，同步 viewMode
  useEffect(() => {
    if (hasSeenIntro && hasAssessment && viewMode === 'story') {
      setViewMode('starmap');
    }
  }, [hasSeenIntro, hasAssessment, viewMode]);

  // 处理故事结束
  const handleStoryEnd = () => {
    markIntroSeen();
    setShowIntro(false);
    // 故事结束后，引导能力评估
    setViewMode('assessment');
  };

  // 处理评估完成（由 AssessmentPage 内部导航或回调触发）
  const handleAssessmentDone = () => {
    setViewMode('starmap');
  };

  // ========== 故事模式 ==========
  if (viewMode === 'story') {
    return (
      <StoryIntro
        onStart={handleStoryEnd}
      />
    );
  }

  // 用户主动回看故事
  if (showIntro) {
    return (
      <StoryIntro
        onStart={() => setShowIntro(false)}
      />
    );
  }

  // ========== 评估模式 ==========
  if (viewMode === 'assessment') {
    return <AssessmentPage onComplete={handleAssessmentDone} />;
  }

  // ========== 星图模式 ==========
  return (
    <StarMap
      stars={stars}
      totalScenes={totalScenes}
      planetProgress={planetProgress}
      collectibles={collectibles}
      currentSceneIndex={currentSceneIndex}
      hasSeenIntro={hasSeenIntro}
      hasAssessment={hasAssessment}
      difficultyLevel={difficultyLevel}
      onStartScene={(sceneId) => navigate(`/game/${sceneId}`)}
      onShowIntro={() => setShowIntro(true)}
      onParentReview={() => navigate('/game/review')}
      onReassess={() => setViewMode('assessment')}
    />
  );
}
