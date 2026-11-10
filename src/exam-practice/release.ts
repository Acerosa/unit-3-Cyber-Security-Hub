/** Unpublished until review. Set VITE_EXAM_PRACTICE=1 only for a review build. */
export function examPracticeReleased(): boolean {
  return import.meta.env?.VITE_EXAM_PRACTICE === "1";
}
