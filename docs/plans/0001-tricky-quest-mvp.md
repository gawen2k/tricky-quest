---
id: tricky-quest-mvp
title: Tricky Quest — 웹 우선 PWA 두뇌 퍼즐 MVP
status: in_progress
created: 2026-06-27
---

## 배경 / 목적

모바일·웹 양쪽에서 플레이 가능한 **brain puzzle / tricky quest** 류 게임 (참고: The Tricky
Test, Brain Out, Stump Me). 함정·말장난·발상의 전환 퍼즐이 핵심이며, 무거운 3D 에셋이 아니라
텍스트 + 가벼운 UI 인터랙션 중심.

사용자 확정 사항 (2026-06-27):
- 기술 스택: **웹 우선 + PWA** (단일 코드베이스로 웹/모바일 브라우저, 홈 화면 설치).
- 범위: **플레이 가능한 MVP** — 엔진 + 레벨 데이터 구조 + 트릭 레벨 6~8개 + 진행/점수 저장.
- AI 이미지 생성 파이프라인: **지금 같이** 구축 (풍경·캐릭터 원화, Replicate 등 외부 API + `claude -p` 반복 루프).

## 설계

### 기술 스택
- Vite + React 18 + TypeScript.
- PWA: `vite-plugin-pwa` (manifest + service worker, 오프라인 캐시).
- 진행도 영속화: `localStorage` (외부 의존 없음).
- 입력: 마우스 + 터치 동시 대응. 모바일 우선 반응형 CSS.

### 디렉터리
```
index.html
package.json / tsconfig.json / vite.config.ts
src/
  main.tsx            진입점
  App.tsx             화면 라우팅(Home / Game / Win)
  engine/
    types.ts          Level/GameState 타입 (정본)
    levels.ts         레벨 레지스트리 (순서 = 진행 순서)
    progress.ts       localStorage 진행/점수 저장
  components/         공용 UI (HUD, HintButton, ResetButton)
  screens/            HomeScreen, GameScreen, WinScreen
  levels/             트릭 레벨 1개 = 파일 1개 (LevelXxx.tsx)
  styles.css
public/
  manifest.webmanifest, 아이콘
tools/image-gen/      AI 이미지 생성 파이프라인 (게임과 분리)
```

### 레벨 인터페이스
각 레벨은 `LevelComponent` (props: `onSolve()`, `solved`) 를 구현. 정답 판정은 레벨 내부에서
하고 `onSolve()` 호출. 레지스트리는 `{ id, title, prompt, hint, Component }` 배열.

### MVP 트릭 레벨 (6개)
1. **Stroop** — "빨간 것을 탭" / 잉크 색 기준 (글자 뜻 함정).
2. **largest-animal** — 크게 렌더된 개미 vs 작게 렌더된 코끼리, 실제 크기 기준.
3. **count-trick** — 화면 밖/겹친 항목까지 세기 (스크롤·드래그로 발견).
4. **question-is-answer** — "이 문장의 세 번째 단어는?" 정답이 문제문 안에 있음.
5. **hidden-switch** — 해/구름을 드래그로 치워 밤을 만들고 부엉이를 깨우기.
6. **riddle-input** — "사과 3개 중 2개를 가져가면 너에게 몇 개?" → 2 (텍스트 입력).

### AI 이미지 파이프라인 (tools/image-gen/)
- Replicate HTTP API 래퍼 (`fetch` 기반, 자격증명 `.env` → `REPLICATE_API_TOKEN`).
- 프롬프트 설정(JSON) + 생성 루프 + 메타(prompt/seed/params) JSON 저장(추적), 이미지 바이너리는 `out/`(git 제외).
- `claude -p` 반복 루프: 프롬프트 개선·결과 평가를 지휘하는 래퍼 스크립트 (런북/스크립트로 문서화).
- 자세한 규약은 spec `image-pipeline` 으로 분리.

## 작업 항목
- [x] Vite+React+TS 스캐폴드 + PWA (manifest + SW 생성 확인)
- [x] 엔진 (types/levels/progress)
- [x] 화면 (Home/Game/Win) + 공용 UI(HUD)
- [x] 트릭 레벨 6개
- [x] 이미지 파이프라인 (tools/image-gen) + spec
- [x] 빌드 확인 (`npm run build` 무오류) / preview 구동·매니페스트 검증
- [x] WORKBENCH / TODO / STATUS / LOG 동기 갱신
- [ ] (후속) 브라우저 인터랙션 수동 검증 — `/verify` 또는 `/run`
- [ ] (후속) Replicate 토큰 실투입 1라운드 생성

## 검증
- `npm run build` 무오류.
- `npm run dev` 로 6개 레벨 끝까지 클리어 → Win 화면, 진행도 localStorage 유지.
- 모바일 폭(375px)에서 레이아웃·터치 동작.
- 이미지 파이프라인: 토큰 없이 dry-run(프롬프트·요청 페이로드 출력)까지 동작.
