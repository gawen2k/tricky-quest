// L3 — 세기 함정: "사과는 몇 개?". 일부 사과가 박스 밖/스크롤 영역에 숨어 있다.
// 보이는 6개만 세면 오답. 컨테이너를 스크롤하면 숨은 사과 3개가 더 있다 → 정답 9.
import { useState } from "react";
import type { LevelProps } from "../engine/types";

const TOTAL = 9;
const ANSWER = String(TOTAL);

export default function LevelCountTrick({ onSolve, solved, showHint }: LevelProps) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  function submit() {
    if (solved) return;
    if (value.trim() === ANSWER) onSolve();
    else {
      setWrong(true);
      setTimeout(() => setWrong(false), 400);
    }
  }

  return (
    <div className="stack">
      <div className={`scroll-box ${wrong ? "shake" : ""}`}>
        <div className="apple-grid">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span key={i} className="apple">🍎</span>
          ))}
        </div>
      </div>
      <p className="muted small">↕ 상자 안을 스크롤해 보세요.</p>
      <div className="answer-row">
        <input
          className="num-input"
          inputMode="numeric"
          value={value}
          placeholder="개수"
          onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="btn primary" onClick={submit}>확인</button>
      </div>
      {showHint && <p className="hint-inline">상자가 다 보여주는 게 아니에요. 끝까지 스크롤해서 세요.</p>}
    </div>
  );
}
