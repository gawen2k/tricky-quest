# spec: image-pipeline

> 트리거 키워드: 이미지 생성, AI 원화, Replicate, 풍경/캐릭터 아트, `tools/image-gen`, 프롬프트 루프.
> Cross-ref: 자격증명 → [.env.example](../../.env.example) / 인덱스 → [CODING_WORKBENCH.md](../../CODING_WORKBENCH.md) /
> 시각 규약(KST) → [CLAUDE.md](../../CLAUDE.md).

게임용 풍경·캐릭터 원화를 외부 이미지 생성 API로 만드는 파이프라인. 게임 코어(`src/`)와 분리.

## 구성

| 파일 | 역할 |
|---|---|
| `tools/image-gen/prompts.json` | 생성 작업 정의 (model / defaults / jobs[]) |
| `tools/image-gen/generate.ts` | Replicate HTTP 래퍼 — 생성·폴링·다운로드·메타 기록 (`--dry-run` 지원) |
| `tools/image-gen/refine-loop.sh` | `claude -p` 가 브리프→프롬프트 설계, generate 호출, 결과 비평하는 반복 루프 |

## 산출물 규약

- 이미지 바이너리: `out/images/<id>-<n>.<ext>` — **대용량, git 제외** (`.gitignore` 의 `out/`).
- 메타: `out/meta/<id>.json` — prompt/seed/model/input/predictionId/`createdAt`(KST ISO). **추적 권장**
  (재현성·라이선스 추적). `out/` 가 통째로 ignore 되므로 보존하려면 별도 경로(`assets/meta/` 등)로 복사.

## 자격증명

- `REPLICATE_API_TOKEN` — `.env` (git 제외). 미설정 시 `generate.ts` 는 `--dry-run` 만 허용.

## 사용

```bash
# 페이로드만 확인 (토큰 불필요)
node --experimental-strip-types tools/image-gen/generate.ts --dry-run
# 실제 생성 (.env 토큰 필요)
node --experimental-strip-types tools/image-gen/generate.ts
node --experimental-strip-types tools/image-gen/generate.ts --only char-sage-owl
# claude -p 반복 루프 (프롬프트 설계 + 생성)
tools/image-gen/refine-loop.sh "황혼의 마법 숲과 현명한 부엉이 마스코트"
DRY_RUN=1 tools/image-gen/refine-loop.sh "..."   # 생성 없이 설계+페이로드만
```

## 모델 교체

`prompts.json` 의 `model` 이 `owner/name` 형식이면 모델 엔드포인트, 단일 해시면 버전 엔드포인트로
요청한다(`generate.ts:createPrediction`). 기본값은 `black-forest-labs/flux-schnell`(빠르고 저렴).
품질이 필요하면 flux-dev / sdxl 등으로 교체.

## 게임 자산 연결 (후속)

생성물을 게임에서 쓸 때는 `public/assets/` 로 선별 복사하고 레벨/배경에서 참조한다. 현재 MVP는
이모지·SVG로 충분하므로 자동 연결은 두지 않는다.
