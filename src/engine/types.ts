// 게임 엔진 타입 — 정본. 레벨/진행 구조 변경은 여기서 시작한다.
import type { ComponentType } from "react";

// 레벨 컴포넌트가 받는 props. 정답 판정은 레벨 내부에서 하고 onSolve() 를 부른다.
export interface LevelProps {
  onSolve: () => void;
  solved: boolean;
  // 힌트 표시 토글 (HUD 의 힌트 버튼이 제어). 레벨이 추가 시각 단서를 줄 때 사용.
  showHint: boolean;
}

export interface LevelDef {
  id: string;
  title: string;
  // 플레이어에게 보이는 문제 문구 (이 자체가 함정인 경우가 많다).
  prompt: string;
  // 막혔을 때 펼치는 힌트 텍스트.
  hint: string;
  Component: ComponentType<LevelProps>;
}

// localStorage 에 저장되는 진행 상태.
export interface Progress {
  // 클리어한 레벨 id 집합.
  cleared: string[];
  // 현재 도달한 레벨 인덱스 (레지스트리 기준).
  current: number;
  // 누적 힌트 사용 횟수 (점수 산정용).
  hintsUsed: number;
}
