#!/usr/bin/env bash
# AI 이미지 프롬프트 반복 루프 — `claude -p` 가 프롬프트를 짓고 다듬는다.
#
# 흐름:
#   1) 브리프(테마 한 줄)를 받아 claude -p 로 prompts.json 을 생성/갱신
#   2) generate.ts 로 이미지 생성 (또는 --dry-run)
#   3) (선택) claude -p 로 결과 메타를 비평 → 다음 라운드 프롬프트 개선
#
# 사용:
#   tools/image-gen/refine-loop.sh "황혼의 마법 숲과 현명한 부엉이 마스코트"
#   DRY_RUN=1 tools/image-gen/refine-loop.sh "..."     # 실제 생성 없이 페이로드만
#
# 전제: claude CLI 로그인, .env 의 REPLICATE_API_TOKEN(실제 생성 시).
# 시각 표현은 KST 규약(CLAUDE.md).
set -euo pipefail

BRIEF="${1:-}"
if [[ -z "$BRIEF" ]]; then
  echo "사용법: $0 \"<이미지 브리프 한 줄>\"" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CONFIG="$ROOT/tools/image-gen/prompts.json"

# .env 로드 (있으면)
if [[ -f "$ROOT/.env" ]]; then set -a; source "$ROOT/.env"; set +a; fi

echo "▶ [1/2] claude -p 로 프롬프트 설계 → $CONFIG"
PROMPT_INSTRUCTION=$(cat <<EOF
너는 게임용 AI 이미지 생성 프롬프트 설계자다. 아래 브리프에 맞춰
$CONFIG 파일을 갱신해라. 스키마는 기존 파일을 따른다:
{ "model": "...", "defaults": {...}, "jobs": [ {id, kind, prompt, width, height} ] }
- kind 는 "landscape" 또는 "character".
- prompt 는 영어, 게임 아트 스타일, "no text" 포함, 구체적 조명/구도 묘사.
- 풍경은 16:9(1280x720), 캐릭터는 정사각(768x768) 권장.
브리프: $BRIEF
파일을 직접 수정하고, 무엇을 바꿨는지 1~2줄로 요약해라.
EOF
)
claude -p "$PROMPT_INSTRUCTION"

echo "▶ [2/2] 이미지 생성"
GEN=(node --experimental-strip-types "$ROOT/tools/image-gen/generate.ts" --config "$CONFIG")
if [[ "${DRY_RUN:-0}" == "1" ]]; then
  "${GEN[@]}" --dry-run
else
  "${GEN[@]}"
  echo "▶ (선택) 결과 비평을 원하면:"
  echo "    claude -p \"out/meta/*.json 의 프롬프트를 보고 다음 라운드 개선점을 제안해라\""
fi

echo "✓ 라운드 완료."
