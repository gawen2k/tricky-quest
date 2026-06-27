# CODING_WORKBENCH — game001 정적 자산 인덱스

> 코드·운영 자산의 단일 인덱스. 새 모듈/CLI/도구/spec/plan/hook 추가 시 **같은 커밋에서** 본 문서를 갱신한다 (CLAUDE.md 「동기 갱신 의무」).
> 작업 진입 시 본 문서 + `docs/TODO_STATUS.md` 를 먼저 확인한다.

## Plans

| id | 제목 | status | 경로 |
|---|---|---|---|
| tricky-quest-mvp | Tricky Quest — 웹 우선 PWA 두뇌 퍼즐 MVP | in_progress | [docs/plans/0001-tricky-quest-mvp.md](docs/plans/0001-tricky-quest-mvp.md) |

격리 규칙: applied → `docs/plans/done/`, superseded/cancelled → `docs/plans/superseded/`.

## Modules / 코드

| 경로 | 역할 | 비고 |
|---|---|---|
| `src/engine/` | 게임 엔진 — `types.ts`(정본 타입), `levels.ts`(레지스트리=진행순서), `progress.ts`(localStorage) | |
| `src/screens/` | 화면 — Home / Game / Win | |
| `src/levels/` | 트릭 레벨 = 파일 1개. 새 레벨은 `levels.ts` 에 한 줄 등록 | 현재 6개 |
| `src/components/Hud.tsx` | 진행바 + 힌트 + 재시작 HUD | |
| `tools/image-gen/` | AI 이미지 생성 파이프라인 (게임과 분리) | spec: image-pipeline |

## CLI / 도구

| 명령 | 역할 | 비고 |
|---|---|---|
| `npm run dev` / `build` / `preview` | Vite 개발/프로덕션 빌드/미리보기 | build = `tsc -b && vite build` |
| `npm run imagegen` (= `generate.ts`) | Replicate 이미지 생성 (`--dry-run` 토큰 불필요) | spec: image-pipeline |
| `tools/image-gen/refine-loop.sh "<브리프>"` | `claude -p` 프롬프트 설계 + 생성 반복 루프 | `DRY_RUN=1` 지원 |

## Spec

| spec | 다루는 범위 | 경로 |
|---|---|---|
| image-pipeline | AI 이미지 생성 파이프라인 규약·산출물·자격증명 | [docs/spec/image-pipeline.md](docs/spec/image-pipeline.md) |

## Ops / 스케줄러 / hook

| 자산 | 역할 | 비고 |
|---|---|---|
| `claude-rc-game001.service` (systemd --user, 호스트) | claude.ai 앱 Remote Control 서버 (`--name game001`, cwd `/home/ubuntu/game001`, `--spawn same-dir`) | 유닛은 repo 밖(`~/.config/systemd/user/`). 절차 → [docs/runbooks/remote-control-setup.md](docs/runbooks/remote-control-setup.md) |

## Runbooks

| 런북 | 다루는 범위 | 경로 |
|---|---|---|
| Remote Control 추가 | 새 프로젝트를 앱 목록에 추가 (systemd 유닛 + trust) | [docs/runbooks/remote-control-setup.md](docs/runbooks/remote-control-setup.md) |

## 외부 의존 / 자격증명

| 자원 | 용도 | 위치 |
|---|---|---|
| *(예정)* 이미지 생성 API | 풍경·캐릭터 원화 생성 | `.env` (git 제외) |
