/**
 * Cyber Security Glossary term data for Week 1.
 * Teachers may edit this file to update definitions and examples.
 *
 * Structure:
 * {
 *   id: string,
 *   term: string,
 *   category: string,
 *   definition: string,
 *   northbankExample: string,
 *   relatedTerms: string[]
 * }
 */

const GLOSSARY_CATEGORIES = [
  'Core cyber security',
  'Incident classifications',
  'Information and impact',
  'Threats and protection',
  'Examination language'
];

const GLOSSARY_TERMS = [
  {
    id: 'cyber-security',
    term: 'Cyber security',
    category: 'Core cyber security',
    definition: 'Protecting digital systems and the information stored, processed or transferred by them.',
    northbankExample: 'Northbank College protects student portal accounts, clinic systems and council services from unauthorised access and disruption.',
    relatedTerms: ['CIA triad', 'Cyber security incident', 'Authorised']
  },
  {
    id: 'cia-triad',
    term: 'CIA triad',
    category: 'Core cyber security',
    definition: 'A model containing the three main aims of cyber security: confidentiality, integrity and availability.',
    northbankExample: 'When Northbank staff assess an incident, they ask whether confidentiality, integrity or availability has been affected.',
    relatedTerms: ['Confidentiality', 'Integrity', 'Availability']
  },
  {
    id: 'confidentiality',
    term: 'Confidentiality',
    category: 'Core cyber security',
    definition: 'Ensuring that information can only be viewed by authorised people or systems.',
    northbankExample: 'Northbank patient records should only be available to staff who require them for their work.',
    relatedTerms: ['Authorised', 'Information disclosure', 'Personal data']
  },
  {
    id: 'integrity',
    term: 'Integrity',
    category: 'Core cyber security',
    definition: 'Ensuring that information remains accurate, complete and is not changed without permission.',
    northbankExample: 'Changing a Riverside Community Clinic dosage or a LocalGoods product price without permission affects integrity.',
    relatedTerms: ['Modification of data', 'Authorised', 'Evidence']
  },
  {
    id: 'availability',
    term: 'Availability',
    category: 'Core cyber security',
    definition: 'Ensuring that information and systems can be accessed by authorised users when needed.',
    northbankExample: 'If the college VLE is knocked offline during an assessment window, availability is affected.',
    relatedTerms: ['Inaccessible data', 'Denial of service', 'Authorised']
  },
  {
    id: 'authorised',
    term: 'Authorised',
    category: 'Core cyber security',
    definition: 'Given permission to access a system, service or item of information.',
    northbankExample: 'A Northbank District Council officer may be authorised to open housing benefit records for their role.',
    relatedTerms: ['Unauthorised', 'Authentication', 'Confidentiality']
  },
  {
    id: 'unauthorised',
    term: 'Unauthorised',
    category: 'Core cyber security',
    definition: 'Accessing or using something without permission.',
    northbankExample: 'An overnight login to the LocalGoods admin console using a staff account that nobody was using is unauthorised.',
    relatedTerms: ['Authorised', 'Unauthorised access', 'Theft']
  },
  {
    id: 'cyber-security-incident',
    term: 'Cyber security incident',
    category: 'Core cyber security',
    definition: 'An event that threatens or damages the confidentiality, integrity or availability of information or systems.',
    northbankExample: 'Ransomware locking Greenfield Motors workshop files is a cyber security incident because staff cannot use business data.',
    relatedTerms: ['CIA triad', 'Impact', 'Data breach']
  },
  {
    id: 'unauthorised-access',
    term: 'Unauthorised access',
    category: 'Incident classifications',
    definition: 'A person or system gains access to information, an account or a service without permission.',
    northbankExample: 'A remote desktop session into a council workstation using a disabled contractor account is unauthorised access.',
    relatedTerms: ['Unauthorised', 'Authentication', 'Confidentiality']
  },
  {
    id: 'information-disclosure',
    term: 'Information disclosure',
    category: 'Incident classifications',
    definition: 'Information is revealed to people who are not permitted to see it.',
    northbankExample: 'Emailing a Riverside clinic spreadsheet that still contains staff National Insurance numbers is information disclosure.',
    relatedTerms: ['Confidentiality', 'Personal data', 'Data breach']
  },
  {
    id: 'modification-of-data',
    term: 'Modification of data',
    category: 'Incident classifications',
    definition: 'Information is changed without permission, affecting its accuracy or completeness.',
    northbankExample: 'Changing LocalGoods product prices to £0.01 without permission is modification of data.',
    relatedTerms: ['Integrity', 'Unauthorised access', 'Impact']
  },
  {
    id: 'inaccessible-data',
    term: 'Inaccessible data',
    category: 'Incident classifications',
    definition: 'Authorised users cannot access information or systems when they need them.',
    northbankExample: 'Clinic staff cannot open encrypted referral letters needed for the day’s appointments.',
    relatedTerms: ['Availability', 'Ransomware', 'Denial of service']
  },
  {
    id: 'destruction',
    term: 'Destruction',
    category: 'Incident classifications',
    definition: 'Data, software or equipment is deliberately or accidentally deleted or damaged.',
    northbankExample: 'A ransomware message that threatens to delete remaining garage files is threatening destruction of business data.',
    relatedTerms: ['Availability', 'Integrity', 'Impact']
  },
  {
    id: 'theft',
    term: 'Theft',
    category: 'Incident classifications',
    definition: 'Information, credentials, devices or other digital assets are taken without permission.',
    northbankExample: 'Harvesting a tutor’s business email form data with banking malware is theft of credentials and account information.',
    relatedTerms: ['Confidentiality', 'Malware', 'Unauthorised access']
  },
  {
    id: 'personal-data',
    term: 'Personal data',
    category: 'Information and impact',
    definition: 'Information that relates to an identifiable person.',
    northbankExample: 'Student portal usernames, patient referral details and staff home addresses are personal data.',
    relatedTerms: ['Confidentiality', 'Information disclosure', 'Data breach']
  },
  {
    id: 'organisational-data',
    term: 'Organisational data',
    category: 'Information and impact',
    definition: 'Information owned or used by an organisation, such as financial records, customer information or research.',
    northbankExample: 'Greenfield Motors job cards, invoices and customer contact lists are organisational data.',
    relatedTerms: ['Personal data', 'Impact', 'Confidentiality']
  },
  {
    id: 'state-data',
    term: 'State data',
    category: 'Information and impact',
    definition: 'Information connected to government, public services, national infrastructure, public safety or national security.',
    northbankExample: 'Northbank District Council housing benefit records are an example of state or public-service data.',
    relatedTerms: ['Organisational data', 'Personal data', 'Unauthorised access']
  },
  {
    id: 'data-breach',
    term: 'Data breach',
    category: 'Information and impact',
    definition: 'A security incident involving unauthorised access to or disclosure of information.',
    northbankExample: 'A supplier seeing customer mobile numbers left in a public Greenfield Motors folder indicates a data breach.',
    relatedTerms: ['Information disclosure', 'Personal data', 'Cyber security incident']
  },
  {
    id: 'evidence',
    term: 'Evidence',
    category: 'Information and impact',
    definition: 'A fact or detail from a scenario that supports a classification or conclusion.',
    northbankExample: 'A ransom note on clinic desktops is evidence that supports classifying the event as ransomware.',
    relatedTerms: ['Impact', 'Cyber security incident', 'Explain']
  },
  {
    id: 'impact',
    term: 'Impact',
    category: 'Information and impact',
    definition: 'The effect an incident has on people, information, systems or an organisation.',
    northbankExample: 'If learners cannot submit coursework because the VLE is offline, the impact includes interrupted assessment.',
    relatedTerms: ['Availability', 'CIA triad', 'Cyber security incident']
  },
  {
    id: 'malware',
    term: 'Malware',
    category: 'Threats and protection',
    definition: 'Software designed to damage systems, disrupt services or gain unauthorised access.',
    northbankExample: 'A trojan downloaded with an unofficial PDF converter on a council workstation is malware.',
    relatedTerms: ['Ransomware', 'Theft', 'Unauthorised access']
  },
  {
    id: 'ransomware',
    term: 'Ransomware',
    category: 'Threats and protection',
    definition: 'Malware that blocks access to information or systems, usually while demanding payment.',
    northbankExample: 'Clinic files that will not open and show a cryptocurrency ransom note are affected by ransomware.',
    relatedTerms: ['Malware', 'Inaccessible data', 'Availability']
  },
  {
    id: 'denial-of-service',
    term: 'Denial of service',
    category: 'Threats and protection',
    definition: 'An attack that prevents legitimate users from accessing a system or service.',
    northbankExample: 'A flood of traffic that stops LocalGoods customers completing purchases is a denial of service incident.',
    relatedTerms: ['Availability', 'Inaccessible data', 'Impact']
  },
  {
    id: 'authentication',
    term: 'Authentication',
    category: 'Threats and protection',
    definition: 'The process used to check that a user is who they claim to be.',
    northbankExample: 'Signing into the Northbank College student portal with a username and password is authentication.',
    relatedTerms: ['Multi-factor authentication', 'Authorised', 'Unauthorised access']
  },
  {
    id: 'multi-factor-authentication',
    term: 'Multi-factor authentication',
    category: 'Threats and protection',
    definition: 'Using two or more different checks to verify a user’s identity.',
    northbankExample: 'A council login that needs a password and a one-time code from a phone uses multi-factor authentication.',
    relatedTerms: ['Authentication', 'Authorised', 'Confidentiality']
  },
  {
    id: 'identify',
    term: 'Identify',
    category: 'Examination language',
    definition: 'Name the correct term, factor or answer.',
    northbankExample: 'An exam question may ask learners to identify the CIA aim affected in a Northbank incident.',
    relatedTerms: ['Describe', 'Explain', 'CIA triad']
  },
  {
    id: 'describe',
    term: 'Describe',
    category: 'Examination language',
    definition: 'Give the main features or characteristics.',
    northbankExample: 'Learners may be asked to describe ransomware by stating that it locks files and demands payment.',
    relatedTerms: ['Identify', 'Explain', 'Ransomware']
  },
  {
    id: 'explain',
    term: 'Explain',
    category: 'Examination language',
    definition: 'State how or why something happens and develop the answer using a reason, effect or consequence.',
    northbankExample: 'Learners may explain why a mis-sent staff spreadsheet affects confidentiality, using the Northbank clinic example.',
    relatedTerms: ['Identify', 'Describe', 'Evidence']
  }
];
