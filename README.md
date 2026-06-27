# game001 — Tricky Quest

머리를 비트는 **함정 퍼즐**(brain puzzle / tricky quest) 게임. 웹 우선 + PWA로 모바일/웹 브라우저 양쪽에서 플레이.

- 스택: Vite + React + TypeScript, `vite-plugin-pwa` (홈 화면 설치/오프라인), 진행도는 localStorage.
- 구조: 레벨 1개 = `src/levels/` 컴포넌트 1개. `src/engine/levels.ts` 배열 순서가 진행 순서.
- AI 이미지 생성 파이프라인(풍경·캐릭터 원화): `tools/image-gen/` — spec [docs/spec/image-pipeline.md](docs/spec/image-pipeline.md).

## 실행

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드 (tsc + vite + PWA)
npm run preview   # 빌드 결과 미리보기 (--host)
```

## AI 이미지 생성

```bash
npm run imagegen -- --dry-run     # 페이로드만 (토큰 불필요)
npm run imagegen                  # 실제 생성 (.env 의 REPLICATE_API_TOKEN 필요)
tools/image-gen/refine-loop.sh "<이미지 브리프>"   # claude -p 프롬프트 설계 + 생성 루프
```

## 작업 규약

이 저장소는 Claude(claude -p)와 함께 작업한다. 작업 워크플로·규약은 [CLAUDE.md](CLAUDE.md) 참조:

- 정적 자산 인덱스: [CODING_WORKBENCH.md](CODING_WORKBENCH.md)
- 작업 큐: [docs/TODO.md](docs/TODO.md) (상태 캐시: [docs/TODO_STATUS.md](docs/TODO_STATUS.md))
- 작업 단위 plan: [docs/plans/](docs/plans/)
- 설계 spec: [docs/spec/](docs/spec/)

## 셋업

```bash
cp .env.example .env   # API 키 등 채우기
```

시각 표현은 모두 **KST** 기준 (CLAUDE.md 「시각 표현 단위」).
