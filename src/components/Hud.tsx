// 레벨 상단 HUD: 진행 표시 + 힌트 토글 + 재시작.
interface HudProps {
  index: number;
  total: number;
  hintOpen: boolean;
  onToggleHint: () => void;
  onRestart: () => void;
}

export default function Hud({ index, total, hintOpen, onToggleHint, onRestart }: HudProps) {
  return (
    <div className="hud">
      <button className="icon-btn" onClick={onRestart} aria-label="처음으로">↺</button>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${(index / total) * 100}%` }} />
        <span className="progress-label">{index + 1} / {total}</span>
      </div>
      <button
        className={`icon-btn ${hintOpen ? "active" : ""}`}
        onClick={onToggleHint}
        aria-label="힌트"
      >
        💡
      </button>
    </div>
  );
}
