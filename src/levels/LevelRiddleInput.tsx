// L6 — 말장난 수수께끼: "사과 3개 중에서 2개를 가져갔어요. 당신에게 몇 개 있나요?"
// 함정: 남은 개수(1)가 아니라 '가져간' 개수 = 2 가 당신에게 있는 사과.
import { useState } from "react";
import type { LevelProps } from "../engine/types";

const ANSWER = "2";

export default function LevelRiddleInput({ onSolve, solved, showHint }: LevelProps) {
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
      <p className="riddle">🍎🍎🍎 → 🤲 2개를 가져갔다</p>
      <div className={`answer-row ${wrong ? "shake" : ""}`}>
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
      {showHint && <p className="hint-inline">"가져갔다"는 곧 "내가 가졌다"는 뜻. 가진 개수를 세요.</p>}
    </div>
  );
}
