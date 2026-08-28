import { normalizeActivityQuestions, normalizeMcqQuestionIfNeeded } from "./options";

type ContentBlock = {
  id?: string;
  type?: string;
  content?: Record<string, unknown>;
};

type ContentActivity = {
  id: string;
  version: string;
  metadata?: {
    title?: string;
    summary?: string;
    activityType?: string;
    detail?: string;
    topics?: string[];
    href?: string | null;
    runtimeGlobal?: string | null;
  };
  blocks?: ContentBlock[];
};

type ContentWeek = {
  id: string;
  metadata?: { teachingWeek?: number; title?: string; status?: string };
  relationships?: { sessions?: string[]; learningOutcomes?: string[] };
};

type ContentSession = {
  id: string;
  metadata?: { title?: string; kind?: string; summary?: string; defaultOpen?: boolean };
  relationships?: { activities?: string[]; week?: string };
};

type ContentOutcome = {
  id: string;
  metadata?: { title?: string };
};

export type ContentPackage = {
  version?: string;
  hub?: { id?: string };
  curriculum?: { metadata?: { course?: string; title?: string } };
  weeks?: ContentWeek[];
  sessions?: ContentSession[];
  activities?: ContentActivity[];
  learningOutcomes?: ContentOutcome[];
};

export type WeekPageModel = {
  week: {
    id: string;
    teachingWeek: number;
    title: string;
    subtitle: string;
    status: string;
  };
  learningOutcomes: Array<{ id: string; title: string }>;
  sessions: Array<{
    id: string;
    title: string;
    kind: string;
    summary: string;
    defaultOpen: boolean;
    activities: Array<{ id: string; title: string }>;
  }>;
};

export function weekPageFromPackage(pkg: ContentPackage, weekId: string): WeekPageModel | null {
  const week = (pkg.weeks || []).find((item) => item.id === weekId);
  if (!week) return null;
  const teachingWeek = Number(week.metadata?.teachingWeek || 0);
  const sessions = (week.relationships?.sessions || []).map((sessionId, index) => {
    const session = (pkg.sessions || []).find((item) => item.id === sessionId);
    return {
      id: sessionId,
      title: session?.metadata?.title || sessionId,
      kind: session?.metadata?.kind || "session",
      summary: session?.metadata?.summary || "",
      defaultOpen: session?.metadata?.defaultOpen === true || index === 0,
      activities: (session?.relationships?.activities || []).map((activityId) => {
        const activity = (pkg.activities || []).find((item) => item.id === activityId);
        return {
          id: activityId,
          title: activity?.metadata?.title || activityId
        };
      })
    };
  });
  const learningOutcomes = (week.relationships?.learningOutcomes || []).map((outcomeId) => {
    const outcome = (pkg.learningOutcomes || []).find((item) => item.id === outcomeId);
    return { id: outcomeId, title: outcome?.metadata?.title || outcomeId };
  });
  return {
    week: {
      id: week.id,
      teachingWeek,
      title: week.metadata?.title || `Week ${teachingWeek}`,
      subtitle: "",
      status: String(week.metadata?.status ?? "")
    },
    learningOutcomes,
    sessions
  };
}

type RestoredQuestion = Record<string, unknown> & { id: string; type: string; prompt: string };

function parseRemainder(activity: ContentActivity): Record<string, unknown> {
  const remainder = (activity.blocks || []).find((item) => item.id === `${activity.id}-source-remainder`);
  const text = String(remainder?.content?.text || "");
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function activityFromPackage(pkg: ContentPackage, activityId: string): Record<string, unknown> | null {
  const activity = (pkg.activities || []).find((item) => item.id === activityId);
  if (!activity) return null;
  const remainder = parseRemainder(activity);
  const restored: Record<string, unknown> = {
    id: activity.id,
    activityId: activity.id,
    version: activity.version,
    title: activity.metadata?.title,
    ...remainder
  };
  const sections: Array<{ id: string; title: string; intro: string; questions: RestoredQuestion[] }> = [];
  let current: { id: string; title: string; intro: string; questions: RestoredQuestion[] } | null = null;
  const questions: RestoredQuestion[] = [];

  (activity.blocks || []).forEach((item) => {
    if (item.id?.endsWith("-source-remainder")) return;
    const content = (item.content || {}) as Record<string, unknown>;
    if (item.type === "heading" && content.level === 3) {
      current = {
        id: String(item.id || "").replace(`${activity.id}-`, "").replace(/-h$/, ""),
        title: String(content.text || ""),
        intro: "",
        questions: []
      };
      sections.push(current);
      return;
    }
    if (item.type === "paragraph" && current && !current.intro) {
      current.intro = String(content.text || "");
      return;
    }
    if (!content.questionId && item.type !== "classification") return;
    if (content.sourceQuestionId === "learner-note") return;
    const question: RestoredQuestion = {
      id: String(content.sourceQuestionId || String(content.questionId || item.id).split(":").pop()),
      type: String(content.sourceType || item.type || "single"),
      prompt: String(content.prompt || ""),
      options: content.options,
      rows: content.rows,
      items: content.items,
      answer: content.answer || content.correctOptionId,
      answers: content.answers,
      accepted: content.accepted,
      feedback: content.feedback,
      skill: content.skill,
      languages: content.languages,
      commandWord: content.commandWord,
      marks: content.marks,
      scenario: content.scenario,
      explanation: (content.feedback as { correct?: string } | undefined)?.correct,
      correctOptionId: content.correctOptionId,
      ...content
    };
    Object.assign(question, normalizeMcqQuestionIfNeeded(question));
    if (item.type === "classification" && content.sourceType !== "matching") {
      const items = ((content.items as Array<Record<string, unknown>>) || []);
      const categories = ((content.categories as Array<Record<string, unknown>>) || []);
      restored.cards = items.map((card) => ({
        id: card.id,
        text: card.text || card.label,
        correctType: card.correctCategoryId,
        explanation: card.explanation,
        ambiguityNote: card.ambiguityNote,
        exploitPair: card.exploitPair
      }));
      restored.classificationItems = items.map((card) => ({
        id: card.id,
        statement: card.text || card.label,
        correctCategory: card.correctCategoryId,
        explanation: card.explanation
      }));
      restored.categories = categories.map((category) => category.id || category.label);
      // Keep Week 3 case-matching host/registry shape when Content owns classification.
      if (activity.id === "week3-attacker-case-matching") {
        restored.cases = items.map((card) => ({
          id: card.id,
          title: card.label || card.id,
          scenario: card.text || card.label || "",
          bestAnswer: card.correctCategoryId,
          whyBest: card.explanation || ""
        }));
        restored.attackerOptions = categories.map((category) => ({
          id: category.id,
          name: category.label || category.id
        }));
      }
      return;
    }
    if (content.sourceType === "matching") {
      question.type = "matching";
      question.options = content.options;
      question.rows = content.rows;
      question.answer = content.answer;
    }
    if (current) current.questions.push(question);
    else questions.push(question);
  });

  if (sections.length) restored.sections = sections;
  if (questions.length) restored.questions = questions;
  return normalizeActivityQuestions(restored);
}

export function catalogFromPackage(pkg: ContentPackage) {
  return (pkg.activities || []).map((activity) => ({
    id: activity.id,
    version: activity.version,
    title: activity.metadata?.title || activity.id,
    purpose: activity.metadata?.summary || "",
    type: activity.metadata?.activityType || "Activity",
    detail: activity.metadata?.detail || "",
    topics: activity.metadata?.topics || [],
    path: activity.metadata?.href || `./${activity.id}/`
  }));
}
