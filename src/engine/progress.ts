// 진행도 영속화 — localStorage. 외부 의존 없음.
import type { Progress } from "./types";

const KEY = "game001:progress:v1";

const EMPTY: Progress = { cleared: [], current: 0, hintsUsed: 0 };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      cleared: Array.isArray(parsed.cleared) ? parsed.cleared : [],
      current: typeof parsed.current === "number" ? parsed.current : 0,
      hintsUsed: typeof parsed.hintsUsed === "number" ? parsed.hintsUsed : 0,
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // 사생활 모드 등 저장 실패는 무시 (세션 내 진행은 메모리로 유지).
  }
}

export function resetProgress(): Progress {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
  return { ...EMPTY };
}
