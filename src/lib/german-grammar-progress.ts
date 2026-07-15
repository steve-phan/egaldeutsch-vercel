export type GrammarChapterProgress = {
  readAt?: string;
  quizScore?: number;
  quizTotal?: number;
  quizPassedAt?: string;
};

export type GermanGrammarProgressState = {
  chapters: Record<string, GrammarChapterProgress>;
  lastReadSlug?: string;
  updatedAt: string;
};

export const GRAMMAR_PROGRESS_STORAGE_KEY = "egaldeutsch_grammar_progress";
export const GRAMMAR_TOTAL_CHAPTERS = 186;
export const GRAMMAR_QUIZ_PASS_RATIO = 0.75;

export function createEmptyGrammarProgress(): GermanGrammarProgressState {
  return {
    chapters: {},
    updatedAt: new Date().toISOString(),
  };
}

export function readLocalGrammarProgress(): GermanGrammarProgressState {
  if (typeof window === "undefined") {
    return createEmptyGrammarProgress();
  }

  try {
    const raw = window.localStorage.getItem(GRAMMAR_PROGRESS_STORAGE_KEY);
    if (!raw) return createEmptyGrammarProgress();
    const parsed = JSON.parse(raw) as GermanGrammarProgressState;
    return {
      chapters: parsed.chapters ?? {},
      lastReadSlug: parsed.lastReadSlug,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return createEmptyGrammarProgress();
  }
}

export function writeLocalGrammarProgress(state: GermanGrammarProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    GRAMMAR_PROGRESS_STORAGE_KEY,
    JSON.stringify({
      ...state,
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function mergeGrammarProgress(
  local: GermanGrammarProgressState,
  remote: GermanGrammarProgressState | null,
): GermanGrammarProgressState {
  if (!remote) return local;

  const chapters: Record<string, GrammarChapterProgress> = {
    ...remote.chapters,
  };

  for (const [slug, localEntry] of Object.entries(local.chapters)) {
    const remoteEntry = chapters[slug];
    if (!remoteEntry) {
      chapters[slug] = localEntry;
      continue;
    }

    chapters[slug] = {
      readAt:
        pickLatestIso(remoteEntry.readAt, localEntry.readAt) ??
        remoteEntry.readAt ??
        localEntry.readAt,
      quizPassedAt:
        pickLatestIso(remoteEntry.quizPassedAt, localEntry.quizPassedAt) ??
        remoteEntry.quizPassedAt ??
        localEntry.quizPassedAt,
      quizScore: Math.max(remoteEntry.quizScore ?? 0, localEntry.quizScore ?? 0),
      quizTotal: Math.max(remoteEntry.quizTotal ?? 0, localEntry.quizTotal ?? 0),
    };
  }

  return {
    chapters,
    lastReadSlug: remote.lastReadSlug || local.lastReadSlug,
    updatedAt: pickLatestIso(remote.updatedAt, local.updatedAt) ?? local.updatedAt,
  };
}

function pickLatestIso(first?: string, second?: string) {
  if (!first) return second;
  if (!second) return first;
  return new Date(first) >= new Date(second) ? first : second;
}

export function getGrammarProgressStats(state: GermanGrammarProgressState) {
  const entries = Object.values(state.chapters);
  const readCount = entries.filter((entry) => entry.readAt).length;
  const quizPassedCount = entries.filter((entry) => entry.quizPassedAt).length;

  return {
    readCount,
    quizPassedCount,
    total: GRAMMAR_TOTAL_CHAPTERS,
    readPercent: Math.round((readCount / GRAMMAR_TOTAL_CHAPTERS) * 100),
    quizPercent: Math.round((quizPassedCount / GRAMMAR_TOTAL_CHAPTERS) * 100),
  };
}

export function isChapterRead(
  state: GermanGrammarProgressState,
  slug: string,
) {
  return Boolean(state.chapters[slug]?.readAt);
}

export function isQuizPassed(
  state: GermanGrammarProgressState,
  slug: string,
) {
  return Boolean(state.chapters[slug]?.quizPassedAt);
}

export function mapServerGrammarProgress(
  payload: GermanGrammarProgressState,
): GermanGrammarProgressState {
  return {
    chapters: payload.chapters ?? {},
    lastReadSlug: payload.lastReadSlug,
    updatedAt: payload.updatedAt ?? new Date().toISOString(),
  };
}

export function toServerGrammarProgress(state: GermanGrammarProgressState) {
  return {
    chapters: state.chapters,
    lastReadSlug: state.lastReadSlug,
  };
}