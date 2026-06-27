# plans/

작업 단위 = plan 한 파일. frontmatter 가 상태의 **정본**.

```markdown
---
id: <short-kebab-id>
title: <제목>
status: draft | in_progress | applied | superseded | cancelled
created: 2026-06-27   # KST, 절대 날짜
---

## 배경 / 목적
## 설계
## 작업 항목
## 검증
```

격리: `status` 가 `applied` 면 `done/`, `superseded`/`cancelled` 면 `superseded/` 로 `git mv`
(같은 커밋에서). 갱신 순서: plan frontmatter → `TODO_STATUS.md` → `TODO_STATUS_LOG.md` → 파일 격리.
