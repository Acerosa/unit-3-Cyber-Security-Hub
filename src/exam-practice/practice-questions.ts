export type PracticeQuestion = {
  id: string;
  command: "Identify" | "Describe" | "Explain" | "Discuss";
  marks: number;
  topic: string;
  scenario: string;
  prompt: string;
  weak: string;
  stronger: string;
  why: string;
  indicative: string;
};

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "aw-1",
    command: "Identify",
    marks: 2,
    topic: "Confidentiality, integrity and availability",
    scenario: "Riverside College lets several students use one shared library login to print coursework.",
    prompt: "Identify two cyber security aims that this arrangement puts at risk.",
    weak: "Confidentiality and integrity.",
    stronger: "Confidentiality, because any student with the shared login can open another student's files. Integrity, because one student can change or delete another student's saved work.",
    why: "Identify needs a correct name. A second mark comes from making the point specific to the scenario, not from writing a longer sentence about the same idea.",
    indicative: "Award one mark for each correct aim applied to the shared login. Confidentiality (other students can see files) and integrity (files can be changed) are the expected aims. Availability is acceptable only if the answer says the shared account could be locked and block printing. Do not award a mark for a bare list that names an aim the scenario does not support."
  },
  {
    id: "aw-2",
    command: "Describe",
    marks: 2,
    topic: "Threats and vulnerabilities",
    scenario: "Harbour Books uses one till password, written on a note beside the till. Weekend staff all know it.",
    prompt: "Describe one vulnerability in this arrangement.",
    weak: "The password is weak.",
    stronger: "The till password is shared and left in sight, so anyone who works at the till, or who can read the note, can sign in as a member of staff.",
    why: "Describe needs the feature and what is wrong with it. Naming 'password' is not enough. The stronger answer says how the shared, visible password lets someone in.",
    indicative: "One mark for identifying the shared or written-down password. A second mark for describing the consequence: people who should not have their own staff access can still sign in. Do not accept a threat, such as theft, unless the answer also describes the weakness that makes the theft easier."
  },
  {
    id: "aw-3",
    command: "Explain",
    marks: 4,
    topic: "Attacker motivations and targets",
    scenario: "Greenpath is a small charity. It keeps supporters' bank details so it can claim Gift Aid. A former volunteer left after a dispute about hours.",
    prompt: "Explain why the former volunteer could be a threat to Greenpath, and what they might target.",
    weak: "They are angry so they might hack the charity.",
    stronger: "The former volunteer already knows how the charity stores supporter records. Because the dispute was about hours, a personal grievance is a plausible motivation. They might target the Gift Aid records, which include bank details, to expose them or to disrupt the charity's donations.",
    why: "Explain has to join a cause to a consequence. The stronger answer uses the dispute and the Gift Aid records from the scenario. A general claim that someone 'might hack' does not earn the development marks.",
    indicative: "Up to two marks for the motivation linked to the dispute or the insider knowledge. Up to two marks for a target taken from the scenario, such as supporter bank details or Gift Aid records, with a consequence. Do not award full marks for naming 'insider' without using the scenario."
  },
  {
    id: "aw-4",
    command: "Describe",
    marks: 4,
    topic: "Impacts of a cyber security incident",
    scenario: "Larkspur Florist takes online orders for a busy Saturday. On Friday night the website and the card machine both stop working. The paper order book is in the shop.",
    prompt: "Describe two impacts on Larkspur if the website and card machine stay unavailable through Saturday.",
    weak: "The shop loses money and customers are upset.",
    stronger: "Larkspur cannot take card payments in the shop, so Saturday sales are limited to cash and some customers will leave. Online orders cannot be received, so those sales are lost and the florist may not know which bouquets were requested.",
    why: "Two described impacts are needed. Each one should say what stops working and what that means for the florist. 'Loses money' is a label, not a description.",
    indicative: "Award two marks for each developed impact, up to four. Suitable impacts include lost online orders, inability to take card payments, and staff not knowing which orders were placed. A repeated point about money does not earn a second pair of marks."
  },
  {
    id: "aw-5",
    command: "Explain",
    marks: 6,
    topic: "Threats and vulnerabilities",
    scenario: "Meadow Sixth Form emailed staff a message that looked like the headteacher asking them to open 'updated registers'. Several staff have not been shown how to check a sender's address. The attachment was malware.",
    prompt: "Explain the threat and the vulnerability in this incident. Use the scenario.",
    weak: "Phishing is the threat and staff are the vulnerability.",
    stronger: "The threat is the email that pretends to be the headteacher and carries malware. The vulnerability is that staff have not been shown how to check the sender, so they are more likely to open the attachment. The threat is the action against the college. The vulnerability is the weakness that lets that action succeed.",
    why: "A six-mark explain needs both parts, kept separate, and each part tied to the email or the missing training. Naming the two terms without the scenario stays in the lower band.",
    indicative: "Award up to three marks for the threat: a deceptive email or the malware, with what it tries to do. Award up to three marks for the vulnerability: staff who cannot check a sender, with why that helps the email succeed. Do not award marks for security controls that are not in the question, such as firewalls or backups."
  },
  {
    id: "aw-6",
    command: "Discuss",
    marks: 7,
    topic: "Ethical, legal and operational considerations",
    scenario: "Kiln & Co is a small pottery shop. Customer names and delivery addresses were copied and a message arrived demanding payment to stop them being published. The shop has one owner, who also packs the orders.",
    prompt: "Discuss the issues the owner should consider before deciding whether to pay.",
    weak: "They should not pay because paying is wrong, and they should call the police.",
    stronger: "Paying might seem the quickest way to protect customers' addresses, but payment does not guarantee the copy is deleted and it may encourage another demand. Publishing the addresses could breach data protection duties to those customers. Operationally, the owner is also the person packing orders, so time spent dealing with the demand can stop deliveries. The owner should preserve the message and report the incident rather than treating payment as a private bargain.",
    why: "Discuss needs more than one side and a judgement. The stronger answer weighs the wish to protect customers against the risk that payment fails, and it uses the small shop from the scenario.",
    indicative: "Reward a balanced argument: why payment is tempting, why it may not protect the data, a legal duty to the customers, and the operational effect on a one-person shop. A one-sided 'never pay' or 'just pay' answer, with no use of the scenario, stays in the lower band. There is no single required conclusion."
  }
];
