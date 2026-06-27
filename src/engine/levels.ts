// 레벨 레지스트리 — 배열 순서 = 진행 순서. 새 트릭 레벨은 여기 한 줄 추가하면 자동 편입.
import type { LevelDef } from "./types";
import LevelStroop from "../levels/LevelStroop";
import LevelLargestAnimal from "../levels/LevelLargestAnimal";
import LevelCountTrick from "../levels/LevelCountTrick";
import LevelQuestionIsAnswer from "../levels/LevelQuestionIsAnswer";
import LevelHiddenSwitch from "../levels/LevelHiddenSwitch";
import LevelRiddleInput from "../levels/LevelRiddleInput";

export const LEVELS: LevelDef[] = [
  {
    id: "stroop",
    title: "빨간 것을 탭",
    prompt: "빨간 것을 탭하세요.",
    hint: "글자의 뜻이 아니라 '색'을 보세요.",
    Component: LevelStroop,
  },
  {
    id: "largest-animal",
    title: "가장 큰 동물",
    prompt: "가장 큰 동물을 탭하세요.",
    hint: "그려진 크기는 함정. 실제 크기를 떠올려요.",
    Component: LevelLargestAnimal,
  },
  {
    id: "count-trick",
    title: "사과 세기",
    prompt: "사과는 모두 몇 개일까요?",
    hint: "상자 안을 끝까지 스크롤하세요.",
    Component: LevelCountTrick,
  },
  {
    id: "question-is-answer",
    title: "세 번째 단어",
    prompt: "이 문장에서 세 번째 단어를 입력하세요.",
    hint: "정답은 문제 문장 안에 있어요.",
    Component: LevelQuestionIsAnswer,
  },
  {
    id: "hidden-switch",
    title: "부엉이 깨우기",
    prompt: "잠든 부엉이를 깨우세요.",
    hint: "낮을 밤으로 바꿔야 해요.",
    Component: LevelHiddenSwitch,
  },
  {
    id: "riddle-input",
    title: "사과 수수께끼",
    prompt: "사과 3개 중 2개를 가져갔어요. 당신에게 몇 개 있나요?",
    hint: "'가져갔다' = '내가 가졌다'.",
    Component: LevelRiddleInput,
  },
];
