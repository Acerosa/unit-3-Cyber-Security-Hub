import { PRACTICE_QUESTIONS } from "./practice-questions";
import {
  awardMarks,
  emptySitting,
  finaliseMarks,
  learnerView,
  saveResponses,
  startSitting,
  submitSitting,
  type MockSitting
} from "./policy";

export type WritingAnswer = {
  original: string;
  revised: string;
  missing: string;
  guidanceViewed: boolean;
};

export type WritingDraft = {
  answers: Record<string, WritingAnswer>;
  updatedAt: string | null;
  completed: boolean;
};

export type ReflectionDraft = {
  topic: string;
  command: string;
  time: string;
  improve: string;
  revise: string;
  submittedAt: string | null;
};

export type ExamSnapshot = {
  writing: WritingDraft;
  mock: MockSitting;
  reflection: ReflectionDraft;
  serverNow: string;
};

export type ExamStore = {
  load: () => ExamSnapshot;
  saveWriting: (answers: Record<string, WritingAnswer>) => ExamSnapshot;
  startMock: () => ExamSnapshot;
  saveMock: (responses: Record<string, string>) => ExamSnapshot;
  submitMock: (method: "manual" | "automatic") => ExamSnapshot;
  saveReflection: (draft: Omit<ReflectionDraft, "submittedAt"> & { submittedAt?: string | null }) => ExamSnapshot;
  award: (awarded: Record<string, number>, feedback: Record<string, string>) => MockSitting;
  finalise: () => MockSitting;
};

const emptyWriting = (): WritingDraft => ({ answers: {}, updatedAt: null, completed: false });
const emptyReflection = (): ReflectionDraft => ({
  topic: "",
  command: "",
  time: "",
  improve: "",
  revise: "",
  submittedAt: null
});

export function writingComplete(answers: Record<string, WritingAnswer>, ids: string[]): boolean {
  return ids.every((id) => (answers[id]?.original || "").trim().length > 0);
}

export function createMemoryExamStore(options: {
  studentId?: string;
  now?: () => string;
  teacherAllowance?: number | null;
  storage?: Pick<Storage, "getItem" | "setItem">;
  storageKey?: string;
} = {}): ExamStore {
  const studentId = options.studentId || "learner";
  const now = options.now || (() => new Date().toISOString());
  const storageKey = options.storageKey || "unit3-exam-practice-draft";
  let writing = emptyWriting();
  let mock = emptySitting(studentId);
  let reflection = emptyReflection();
  if (options.storage) {
    try {
      const raw = options.storage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<ExamSnapshot>;
        if (saved.writing) writing = saved.writing;
        if (saved.mock && saved.mock.studentId === studentId) mock = saved.mock;
        if (saved.reflection) reflection = saved.reflection;
      }
    } catch {
      // A damaged local draft must not block a new attempt.
    }
  }

  function persist(snapshot: ExamSnapshot): ExamSnapshot {
    options.storage?.setItem(storageKey, JSON.stringify({
      writing: snapshot.writing,
      mock: { ...mock, awarded: null, feedback: null },
      reflection: snapshot.reflection
    }));
    return snapshot;
  }

  function snapshot(): ExamSnapshot {
    return {
      writing,
      mock: learnerView(mock),
      reflection,
      serverNow: now()
    };
  }

  return {
    load: snapshot,
    saveWriting(answers) {
      writing = {
        answers,
        updatedAt: now(),
        completed: writingComplete(answers, PRACTICE_QUESTIONS.map((question) => question.id))
      };
      return persist(snapshot());
    },
    startMock() {
      mock = startSitting(mock, now(), options.teacherAllowance);
      return persist(snapshot());
    },
    saveMock(responses) {
      mock = saveResponses(mock, responses, now());
      return persist(snapshot());
    },
    submitMock(method) {
      mock = submitSitting(mock, method, now());
      return persist(snapshot());
    },
    saveReflection(draft) {
      reflection = {
        topic: draft.topic,
        command: draft.command,
        time: draft.time,
        improve: draft.improve,
        revise: draft.revise,
        submittedAt: draft.submittedAt ?? now()
      };
      return persist(snapshot());
    },
    award(awarded, feedback) {
      mock = awardMarks(mock, awarded, feedback);
      return mock;
    },
    finalise() {
      mock = finaliseMarks(mock);
      return mock;
    }
  };
}

const STORAGE_KEY = "unit3-exam-practice-draft";

export function browserExamStore(studentId: string, teacherAllowance: number | null = null): ExamStore {
  return createMemoryExamStore({
    studentId,
    teacherAllowance,
    storage: localStorage,
    storageKey: `${STORAGE_KEY}:${studentId}`
  });
}
