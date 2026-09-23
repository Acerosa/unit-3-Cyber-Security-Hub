import type { ActivityDocument } from "@learning-platform/ui";

export const KNOWLEDGE_REPORT_PLACEMENT = "knowledge-report";

export type KnowledgeReportSection = {
  heading: string;
  prompts: string[];
};

export type KnowledgeReportConfig = {
  placement: string;
  slug: string;
  durationMinutes: number;
  minWords: number;
  brief: string;
  guidance: KnowledgeReportSection[];
  sentenceStarters: string[];
};

type ReportMetadata = {
  title?: string;
  summary?: string;
  knowledgeReport?: Partial<KnowledgeReportConfig>;
};

export function countWords(text: string): number {
  const trimmed = String(text || "").trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function knowledgeReportConfig(activity: ActivityDocument | null | undefined): KnowledgeReportConfig | null {
  const metadata = activity?.metadata as ReportMetadata | undefined;
  const report = metadata?.knowledgeReport;
  if (!report || report.placement !== KNOWLEDGE_REPORT_PLACEMENT) return null;
  const durationMinutes = Number(report.durationMinutes);
  const minWords = Number(report.minWords);
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return null;
  if (!Number.isFinite(minWords) || minWords <= 0) return null;
  return {
    placement: KNOWLEDGE_REPORT_PLACEMENT,
    slug: String(report.slug || "").trim(),
    durationMinutes,
    minWords,
    brief: String(report.brief || metadata?.summary || "").trim(),
    guidance: Array.isArray(report.guidance) ? report.guidance : [],
    sentenceStarters: Array.isArray(report.sentenceStarters) ? report.sentenceStarters : []
  };
}

export function knowledgeReportActivities(activities: ActivityDocument[] | undefined): ActivityDocument[] {
  return (activities || []).filter((activity) => knowledgeReportConfig(activity));
}

export function reportQuestionId(activity: ActivityDocument): string {
  const block = (activity.blocks || []).find((item) => String(item.type || "").toLowerCase() === "short-response");
  return String(block?.content?.questionId || block?.id || activity.id);
}

export function isClipboardShortcut(event: { metaKey?: boolean; ctrlKey?: boolean; key?: string }): boolean {
  if (!(event.metaKey || event.ctrlKey)) return false;
  const key = String(event.key || "").toLowerCase();
  return key === "c" || key === "v" || key === "x";
}
