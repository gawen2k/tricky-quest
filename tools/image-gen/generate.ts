// AI 이미지 생성 파이프라인 — 게임 코어와 분리된 도구.
// Replicate HTTP API 래퍼 (의존성 없이 global fetch 사용). 풍경·캐릭터 원화 생성.
//
// 사용:
//   node --experimental-strip-types tools/image-gen/generate.ts            # 실제 생성 (REPLICATE_API_TOKEN 필요)
//   node --experimental-strip-types tools/image-gen/generate.ts --dry-run  # 요청 페이로드만 출력 (토큰 불필요)
//   node --experimental-strip-types tools/image-gen/generate.ts --only bg-forest-dawn
//   node --experimental-strip-types tools/image-gen/generate.ts --config tools/image-gen/prompts.json
//
// 산출물:
//   out/images/<id>-<n>.<ext>  (대용량, git 제외)
//   out/meta/<id>.json         (prompt/seed/model/params — 추적 권장)
//
// 시각 표현은 KST. 메타의 createdAt 은 KST ISO 문자열로 기록한다.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

interface Job {
  id: string;
  kind: string;
  prompt: string;
  negative?: string;
  width?: number;
  height?: number;
  num_outputs?: number;
  seed?: number;
}

interface Config {
  model: string;
  defaults?: Partial<Job>;
  jobs: Job[];
}

const ROOT = process.cwd();
const OUT_IMG = join(ROOT, "out", "images");
const OUT_META = join(ROOT, "out", "meta");
const REPLICATE_API = "https://api.replicate.com/v1/predictions";
const POLL_MS = 2000;
const POLL_MAX = 150; // 약 5분 한도

function parseArgs(argv: string[]) {
  const a = { dryRun: false, only: undefined as string | undefined, config: "tools/image-gen/prompts.json" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") a.dryRun = true;
    else if (argv[i] === "--only") a.only = argv[++i];
    else if (argv[i] === "--config") a.config = argv[++i];
  }
  return a;
}

function nowKstIso(): string {
  // KST(UTC+9) 고정 오프셋. 라벨 없는 시각은 KST 규약.
  const t = new Date(Date.now() + 9 * 3600 * 1000);
  return t.toISOString().replace("Z", "+09:00");
}

function buildInput(job: Job, defaults: Partial<Job>) {
  const merged = { ...defaults, ...job };
  const input: Record<string, unknown> = {
    prompt: merged.prompt,
    num_outputs: merged.num_outputs ?? 1,
  };
  // flux 계열은 aspect_ratio/megapixels 를 선호하지만, 폭넓게 호환되도록 width/height 도 전달.
  if (merged.width) input.width = merged.width;
  if (merged.height) input.height = merged.height;
  if (merged.negative) input.negative_prompt = merged.negative;
  if (typeof merged.seed === "number") input.seed = merged.seed;
  return input;
}

async function createPrediction(model: string, input: Record<string, unknown>, token: string) {
  // model 이 "owner/name" 형식이면 모델 엔드포인트로 보낸다.
  const url = model.includes("/")
    ? `https://api.replicate.com/v1/models/${model}/predictions`
    : REPLICATE_API;
  const body = model.includes("/") ? { input } : { version: model, input };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait", // 가능하면 동기 응답
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`create 실패 ${res.status}: ${await res.text()}`);
  return (await res.json()) as Prediction;
}

interface Prediction {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string[] | string;
  error?: string;
  urls?: { get: string };
}

async function poll(pred: Prediction, token: string): Promise<Prediction> {
  let cur = pred;
  for (let i = 0; i < POLL_MAX; i++) {
    if (cur.status === "succeeded" || cur.status === "failed" || cur.status === "canceled") return cur;
    await new Promise((r) => setTimeout(r, POLL_MS));
    const res = await fetch(cur.urls!.get, { headers: { Authorization: `Bearer ${token}` } });
    cur = (await res.json()) as Prediction;
  }
  throw new Error(`폴링 타임아웃: ${cur.id}`);
}

async function download(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`다운로드 실패 ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
}

function extFromUrl(url: string): string {
  const m = url.match(/\.(png|jpg|jpeg|webp)(\?|$)/i);
  return m ? m[1].toLowerCase() : "png";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = JSON.parse(readFileSync(join(ROOT, args.config), "utf8")) as Config;
  const jobs = args.only ? cfg.jobs.filter((j) => j.id === args.only) : cfg.jobs;
  if (jobs.length === 0) {
    console.error(`일치하는 job 없음 (only=${args.only}).`);
    process.exit(1);
  }

  const token = process.env.REPLICATE_API_TOKEN ?? "";
  if (!args.dryRun && !token) {
    console.error("REPLICATE_API_TOKEN 미설정. .env 에 채우거나 --dry-run 으로 페이로드만 확인하세요.");
    process.exit(1);
  }

  if (!args.dryRun) {
    mkdirSync(OUT_IMG, { recursive: true });
    mkdirSync(OUT_META, { recursive: true });
  }

  for (const job of jobs) {
    const input = buildInput(job, cfg.defaults ?? {});
    if (args.dryRun) {
      console.log(`\n=== [DRY-RUN] ${job.id} (${job.kind}) ===`);
      console.log(`model: ${cfg.model}`);
      console.log(JSON.stringify({ input }, null, 2));
      continue;
    }

    console.log(`\n▶ 생성: ${job.id} (${job.kind})`);
    let pred = await createPrediction(cfg.model, input, token);
    pred = await poll(pred, token);
    if (pred.status !== "succeeded") {
      console.error(`✗ ${job.id} 실패: ${pred.error ?? pred.status}`);
      continue;
    }
    const outputs = Array.isArray(pred.output) ? pred.output : pred.output ? [pred.output] : [];
    const files: string[] = [];
    for (let n = 0; n < outputs.length; n++) {
      const ext = extFromUrl(outputs[n]);
      const dest = join(OUT_IMG, `${job.id}-${n}.${ext}`);
      await download(outputs[n], dest);
      files.push(dest);
      console.log(`  ✓ ${dest}`);
    }
    const meta = {
      id: job.id,
      kind: job.kind,
      model: cfg.model,
      input,
      predictionId: pred.id,
      files: files.map((f) => f.replace(ROOT + "/", "")),
      createdAt: nowKstIso(),
    };
    writeFileSync(join(OUT_META, `${job.id}.json`), JSON.stringify(meta, null, 2));
    console.log(`  ✓ meta: out/meta/${job.id}.json`);
  }

  if (args.dryRun) console.log("\n(dry-run 완료 — 실제 호출/저장 없음)");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
