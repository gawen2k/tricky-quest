// 플레이 화면. 현재 레벨 렌더 + 정답 시 다음 레벨 진행 오버레이.
import { useState } from "react";
import type { LevelDef } from "../engine/types";
import Hud from "../components/Hud";

interface GameProps {
  level: LevelDef;
  index: number;
  total: number;
  onSolved: () => void; // 다음 레벨/승리로 진행
  onRestart: () => void;
  onHintUsed: () => void;
}

export default function GameScreen({
  level,
  index,
  total,
  onSolved,
  onRestart,
  onHintUsed,
}: GameProps) {
  const [solved, setSolved] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  function handleSolve() {
    if (solved) return;
    setSolved(true);
  }

  function toggleHint() {
    if (!hintOpen) onHintUsed();
    setHintOpen((v) => !v);
  }

  const Level = level.Component;
  return (
    <div className="screen game">
      <Hud
        index={index}
        total={total}
        hintOpen={hintOpen}
        onToggleHint={toggleHint}
        onRestart={onRestart}
      />
      <h2 className="prompt">{level.prompt}</h2>
      <div className="level-stage">
        <Level onSolve={handleSolve} solved={solved} showHint={hintOpen} />
      </div>

      {solved && (
        <div className="overlay">
          <div className="overlay-card">
            <div className="check">✅</div>
            <p className="overlay-text">정답!</p>
            <button
              className="btn primary big"
              onClick={() => {
                setSolved(false);
                setHintOpen(false);
                onSolved();
              }}
            >
              {index + 1 < total ? "다음" : "결과 보기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
