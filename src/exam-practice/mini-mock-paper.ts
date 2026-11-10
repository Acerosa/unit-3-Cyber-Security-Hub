export type MiniMockBlock = {
  id?: string;
  type?: string;
  content?: {
    text?: string;
    questionId?: string;
    prompt?: string;
    maxMarks?: number;
  };
};

export type MiniMockGroup = {
  scenario: string;
  questions: MiniMockBlock[];
};

const COMMAND_AND_MARKS = /^(?:Explain|Describe|Identify|Discuss)\. \d+ marks\. /;

/** The catalogue stores the command and mark total in front of the scenario sentence. */
export function miniMockScenarioText(text: string): string {
  return text.replace(COMMAND_AND_MARKS, "");
}

/** Paragraphs before one or more questions are that group's scenario. */
export function miniMockGroups(blocks: MiniMockBlock[]): MiniMockGroup[] {
  const groups: MiniMockGroup[] = [];
  let scenario = "";
  let current: MiniMockGroup | null = null;
  for (const block of blocks) {
    if (block.type === "paragraph") {
      if (current) groups.push(current);
      current = null;
      scenario = miniMockScenarioText(String(block.content?.text || ""));
    } else if (block.type === "short-response") {
      if (!current) current = { scenario, questions: [] };
      current.questions.push(block);
    }
  }
  if (current) groups.push(current);
  return groups;
}
