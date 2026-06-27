# CODING_WORKBENCH — game001 정적 자산 인덱스

> 코드·운영 자산의 단일 인덱스. 새 모듈/CLI/도구/spec/plan/hook 추가 시 **같은 커밋에서** 본 문서를 갱신한다 (CLAUDE.md 「동기 갱신 의무」).
> 작업 진입 시 본 문서 + `docs/TODO_STATUS.md` 를 먼저 확인한다.

## Plans

| id | 제목 | status | 경로 |
|---|---|---|---|
| *(없음)* | | | |

격리 규칙: applied → `docs/plans/done/`, superseded/cancelled → `docs/plans/superseded/`.

## Modules / 코드

| 경로 | 역할 | 비고 |
|---|---|---|
| *(없음)* | | |

## CLI / 도구

| 명령 | 역할 | 비고 |
|---|---|---|
| *(없음)* | | |

## Spec

| spec | 다루는 범위 | 경로 |
|---|---|---|
| *(없음)* | | |

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
