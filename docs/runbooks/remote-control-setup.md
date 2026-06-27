# 런북 — 새 프로젝트를 claude.ai 앱(Remote Control)에 추가

> 트리거: "앱 프로젝트 목록에 새 프로젝트(game002 등)가 안 뜬다 / 추가하고 싶다".
> 관련: 호스트 인프라(OCI fs2-vcn). systemd `--user` 서비스 + `~/.claude.json` trust.

## 핵심 원리

claude.ai 모바일/웹 앱의 **"프로젝트" = `claude remote-control`이 실행 중인 디렉터리**다.
앱 헤더 `<host>:<project>:<session>` 의 project 는 `--name` 값.
프로젝트를 추가하려면 **그 디렉터리에서 remote-control 인스턴스를 하나 더 띄운다**
(systemd `--user` 서비스로 영속화 + 재부팅 생존).

기준: FS2 = `claude-rc.service` (cwd `/home/ubuntu/FS2`, `--name fs2`, `--spawn worktree`).
game001 = `claude-rc-game001.service` (cwd `/home/ubuntu/game001`, `--name game001`, `--spawn same-dir`).

`--spawn` 선택: 라이브 스케줄러·공유 DB 와 충돌 위험이 있으면 `worktree`(FS2),
단순 프로젝트면 `same-dir`(game001).

## 절차 (game002 추가 예시)

1. **유닛 파일 복제** — `~/.config/systemd/user/claude-rc-game002.service`
   ([claude-rc-game001.service](#) 복사 후 `game001`→`game002`, `WorkingDirectory`,
   `--name`, 로그 경로 치환). 로그 디렉터리 `mkdir -p /home/ubuntu/game002/state`.

2. **워크스페이스 trust 등록** (필수 — 안 하면 `Error: Workspace not trusted` 로 flapping):
   ```bash
   python3 - <<'PY'
   import json, os, tempfile
   p='/home/ubuntu/.claude.json'
   d=json.load(open(p))
   d.setdefault('projects',{}).setdefault('/home/ubuntu/game002',{})['hasTrustDialogAccepted']=True
   fd,tmp=tempfile.mkstemp(dir='/home/ubuntu')
   with os.fdopen(fd,'w') as f: json.dump(d,f,indent=2)
   os.replace(tmp,p)
   PY
   ```
   (편집 전 `cp ~/.claude.json ~/.claude.json.bak.before_game002` 권장.)

3. **기동**:
   ```bash
   systemctl --user daemon-reload
   systemctl --user enable --now claude-rc-game002.service
   ```

4. **확인** — `state/rc.log` 에 `✔︎ Connected · game002 · <branch>` 가 찍히면 성공.
   앱에서 호스트 목록 새로고침 → 새 프로젝트가 뜬다.

## 함정 / 주의

- **trust 누락이 1순위 실패 원인**. flapping(`status=1/FAILURE` 10초마다 재시작) +
  `state/rc.err.log` 에 `Workspace not trusted` 면 2번 절차 누락. trust 등록 전
  서비스를 `stop` 하고 json 편집 후 `start` (flapping 중 편집 레이스 방지).
- `rc.err.log` 는 append 모드 → trust 등록 **전** 에러 줄이 그대로 남는다.
  성공 판정은 `rc.log` 의 `Connected` 로 한다(에러 로그 잔존 ≠ 현재 실패).
- 서비스는 `enable` 시 재부팅 자동 기동. 관리:
  `systemctl --user {restart,stop,status} claude-rc-game001`.

## 이력

- 2026-06-27: game001 추가 (`claude-rc-game001.service`, `--spawn same-dir`).
  trust 미등록으로 1차 flapping → `~/.claude.json` trust 등록으로 해결.
