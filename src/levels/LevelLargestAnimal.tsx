// L2 — 크기 함정: "가장 큰 동물을 탭". 화면엔 개미가 크게, 코끼리가 작게 그려져 있다.
// 정답은 화면상 크기가 아니라 '실제' 가장 큰 동물(코끼리).
import { useState } from "react";
import type { LevelProps } from "../engine/types";

interface Beast {
  emoji: string;
  size: number; // 화면 렌더 크기(px) — 함정용
  biggestInReal: boolean;
}

const BEASTS: Beast[] = [
  { emoji: "🐜", size: 92, biggestInReal: false },
  { emoji: "🐘", size: 34, biggestInReal: true }, // 정답
  { emoji: "🐁", size: 60, biggestInReal: false },
  { emoji: "🐝", size: 48, biggestInReal: false },
];

export default function LevelLargestAnimal({ onSolve, solved, showHint }: LevelProps) {
  const [wrong, setWrong] = useState<number | null>(null);

  function pick(i: number) {
    if (solved) return;
    if (BEASTS[i].biggestInReal) onSolve();
    else {
      setWrong(i);
      setTimeout(() => setWrong(null), 400);
    }
  }

  return (
    <div className="stack">
      <div className="row-wrap">
        {BEASTS.map((b, i) => (
          <button
            key={i}
            className={`emoji-btn ${wrong === i ? "shake" : ""}`}
            style={{ fontSize: b.size }}
            onClick={() => pick(i)}
          >
            {b.emoji}
          </button>
        ))}
      </div>
      {showHint && <p className="hint-inline">화면에 그려진 크기 말고, 실제 세상에서의 크기를 생각해요.</p>}
    </div>
  );
}
