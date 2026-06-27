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
      <h1 className="title">game001</h1>
      <p className="subtitle">머리를 쓰는 찾기·퍼즐</p>
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
