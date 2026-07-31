/**
 * Scenario data for Northbank Cyber Incident Classification.
 *
 * Teachers may edit this file to update incident cards.
 * Keep each object shape consistent so the interface continues to work.
 *
 * Structure:
 * {
 *   id: number,
 *   title: string,
 *   organisation: string,
 *   scenario: string,
 *   incidentOptions: string[],
 *   correctIncidentType: string,
 *   correctCIA: string[],  // Confidentiality | Integrity | Availability
 *   evidencePoints: string[],
 *   explanation: string
 * }
 *
 * Answers are not shown until the learner selects Check answers.
 *
 * Incident categories (two cards each):
 * - Phishing
 * - Ransomware
 * - Unauthorised access
 * - Denial of service
 * - Accidental data disclosure
 * - Malware infection
 */

const INCIDENT_TYPES = [
  'Phishing',
  'Ransomware',
  'Unauthorised access',
  'Denial of service',
  'Accidental data disclosure',
  'Malware infection'
];

const SCENARIOS = [
  {
    id: 1,
    title: 'Suspicious enrolment email',
    organisation: 'Northbank College',
    scenario: 'Several students receive an email that appears to come from the college finance office. The message asks them to click a link and enter their student portal username and password to “confirm fee payment details”. The college IT helpdesk later confirms that finance did not send the email. One student who clicked the link reports that their portal password no longer works and that a payment method was changed.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Phishing',
    correctCIA: ['Confidentiality', 'Integrity'],
    evidencePoints: [
      'The email pretended to come from the college finance office.',
      'Learners were asked to enter portal credentials on a linked page.',
      'A student password stopped working and a payment method was changed.'
    ],
    explanation: 'This is a phishing attack that tricked a user into handing over credentials. Confidentiality is affected because login details were captured. Integrity is also affected because the attacker changed payment information in the account.'
  },
  {
    id: 2,
    title: 'Fake password reset SMS',
    organisation: 'Individual user (college applicant)',
    scenario: 'An applicant receives an SMS claiming their UCAS-related account will be locked unless they follow a short link to reset their password. The message uses urgent language and a slightly misspelt organisation name. After following the link and entering their email address and password, the applicant notices new login alerts from an unfamiliar location.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Phishing',
    correctCIA: ['Confidentiality'],
    evidencePoints: [
      'The SMS used urgency and a misspelt organisation name.',
      'The user entered their email address and password on a linked page.',
      'Login alerts appeared from an unfamiliar location afterwards.'
    ],
    explanation: 'This is phishing delivered by SMS (smishing). The main CIA impact is confidentiality because account credentials were disclosed to an attacker and used to access the account.'
  },
  {
    id: 3,
    title: 'Encrypted patient records',
    organisation: 'Riverside Community Clinic',
    scenario: 'On Monday morning, clinic staff find that shared folders containing appointment schedules and scanned referral letters will not open. Every affected file has a new extension and a ransom note appears on several desktop screens demanding cryptocurrency payment within 72 hours. Reception cannot view bookings and clinicians cannot open referral documents needed for that day’s clinics.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Ransomware',
    correctCIA: ['Confidentiality', 'Integrity', 'Availability'],
    evidencePoints: [
      'Files were encrypted and given a new extension.',
      'A ransom note demanded cryptocurrency payment.',
      'Staff could not open schedules or referral documents needed for clinics.'
    ],
    explanation: 'Ransomware encrypts files and demands payment. Availability is clearly affected because systems and documents cannot be used. Integrity is affected because files have been altered. Confidentiality is also at risk because encrypted data may have been exfiltrated or exposed during the attack.'
  },
  {
    id: 4,
    title: 'Locked workshop PCs',
    organisation: 'Greenfield Motors (small garage)',
    scenario: 'A small independent garage finds that three workshop office PCs display a full-screen message saying all business files have been locked. Job cards, invoice templates and customer contact lists are inaccessible. The message demands payment for a decryption key and warns that remaining files will be deleted if payment is not made.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Ransomware',
    correctCIA: ['Availability'],
    evidencePoints: [
      'Office PCs showed a message that business files had been locked.',
      'Job cards, invoices and contact lists could not be opened.',
      'Payment was demanded in exchange for a decryption key.'
    ],
    explanation: 'This is ransomware. The primary impact described is availability: the garage cannot access the files required to run day-to-day operations.'
  },
  {
    id: 5,
    title: 'Admin console accessed overnight',
    organisation: 'LocalGoods Online (online retailer)',
    scenario: 'The retailer’s security log shows a successful login to the e-commerce admin console at 02:14 using a privileged staff account. No staff member was working overnight. Product prices for several popular items were changed to £0.01 and a batch of customer shipping addresses was exported. The genuine account holder confirms they did not log in and their password had not been changed by them.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Unauthorised access',
    correctCIA: ['Confidentiality', 'Integrity'],
    evidencePoints: [
      'A privileged login occurred overnight when no staff were working.',
      'Product prices were altered without authorisation.',
      'Customer shipping addresses were exported from the system.'
    ],
    explanation: 'Someone gained unauthorised access to a privileged account. Confidentiality is affected because customer address data was exported. Integrity is affected because product prices were changed.'
  },
  {
    id: 6,
    title: 'Remote desktop into council systems',
    organisation: 'Northbank District Council',
    scenario: 'ICT monitoring detects an unfamiliar remote desktop session into a housing benefit processing workstation outside normal hours. The session used a contractor account that should have been disabled. Audit logs show several benefit claim records were opened and one claimant’s bank details field was edited. The contractor’s account had not been used for six months.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Unauthorised access',
    correctCIA: ['Confidentiality', 'Integrity'],
    evidencePoints: [
      'An unfamiliar remote session used a contractor account that should have been disabled.',
      'Benefit claim records were opened outside authorised use.',
      'A claimant’s bank details field was edited.'
    ],
    explanation: 'This is unauthorised access to a local authority system. Confidentiality is affected because claim records were viewed without authorisation. Integrity is affected because bank details were changed.'
  },
  {
    id: 7,
    title: 'Online shop unavailable at peak time',
    organisation: 'LocalGoods Online (online retailer)',
    scenario: 'During a weekend promotion, the retailer’s website becomes extremely slow and then returns repeated timeout errors. Network monitoring shows a sudden flood of traffic from thousands of external IP addresses targeting the public storefront. Legitimate customers cannot complete purchases for almost two hours until traffic filtering is applied.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Denial of service',
    correctCIA: ['Availability'],
    evidencePoints: [
      'The website slowed and then timed out during a busy promotion.',
      'Monitoring showed a flood of traffic from many external IP addresses.',
      'Customers could not complete purchases until filtering was applied.'
    ],
    explanation: 'This is a denial of service (DoS/DDoS) incident. The CIA aim affected is availability because customers could not use the online shop.'
  },
  {
    id: 8,
    title: 'College VLE knocked offline',
    organisation: 'Northbank College',
    scenario: 'On the morning of a major online assessment window, the college virtual learning environment becomes unreachable. Network engineers identify an unusually large volume of connection requests aimed at the VLE login page. Learners cannot submit coursework or access exam materials until the attack traffic is blocked and services are restored later that afternoon.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Denial of service',
    correctCIA: ['Availability'],
    evidencePoints: [
      'The VLE became unreachable during an assessment window.',
      'Engineers found an unusually large volume of connection requests to the login page.',
      'Learners could not submit work or access exam materials until services were restored.'
    ],
    explanation: 'This denial of service attack prevented legitimate use of the VLE. Availability is the CIA aim affected.'
  },
  {
    id: 9,
    title: 'Mis-sent staff spreadsheet',
    organisation: 'Riverside Community Clinic',
    scenario: 'A clinic administrator intends to email an anonymised activity summary to a partner organisation. By mistake they attach a spreadsheet that still contains full staff names, National Insurance numbers and home addresses. The email is sent to the correct external contact. The error is noticed twenty minutes later when a colleague reviews the sent folder.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Accidental data disclosure',
    correctCIA: ['Confidentiality'],
    evidencePoints: [
      'The wrong spreadsheet was attached to an external email.',
      'The file contained staff names, National Insurance numbers and home addresses.',
      'The email reached an external contact before the mistake was noticed.'
    ],
    explanation: 'This is accidental data disclosure rather than a deliberate cyber attack. Confidentiality is affected because personal staff data was shared with someone who should not have received it.'
  },
  {
    id: 10,
    title: 'Customer list left on shared drive',
    organisation: 'Greenfield Motors (small garage)',
    scenario: 'A trainee uploads a working copy of the customer contact list to a public folder on the business cloud drive so they can finish formatting it at home. The folder is readable by anyone with the company link, which has already been shared with several suppliers. The owner discovers the file two days later after a supplier mentions seeing customer mobile numbers.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Accidental data disclosure',
    correctCIA: ['Confidentiality'],
    evidencePoints: [
      'A customer contact list was placed in a public cloud folder.',
      'The folder link had already been shared with suppliers.',
      'A supplier reported seeing customer mobile numbers.'
    ],
    explanation: 'Personal customer data was exposed through an accidental disclosure. Confidentiality is the CIA aim affected.'
  },
  {
    id: 11,
    title: 'Trojan in a downloaded utility',
    organisation: 'Northbank District Council',
    scenario: 'An officer downloads a free PDF converter from an unofficial website to prepare committee papers. Shortly afterwards, endpoint protection alerts report a trojan on that workstation. Investigators find that a hidden process has been collecting keystrokes and that several draft documents have unexpected additional paragraphs inserted overnight.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Malware infection',
    correctCIA: ['Confidentiality', 'Integrity'],
    evidencePoints: [
      'Software was downloaded from an unofficial website.',
      'Endpoint protection reported a trojan and keystroke collection.',
      'Draft documents contained unexpected additional paragraphs.'
    ],
    explanation: 'This is a malware infection (trojan). Confidentiality is affected because keystrokes were collected. Integrity is affected because documents were altered without authorisation.'
  },
  {
    id: 12,
    title: 'Banking malware on a home laptop',
    organisation: 'Individual user (self-employed tutor)',
    scenario: 'A self-employed tutor notices that their home laptop runs slowly after installing a browser toolbar advertised on a free software site. Their online banking app later shows failed login attempts they did not make. A technician finds malware designed to capture banking credentials and discovers that browser form data for the tutor’s business email account has been harvested.',
    incidentOptions: INCIDENT_TYPES.slice(),
    correctIncidentType: 'Malware infection',
    correctCIA: ['Confidentiality'],
    evidencePoints: [
      'A browser toolbar was installed from a free software site.',
      'Unexpected failed banking login attempts appeared.',
      'Malware designed to capture credentials had harvested browser form data.'
    ],
    explanation: 'This malware infection targeted credentials and form data. Confidentiality is the CIA aim affected because sensitive login and form information was captured.'
  }
];
