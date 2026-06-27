// 시작 화면. 새 게임 / 이어하기.
interface HomeProps {
  hasProgress: boolean;
  onStart: () => void;
  onContinue: () => void;
}

export default function HomeScreen({ hasProgress, onStart, onContinue }: HomeProps) {
  return (
    <div className="screen home">
      <div className="logo">🧠</div>
      <h1 className="title">Tricky Quest</h1>
      <p className="subtitle">머리를 비트는 함정 퍼즐</p>
      <div className="menu">
        {hasProgress && (
          <button className="btn primary big" onClick={onContinue}>이어하기</button>
        )}
        <button className={`btn big ${hasProgress ? "" : "primary"}`} onClick={onStart}>
          새 게임
        </button>
      </div>
    </div>
  );
}
