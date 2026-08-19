export type QuizOption = {
  optionId: string;
  text: string;
  id: string;
  label: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export function optionLabel(option: unknown): string {
  if (option == null) return "";
  if (typeof option === "string" || typeof option === "number") return String(option);
  if (!isRecord(option)) return "";
  const text = option.text ?? option.label ?? option.name;
  if (text != null && String(text) !== "[object Object]") return String(text);
  const id = option.optionId ?? option.id;
  return id != null ? String(id) : "";
}

export function optionId(option: unknown, index = 0): string {
  if (isRecord(option)) {
    const id = option.optionId ?? option.id;
    if (id != null && String(id)) return String(id);
  }
  return String(index + 1);
}

export function normalizeOption(option: unknown, index = 0): QuizOption {
  const id = optionId(option, index);
  const text = optionLabel(option) || id;
  return {
    optionId: id,
    text,
    id,
    label: text
  };
}

export function normalizeMcqQuestion<T extends Record<string, unknown>>(raw: T): T & {
  options: QuizOption[];
  correctIndex: number;
} {
  const source = raw || ({} as T);
  const options = ((source.options as unknown[]) || []).map((option, index) =>
    normalizeOption(option, index)
  );
  let correctIndex = typeof source.correctIndex === "number" ? source.correctIndex : -1;
  if (correctIndex < 0 && source.correctOptionId != null) {
    const wanted = String(source.correctOptionId);
    correctIndex = options.findIndex((option) => option.optionId === wanted || option.id === wanted);
  }
  if (typeof correctIndex !== "number" || Number.isNaN(correctIndex)) {
    correctIndex = -1;
  }
  const explanation =
    source.explanation ||
    (source.feedback as { correct?: string } | undefined)?.correct ||
    source.feedbackIncorrect;
  return {
    ...source,
    options,
    correctIndex,
    explanation: explanation || source.explanation
  };
}

function looksLikeMcq(question: Record<string, unknown>): boolean {
  const type = String(question.type || question.sourceType || "");
  if (type === "matching" || type === "classification") return false;
  if (!Array.isArray(question.options) || question.options.length === 0) return false;
  return (
    type === "single" ||
    type === "single-choice" ||
    type === "mcq" ||
    question.correctOptionId != null ||
    typeof question.correctIndex === "number"
  );
}

export function normalizeMcqQuestionIfNeeded<T extends Record<string, unknown>>(question: T): T {
  if (!looksLikeMcq(question)) return question;
  return normalizeMcqQuestion(question);
}

export function normalizeActivityQuestions(activity: Record<string, unknown>): Record<string, unknown> {
  const next = { ...activity };
  if (Array.isArray(next.questions)) {
    next.questions = (next.questions as Array<Record<string, unknown>>).map(normalizeMcqQuestionIfNeeded);
  }
  if (Array.isArray(next.sections)) {
    next.sections = (next.sections as Array<Record<string, unknown>>).map((section) => ({
      ...section,
      questions: Array.isArray(section.questions)
        ? (section.questions as Array<Record<string, unknown>>).map(normalizeMcqQuestionIfNeeded)
        : section.questions,
      check: isRecord(section.check)
        ? normalizeMcqQuestionIfNeeded(section.check as Record<string, unknown>)
        : section.check
    }));
  }
  if (Array.isArray(next.checks)) {
    next.checks = (next.checks as Array<Record<string, unknown>>).map(normalizeMcqQuestionIfNeeded);
  }
  if (Array.isArray(next.knowledgeChecks)) {
    next.knowledgeChecks = (next.knowledgeChecks as Array<Record<string, unknown>>).map(
      normalizeMcqQuestionIfNeeded
    );
  }
  if (Array.isArray(next.items)) {
    next.items = (next.items as Array<Record<string, unknown>>).map((item) => {
      if (!isRecord(item.check)) return item;
      return { ...item, check: normalizeMcqQuestionIfNeeded(item.check as Record<string, unknown>) };
    });
  }
  return next;
}
