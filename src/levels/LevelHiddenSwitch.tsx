// L5 — 숨은 동작: "부엉이를 깨우세요". 부엉이는 낮엔 잔다. 해(☀)를 화면 밖으로 드래그하면
// 밤이 되고, 그때 부엉이를 탭하면 깨어난다(클리어). 드래그 + 탭 두 단계 함정.
import { useRef, useState } from "react";
import type { LevelProps } from "../engine/types";

export default function LevelHiddenSwitch({ onSolve, solved, showHint }: LevelProps) {
  const [night, setNight] = useState(false);
  const [sunPos, setSunPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  function onDown(e: React.PointerEvent) {
    if (night) return;
    dragging.current = true;
    start.current = { x: e.clientX - sunPos.x, y: e.clientY - sunPos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    setSunPos({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  }
  function onUp() {
    if (!dragging.current) return;
    dragging.current = false;
    // 해를 충분히(>140px) 끌어내면 밤이 된다.
    if (Math.hypot(sunPos.x, sunPos.y) > 140) setNight(true);
    else setSunPos({ x: 0, y: 0 }); // 덜 끌었으면 제자리로
  }

  function tapOwl() {
    if (solved) return;
    if (night) onSolve();
  }

  return (
    <div className="stack">
      <div className={`scene ${night ? "night" : "day"}`}>
        {!night && (
          <div
            className="sun"
            style={{ transform: `translate(${sunPos.x}px, ${sunPos.y}px)` }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
          >
            ☀️
          </div>
        )}
        <button className="owl" onClick={tapOwl} aria-label="부엉이">
          {night ? "🦉" : "😴"}
        </button>
      </div>
      {showHint && <p className="hint-inline">부엉이는 밤에 깨요. 하늘에 떠 있는 걸 끌어내려 보세요.</p>}
    </div>
  );
}
