// L1 — Stroop 함정: "빨간 것을 탭". 글자의 '뜻'이 아니라 잉크 '색'이 빨강인 항목이 정답.
import { useState } from "react";
import type { LevelProps } from "../engine/types";

interface Word {
  text: string; // 글자 뜻
  ink: string; // 실제 잉크 색
}

// 정답은 ink === "red" 인 항목 하나. 함정: text === "빨강" 인 항목은 잉크가 파랑.
const WORDS: Word[] = [
  { text: "빨강", ink: "#3b82f6" },
  { text: "노랑", ink: "#ef4444" }, // ← 정답: 잉크가 빨강
  { text: "파랑", ink: "#22c55e" },
  { text: "초록", ink: "#eab308" },
];

export default function LevelStroop({ onSolve, solved, showHint }: LevelProps) {
  const [wrong, setWrong] = useState<number | null>(null);

  function pick(i: number) {
    if (solved) return;
    if (WORDS[i].ink === "#ef4444") {
      onSolve();
    } else {
      setWrong(i);
      setTimeout(() => setWrong(null), 400);
    }
  }

  return (
    <div className="stack">
      <div className="grid2">
        {WORDS.map((w, i) => (
          <button
            key={i}
            className={`tile ${wrong === i ? "shake" : ""}`}
            style={{ color: w.ink }}
            onClick={() => pick(i)}
          >
            {w.text}
          </button>
        ))}
      </div>
      {showHint && (
        <p className="hint-inline">글자가 뭐라고 쓰였는지 말고, 무슨 '색'으로 칠해졌는지 보세요.</p>
      )}
    </div>
  );
}
