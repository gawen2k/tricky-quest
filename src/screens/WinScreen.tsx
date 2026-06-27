// 클리어 화면. 사용한 힌트 수 기준 간단 등급.
interface WinProps {
  total: number;
  hintsUsed: number;
  onReplay: () => void;
}

function grade(total: number, hints: number): string {
  if (hints === 0) return "★★★ 천재";
  if (hints <= total / 2) return "★★ 영리함";
  return "★ 클리어";
}

export default function WinScreen({ total, hintsUsed, onReplay }: WinProps) {
  return (
    <div className="screen win">
      <div className="logo">🏆</div>
      <h1 className="title">전부 클리어!</h1>
      <p className="subtitle">{grade(total, hintsUsed)}</p>
      <p className="muted">사용한 힌트: {hintsUsed}개</p>
      <button className="btn primary big" onClick={onReplay}>다시 하기</button>
    </div>
  );
}
