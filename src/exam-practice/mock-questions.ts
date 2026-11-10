export type MockQuestion = {
  id: string;
  command: "Explain" | "Describe" | "Identify" | "Discuss";
  marks: number;
  topic: string;
  outcome: "LO1" | "LO2";
  scenario: string;
  prompt: string;
};

/** Student-facing paper only. Marking guidance is not stored in this module. */
export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: "mm-1",
    command: "Explain",
    marks: 3,
    topic: "Confidentiality, integrity and availability",
    outcome: "LO1",
    scenario: "Ash Lane Accountants emailed a client's tax return to a different client by mistake.",
    prompt: "Explain which cyber security aim has failed, and one consequence for the client whose return was sent."
  },
  {
    id: "mm-2",
    command: "Describe",
    marks: 4,
    topic: "Threats and vulnerabilities",
    outcome: "LO1",
    scenario: "Harbour Leisure Centre lets coaches book courts on a website. The booking password is the centre's postcode, and it has not been changed since the website opened.",
    prompt: "Describe one threat to the booking website and one vulnerability in the way the password is managed."
  },
  {
    id: "mm-3",
    command: "Identify",
    marks: 3,
    topic: "Types of attackers and motivations",
    outcome: "LO1",
    scenario: "A former warehouse supervisor at Plover Retail still knows the stock-system password. After being dismissed, they delete two days of stock records.",
    prompt: "Identify the type of attacker and state the motivation shown in the scenario."
  },
  {
    id: "mm-4",
    command: "Explain",
    marks: 4,
    topic: "Impacts of an incident",
    outcome: "LO2",
    scenario: "Westfield College sends course offers in the first week of March. That week the admissions system is encrypted and staff cannot open the offer letters.",
    prompt: "Explain two impacts on Westfield College and its applicants."
  },
  {
    id: "mm-5",
    command: "Discuss",
    marks: 6,
    topic: "Legal or operational considerations",
    outcome: "LO2",
    scenario: "Kindling Trust keeps a list of people who donate each month. A volunteer posts a screenshot of that list, including names and amounts, on the charity's social media account.",
    prompt: "Discuss the legal and operational issues this creates for Kindling Trust."
  }
];
