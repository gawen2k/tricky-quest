# game001

> 이 문서는 FS2의 범용 작업 워크플로를 정제해 옮긴 것이다. 도메인(게임) 내용은 비어 있으며,
> 프로젝트가 구체화되면 「목적」·「아키텍처」·「코드 스타일」 섹션을 사용자가 채운다.

---

# 목적

*(작성 예정 — 사용자 확정 필요)*

게임 개발 프로젝트. 초기 구성요소로 **AI 이미지 생성 파이프라인**(풍경·캐릭터 원화)을
외부 이미지 생성 API(예: Replicate)로 구축하고, `claude -p`가 프롬프트·파라미터·반복 루프를
지휘하는 형태를 검토 중. → 확정 시 본 섹션을 정본으로 갱신.

핵심 원칙(향후 채움): 이 프로젝트의 "하지 말 것"·"항상 할 것"을 여기 박는다.
한 번 박힌 핵심 원칙은 인터페이스·편의로 우회하지 않는다.

---

# 작업 진입 / 동기 의무 (CODING_WORKBENCH)

본 프로젝트의 정적 자산 인덱스 = [CODING_WORKBENCH.md](CODING_WORKBENCH.md).
사람용 작업 목록 = [docs/TODO.md](docs/TODO.md).
Claude 조회 캐시 = [docs/TODO_STATUS.md](docs/TODO_STATUS.md) (현재 상태 표) +
[docs/TODO_STATUS_LOG.md](docs/TODO_STATUS_LOG.md) (append-only 이력).
정본은 각 plan 의 frontmatter.

## 작업 진입 시

1. 첫 응답에서 `CODING_WORKBENCH.md` + `docs/TODO_STATUS.md` 확인 흔적 명시
   ("X 항목 발견 / 관련 항목 없음").
2. 없으면 grep / Glob / Explore.
3. grep 으로 찾은 항목은 그 자리에서 WORKBENCH 에 추가 (drift 자동 복구).

## 작업 상태 조회

- "작업 목록 / 상태 보여줘" → `docs/TODO_STATUS.md` 표만 읽고 답변 (기본 경로).
- "X 작업 이력 / 어디까지" → `docs/TODO_STATUS_LOG.md` id grep 후 시간순.
- **사용자가 "직접 찾아봐"** → 캐시는 차단막 아님. plan 본문 / git log / 코드 grep /
  WORKBENCH↔디렉터리 대조까지 확인. 캐시 ↔ 정본 다르면 정본 신뢰 + 캐시 갱신.

## 동기 갱신 의무 (같은 커밋)

기준 (B): 새 모듈 / CLI / 도구 / 설정 자산 / spec / plan / hook 추가 시.

- **A. plan 상태 변화만**: plan frontmatter (정본) → `TODO_STATUS.md` id 줄 덮어쓰기
  → `TODO_STATUS_LOG.md` 한 줄 append. **applied/superseded/cancelled 로 바뀌면
  같은 커밋에서 파일을 격리 디렉터리로 `git mv`** (D 참조).
- **B. 신규/폐기 plan**: A + `docs/TODO.md` 갱신 + `CODING_WORKBENCH.md` Plans 섹션.
- **C. 신규 운영 자산** (plan 없는 변경): `CODING_WORKBENCH.md` 관련 섹션 +
  (해당되면) 관련 spec.
- **D. plan 격리** (status=applied/superseded/cancelled 마킹 시 의무):
  - applied → `git mv docs/plans/<file>.md docs/plans/done/<file>.md`
  - superseded/cancelled → `git mv docs/plans/<file>.md docs/plans/superseded/<file>.md`
  - 참조 경로 일괄 갱신: `grep -rln "<plan-basename>"` 결과를 새 경로로 치환.

갱신 순서 강제: **plan frontmatter → STATUS → LOG → 파일 격리(D)**.

제외: 버그 수정, 내부 리팩터, 테스트 추가, 의존성 bump, 문서 오탈자.

---

# 시각 표현 단위 — KST 통일

이 프로젝트의 모든 시각 표현은 **KST(Asia/Seoul)** 로 통일한다.

- **대화·문서·plan·spec·메모리·CLI 출력·로그**: KST. 별도 라벨 없음.
- **UTC 가 필요한 곳은 명시 의무**: `09:00 UTC` 또는 `2026-06-27T00:00:00Z`.
  라벨 없는 시각은 KST로 해석한다.
- **코드의 datetime 객체**: KST aware. naive / UTC-naive 신규 등장 금지.
- **DB 저장 시**(도입한다면): TIMESTAMPTZ 로 절대 시점 보장, 표시는 KST 변환.
- **예외 — 거시/외부 자료**: 원본 시간대 + KST 병기 (`14:00 ET / 04:00 KST`).

상대 날짜("어제", "다음 주")는 문서·plan·메모리에 박을 때 **절대 날짜로 변환**한다.

---

# Spec 인덱스

세부 설계·규약·운영 디테일은 [docs/spec/](docs/spec/) 아래 분리한다.
작업 시작 전 관련 spec을 읽고 들어갈 것. 각 spec 첫 줄에 트리거 키워드와 cross-reference를
두어 한 spec만 읽다 다른 제약을 놓치는 사고를 방지한다.

전체 spec / plan / 운영 자산 인덱스 = [CODING_WORKBENCH.md](CODING_WORKBENCH.md).

*(아직 spec 없음 — 첫 spec 작성 시 본 인덱스에 추가)*

---

# 메모리

영속 메모리는 `~/.claude/projects/<project-slug>/memory/` 에 파일 단위로 둔다 (FS2와 동일 규약).
프로젝트 고유의 비자명한 사실(왜 이렇게 했는지, 사용자 선호, 진행 맥락)만 저장하고,
코드·git 이력으로 알 수 있는 것은 저장하지 않는다.

---

# 코드 스타일

*(작성 예정 — 기술 스택 확정 후)* 주변 코드의 주석 밀도·네이밍·관용구를 따른다.
