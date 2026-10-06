import type { ServerMarkingRegistration } from "./week5-client-marking-keys";

/**
 * Server marking rows for the revised Week 5 questions.
 * 1.2.0 rows are inserted by the backend migration. Week 5 OCR stays on the
 * existing host catalogue version 1.1.0 and is not inserted again.
 */
export const WEEK5_SERVER_MARKING_REGISTRY: ServerMarkingRegistration[] = [
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q1",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q2",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q3",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q4",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q5",
    "mode": "single-choice",
    "correctOptionId": "c"
  },
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q6",
    "mode": "single-choice",
    "correctOptionId": "c"
  },
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q7",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session1-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S1Q8",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K1",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K2",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K3",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K4",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K5",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K6",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K7",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K8",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "K9",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-impacts-learning",
    "serverVersion": "1.2.0",
    "stableKey": "CHECKPOINT",
    "mode": "completion"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C1",
    "mode": "classification",
    "correctCategoryId": "Loss"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C2",
    "mode": "classification",
    "correctCategoryId": "Disruption"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C3",
    "mode": "classification",
    "correctCategoryId": "Safety"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C4",
    "mode": "classification",
    "correctCategoryId": "Loss"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C5",
    "mode": "classification",
    "correctCategoryId": "Loss"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C6",
    "mode": "classification",
    "correctCategoryId": "More than one category"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C7",
    "mode": "classification",
    "correctCategoryId": "More than one category"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "C8",
    "mode": "classification",
    "correctCategoryId": "Disruption"
  },
  {
    "activityId": "week5-impact-classification",
    "serverVersion": "1.2.0",
    "stableKey": "JUSTIFY",
    "mode": "completion"
  },
  {
    "activityId": "week5-ransomware-companion",
    "serverVersion": "1.2.0",
    "stableKey": "SPOT-1",
    "mode": "classification",
    "correctCategoryId": "Disruption"
  },
  {
    "activityId": "week5-ransomware-companion",
    "serverVersion": "1.2.0",
    "stableKey": "SPOT-2",
    "mode": "classification",
    "correctCategoryId": "Loss"
  },
  {
    "activityId": "week5-ransomware-companion",
    "serverVersion": "1.2.0",
    "stableKey": "SPOT-3",
    "mode": "classification",
    "correctCategoryId": "Disruption"
  },
  {
    "activityId": "week5-ransomware-companion",
    "serverVersion": "1.2.0",
    "stableKey": "SPOT-4",
    "mode": "classification",
    "correctCategoryId": "Not supported"
  },
  {
    "activityId": "week5-ransomware-companion",
    "serverVersion": "1.2.0",
    "stableKey": "RC2",
    "mode": "completion"
  },
  {
    "activityId": "week5-ransomware-companion",
    "serverVersion": "1.2.0",
    "stableKey": "RC3",
    "mode": "ordering-exact",
    "correctOrder": [
      "stolen",
      "offline",
      "complaints",
      "trust"
    ]
  },
  {
    "activityId": "week5-ransomware-companion",
    "serverVersion": "1.2.0",
    "stableKey": "RC4",
    "mode": "completion"
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "T1",
    "mode": "classification",
    "correctCategoryId": "Immediate"
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "T2",
    "mode": "classification",
    "correctCategoryId": "Immediate"
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "T3",
    "mode": "classification",
    "correctCategoryId": "Longer term"
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "T4",
    "mode": "classification",
    "correctCategoryId": "Longer term"
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "T5",
    "mode": "classification",
    "correctCategoryId": "Could be either"
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "T6",
    "mode": "classification",
    "correctCategoryId": "Longer term"
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "DB2",
    "mode": "ordering-exact",
    "correctOrder": [
      "encrypt",
      "confirm",
      "cancel",
      "complaints"
    ]
  },
  {
    "activityId": "week5-exercise-debrief",
    "serverVersion": "1.2.0",
    "stableKey": "DB3",
    "mode": "completion"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q1",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q2",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q3",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q4",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q5",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q6",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q7",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q8",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q9",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q10",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q11",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-session2-retrieval",
    "serverVersion": "1.2.0",
    "stableKey": "S2Q12",
    "mode": "single-choice",
    "correctOptionId": "c"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR1",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR2",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR3",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR4",
    "mode": "requires_review"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR5",
    "mode": "requires_review"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR6",
    "mode": "requires_review"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR7",
    "mode": "requires_review"
  },
  {
    "activityId": "week5-ocr-question-practice",
    "serverVersion": "1.1.0",
    "stableKey": "OCR8",
    "mode": "requires_review"
  },
  {
    "activityId": "week5-secure-rewrite",
    "serverVersion": "1.2.0",
    "stableKey": "R1",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-secure-rewrite",
    "serverVersion": "1.2.0",
    "stableKey": "R2",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-secure-rewrite",
    "serverVersion": "1.2.0",
    "stableKey": "R3",
    "mode": "single-choice",
    "correctOptionId": "b"
  },
  {
    "activityId": "week5-secure-rewrite",
    "serverVersion": "1.2.0",
    "stableKey": "R4",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-secure-rewrite",
    "serverVersion": "1.2.0",
    "stableKey": "R5",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-secure-rewrite",
    "serverVersion": "1.2.0",
    "stableKey": "R6",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-secure-rewrite",
    "serverVersion": "1.2.0",
    "stableKey": "EXPLAIN",
    "mode": "completion"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T1",
    "mode": "classification",
    "correctCategoryId": "Vulnerability"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T2",
    "mode": "classification",
    "correctCategoryId": "Threat"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T3",
    "mode": "classification",
    "correctCategoryId": "Risk"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T4",
    "mode": "classification",
    "correctCategoryId": "Vulnerability"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T5",
    "mode": "classification",
    "correctCategoryId": "Threat"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T6",
    "mode": "classification",
    "correctCategoryId": "Risk"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T7",
    "mode": "classification",
    "correctCategoryId": "Vulnerability"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "T8",
    "mode": "classification",
    "correctCategoryId": "Vulnerability"
  },
  {
    "activityId": "week5-threat-vulnerability-risk",
    "serverVersion": "1.2.0",
    "stableKey": "EXPLAIN",
    "mode": "completion"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P1",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P2",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P3",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P4",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P5",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P6",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P7",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "P8",
    "mode": "single-choice",
    "correctOptionId": "a"
  },
  {
    "activityId": "week5-vulnerability-patterns",
    "serverVersion": "1.2.0",
    "stableKey": "CHECKPOINT",
    "mode": "completion"
  }
];
