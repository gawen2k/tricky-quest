// 화면 라우팅 + 진행 상태 보유. Home → Game(레벨 반복) → Win.
import { useState } from "react";
import { LEVELS } from "./engine/levels";
import { loadProgress, saveProgress, resetProgress } from "./engine/progress";
import type { Progress } from "./engine/types";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import WinScreen from "./screens/WinScreen";

type Screen = "home" | "game" | "win";

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [screen, setScreen] = useState<Screen>("home");

  function update(p: Progress) {
    setProgress(p);
    saveProgress(p);
  }

  function startNew() {
    update(resetProgress());
    setScreen("game");
  }

  function cont() {
    // 이미 전부 깬 상태면 결과로.
    if (progress.current >= LEVELS.length) setScreen("win");
    else setScreen("game");
  }

  function onSolved() {
    const lvl = LEVELS[progress.current];
    const cleared = progress.cleared.includes(lvl.id)
      ? progress.cleared
      : [...progress.cleared, lvl.id];
    const next = progress.current + 1;
    const np: Progress = { ...progress, cleared, current: next };
    update(np);
    if (next >= LEVELS.length) setScreen("win");
  }

  function onHintUsed() {
    update({ ...progress, hintsUsed: progress.hintsUsed + 1 });
  }

  function toHome() {
    setScreen("home");
  }

  if (screen === "home") {
    return (
      <HomeScreen
        hasProgress={progress.current > 0 && progress.current <= LEVELS.length}
        onStart={startNew}
        onContinue={cont}
      />
    );
  }

  if (screen === "win") {
    return (
      <WinScreen
        total={LEVELS.length}
        hintsUsed={progress.hintsUsed}
        onReplay={startNew}
      />
    );
  }

  const idx = Math.min(progress.current, LEVELS.length - 1);
  return (
    <GameScreen
      key={LEVELS[idx].id}
      level={LEVELS[idx]}
      index={idx}
      total={LEVELS.length}
      onSolved={onSolved}
      onRestart={toHome}
      onHintUsed={onHintUsed}
    />
  );
}
