// L4 — 문제 안에 답: "이 문장에서 세 번째 단어를 입력하세요". 정답은 문제문 자체에서 세 번째 단어.
// 문장: "이 / 문장에서 / 세 / 번째 ..." → 세 번째 단어 = "세".
import { useState } from "react";
import type { LevelProps } from "../engine/types";

const SENTENCE = "이 문장에서 세 번째 단어를 입력하세요";
const ANSWER = SENTENCE.split(" ")[2]; // "세"

export default function LevelQuestionIsAnswer({ onSolve, solved, showHint }: LevelProps) {
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
      <p className="sentence-quote">“{SENTENCE}”</p>
      <div className={`answer-row ${wrong ? "shake" : ""}`}>
        <input
          className="text-input"
          value={value}
          placeholder="단어"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className="btn primary" onClick={submit}>확인</button>
      </div>
      {showHint && <p className="hint-inline">문장을 띄어쓰기로 잘라서, 앞에서 세 번째 토막을 세어보세요.</p>}
    </div>
  );
}
