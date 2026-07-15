"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { API_ROUTES } from "@/lib/constants";
import { useApiClient } from "@/hooks/use-api-client";
import {
  GRAMMAR_QUIZ_PASS_RATIO,
  type GermanGrammarProgressState,
  type GrammarChapterProgress,
  createEmptyGrammarProgress,
  getGrammarProgressStats,
  isChapterRead,
  isQuizPassed,
  mapServerGrammarProgress,
  mergeGrammarProgress,
  readLocalGrammarProgress,
  toServerGrammarProgress,
  writeLocalGrammarProgress,
} from "@/lib/german-grammar-progress";

type GrammarProgressContextValue = {
  progress: GermanGrammarProgressState;
  isLoading: boolean;
  isSynced: boolean;
  stats: ReturnType<typeof getGrammarProgressStats>;
  markChapterRead: (slug: string) => void;
  markQuizResult: (slug: string, score: number, total: number) => void;
  isChapterRead: (slug: string) => boolean;
  isQuizPassed: (slug: string) => boolean;
};

const GrammarProgressContext = createContext<GrammarProgressContextValue | null>(
  null,
);

export function GermanGrammarProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isSessionLoading, request } = useApiClient();
  const { status } = useSession();
  const [progress, setProgress] = useState<GermanGrammarProgressState>(
    createEmptyGrammarProgress,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const persist = useCallback(
    (next: GermanGrammarProgressState, syncRemote = true) => {
      const stamped = {
        ...next,
        updatedAt: new Date().toISOString(),
      };
      setProgress(stamped);
      writeLocalGrammarProgress(stamped);

      if (!syncRemote || !isAuthenticated) return;

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await request(API_ROUTES.GRAMMAR_PROGRESS, {
            method: "PUT",
            json: true,
            body: JSON.stringify(toServerGrammarProgress(stamped)),
          });
          if (response.ok) {
            const payload = mapServerGrammarProgress(await response.json());
            setProgress(payload);
            writeLocalGrammarProgress(payload);
            setIsSynced(true);
          }
        } catch {
          setIsSynced(false);
        }
      }, 600);
    },
    [isAuthenticated, request],
  );

  useEffect(() => {
    const local = readLocalGrammarProgress();
    setProgress(local);
    setIsLoading(false);

    if (status === "loading") return;

    if (!isAuthenticated) {
      setIsSynced(false);
      return;
    }

    (async () => {
      try {
        const response = await request(API_ROUTES.GRAMMAR_PROGRESS);
        if (!response.ok) return;
        const remote = mapServerGrammarProgress(await response.json());
        const merged = mergeGrammarProgress(local, remote);
        setProgress(merged);
        writeLocalGrammarProgress(merged);
        setIsSynced(true);

        if (JSON.stringify(merged.chapters) !== JSON.stringify(remote.chapters)) {
          await request(API_ROUTES.GRAMMAR_PROGRESS, {
            method: "PUT",
            json: true,
            body: JSON.stringify(toServerGrammarProgress(merged)),
          });
        }
      } catch {
        setIsSynced(false);
      }
    })();
  }, [isAuthenticated, request, status]);

  const updateChapter = useCallback(
    (slug: string, patch: Partial<GrammarChapterProgress>) => {
      const current = progressRef.current;
      const existing = current.chapters[slug] ?? {};
      const next: GermanGrammarProgressState = {
        ...current,
        lastReadSlug: slug,
        chapters: {
          ...current.chapters,
          [slug]: {
            ...existing,
            ...patch,
          },
        },
      };
      persist(next);
    },
    [persist],
  );

  const markChapterRead = useCallback(
    (slug: string) => {
      if (isChapterRead(progressRef.current, slug)) return;
      updateChapter(slug, { readAt: new Date().toISOString() });
    },
    [updateChapter],
  );

  const markQuizResult = useCallback(
    (slug: string, score: number, total: number) => {
      const passed = total > 0 && score / total >= GRAMMAR_QUIZ_PASS_RATIO;
      updateChapter(slug, {
        quizScore: score,
        quizTotal: total,
        ...(passed ? { quizPassedAt: new Date().toISOString() } : {}),
      });
    },
    [updateChapter],
  );

  const value = useMemo(
    () => ({
      progress,
      isLoading: isLoading || isSessionLoading,
      isSynced,
      stats: getGrammarProgressStats(progress),
      markChapterRead,
      markQuizResult,
      isChapterRead: (slug: string) => isChapterRead(progress, slug),
      isQuizPassed: (slug: string) => isQuizPassed(progress, slug),
    }),
    [progress, isLoading, isSessionLoading, isSynced, markChapterRead, markQuizResult],
  );

  return (
    <GrammarProgressContext.Provider value={value}>
      {children}
    </GrammarProgressContext.Provider>
  );
}

export function useGermanGrammarProgress() {
  const context = useContext(GrammarProgressContext);
  if (!context) {
    throw new Error(
      "useGermanGrammarProgress must be used within GermanGrammarProgressProvider",
    );
  }
  return context;
}