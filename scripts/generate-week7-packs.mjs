/**
 * Generate Week 7 activity shells, data modules and apps from curriculum brief.
 * Run: node scripts/generate-week7-packs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const week7 = path.join(root, 'week-7');

const ACTIVITIES = [
  {
    folder: 'session1-retrieval',
    number: 1,
    title: 'Session 1 Retrieval and Prior Learning',
    subtitle:
      'Recall Cyber Essentials, revisit the Week 2 vulnerability register, and separate threat from vulnerability.',
    globalName: 'Week7Session1Retrieval',
    dataFile: 'session1-retrieval.js',
    needsQuiz: true
  },
  {
    folder: 'risk-management-learning',
    number: 2,
    title: 'Cyber Security Risk Management Learning',
    subtitle:
      'Stages of risk management, including mitigate, accept and prioritise decisions for Northbank.',
    globalName: 'Week7RiskManagementLearning',
    dataFile: 'risk-management-learning.js',
    needsQuiz: true
  },
  {
    folder: 'risk-register',
    number: 3,
    title: 'Northbank Risk Register',
    subtitle:
      'Convert Week 2 vulnerabilities into a risk register with cost-benefit reasoning and justified decisions.',
    globalName: 'Week7RiskRegister',
    dataFile: 'risk-register.js',
    needsQuiz: false
  },
  {
    folder: 'testing-methods',
    number: 4,
    title: 'Vulnerability Testing Methods',
    subtitle:
      'Penetration testing, fuzzing, security functionality testing and sandboxing.',
    globalName: 'Week7TestingMethods',
    dataFile: 'testing-methods.js',
    needsQuiz: true
  },
  {
    folder: 'sandbox-observation',
    number: 5,
    title: 'Safe Sandboxing Demonstration Record',
    subtitle:
      'Record observations from the tutor-led sandboxed file-analysis demonstration.',
    globalName: 'Week7SandboxObservation',
    dataFile: 'sandbox-observation.js',
    needsQuiz: false
  },
  {
    folder: 'detection-prevention',
    number: 6,
    title: 'Detection and Prevention Comparison',
    subtitle:
      'Intrusion detection and prevention, NIDS, HIDS, DIDS, anomaly-based and signature-based detection, and honeypots.',
    globalName: 'Week7DetectionPrevention',
    dataFile: 'detection-prevention.js',
    needsQuiz: true
  },
  {
    folder: 'heightened-threat',
    number: 7,
    title: 'NCSC Heightened Cyber Threat Decision Log',
    subtitle:
      'Facilitated companion for NCSC Exercise in a Box: Heightened cyber threat.',
    globalName: 'Week7HeightenedThreat',
    dataFile: 'heightened-threat.js',
    needsQuiz: false
  },
  {
    folder: 'session2-retrieval',
    number: 8,
    title: 'Session 2 Retrieval Quiz',
    subtitle:
      'Detection versus prevention, testing methods, risk terminology and monitoring measures.',
    globalName: 'Week7Session2Retrieval',
    dataFile: 'session2-retrieval.js',
    needsQuiz: true
  },
  {
    folder: 'testing-matching',
    number: 9,
    title: 'Testing and Monitoring Matching',
    subtitle:
      'Match testing or monitoring measures to situations and justify defensible alternatives.',
    globalName: 'Week7TestingMatching',
    dataFile: 'testing-matching.js',
    needsQuiz: false
  },
  {
    folder: 'recommendation-practice',
    number: 10,
    title: 'Justified Recommendation Practice',
    subtitle:
      'Name the measure, explain why it suits Northbank, and state how effectiveness is judged.',
    globalName: 'Week7RecommendationPractice',
    dataFile: 'recommendation-practice.js',
    needsQuiz: false
  },
  {
    folder: 'ocr-practice',
    number: 11,
    title: 'OCR-Style Timed Questions',
    subtitle:
      'OCR-style practice on risk management, testing, monitoring and justified recommendations.',
    globalName: 'Week7OcrPractice',
    dataFile: 'ocr-practice.js',
    needsQuiz: false
  },
  {
    folder: 'answer-improvement',
    number: 12,
    title: 'Marking and Answer Improvement',
    subtitle:
      'Improve a recommendation that lacks organisational context and a measurable effectiveness criterion.',
    globalName: 'Week7AnswerImprovement',
    dataFile: 'answer-improvement.js',
    needsQuiz: false
  },
  {
    folder: 'directed-study',
    number: null,
    title: 'Directed Independent Study',
    subtitle:
      'Cisco risk-management material, TryHackMe OpenVAS and Intro to Logs, plus product research for Week 8.',
    globalName: 'Week7DirectedStudy',
    dataFile: 'directed-study.js',
    needsQuiz: false,
    unscored: true
  },
  {
    folder: 'support-challenge',
    number: null,
    title: 'Support and Challenge',
    subtitle:
      'Sentence starters, scoring guide prompts and optional challenge tasks for Week 7.',
    globalName: 'Week7SupportChallenge',
    dataFile: 'support-challenge.js',
    needsQuiz: false,
    unscored: true
  }
];

function activityShell(a) {
  const num = a.number != null ? a.number + '. ' : '';
  const quizScript = a.needsQuiz
    ? '\n  <script src="../../js/week7-quiz.js"></script>'
    : '';
  const scoredScripts = a.unscored
    ? `  <script src="../../js/navigation.js"></script>
  <script src="../../js/session-disclosure.js"></script>
  <script src="../../js/week7-progress.js"></script>
  <script src="../data/${a.dataFile}"></script>
  <script src="app.js"></script>`
    : `  <script src="../../js/navigation.js"></script>
  <script src="../../js/session-disclosure.js"></script>
  <script src="../../js/activity-utils.js"></script>
  <script src="../../js/course-context.js"></script>
  <script src="../../js/activity-engine-config.js"></script>
  <script src="../../js/learner-details.js"></script>
  <script src="../../js/submissions.js"></script>
  <script src="../../js/week7-progress.js"></script>
  <script src="../../js/week7-submit.js"></script>${quizScript}
  <script src="../data/${a.dataFile}"></script>
  <script src="app.js"></script>`;

  const submitHost = a.unscored
    ? ''
    : '\n    <section id="w7-submit-host" class="panel" hidden></section>';

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeAttr(a.subtitle)}">
  <title>${escapeAttr(num + a.title)} | Week 7</title>
  <link rel="stylesheet" href="../../css/main.css">
  <link rel="stylesheet" href="../../css/activity.css">
  <link rel="stylesheet" href="../css/week7.css">
</head>
<body class="week-7-page">
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header" role="banner">
    <div class="header-bar">
      <a class="site-brand" href="../../index.html">
        <p class="brand-title">Unit 3 Cyber Security Hub</p>
        <p class="brand-tagline">OCR Level 3 IT</p>
      </a>
      <button type="button" class="nav-toggle" id="nav-toggle" aria-controls="site-navigation" aria-expanded="false" aria-label="Open main menu">Menu</button>
      <nav class="site-nav" id="site-navigation" aria-label="Main">
        <ul class="nav-list">
          <li><a href="../../index.html">Home</a></li>
          <li><a href="../../week-1/">Week 1</a></li>
          <li><a href="../../week-2/">Week 2</a></li>
          <li><a href="../../week-3/">Week 3</a></li>
          <li><a href="../../week-4/">Week 4</a></li>
          <li><a href="../../week-5/">Week 5</a></li>
          <li><a href="../../week-6/">Week 6</a></li>
          <li><a href="../">Week 7</a></li>
          <li><a href="../../resources/">Resources</a></li>
          <li><a href="../../help/">Help</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li><a href="../../index.html">Home</a><span class="breadcrumb-sep" aria-hidden="true"> &gt; </span></li>
      <li><a href="../">Week 7: Risk Management, Testing and Monitoring</a><span class="breadcrumb-sep" aria-hidden="true"> &gt; </span></li>
      <li><span aria-current="page">${escapeHtml(a.title)}</span></li>
    </ol>
  </nav>
  <header class="page-header activity-shell">
    <h1>${escapeHtml(num + a.title)}</h1>
    <p class="page-subtitle">${escapeHtml(a.subtitle)}</p>
  </header>
  <main id="main-content" class="site-main" tabindex="-1">
    <div id="w7-activity-host" tabindex="-1"></div>${submitHost}
  </main>
  <footer class="site-footer" role="contentinfo">
    <p><a href="../">Back to Week 7</a> · <a href="../../week-6/">Week 6</a> · <a href="../../index.html">Hub home</a></p>
  </footer>
${scoredScripts}
</body>
</html>
`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, '&#39;');
}

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('wrote', rel);
}

// Overview page
write(
  'week-7/index.html',
  `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Week 7 overview for OCR Level 3 IT Unit 3 Cyber Security: risk management, testing and monitoring.">
  <title>Week 7: Risk Management, Testing and Monitoring</title>
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/activity.css">
  <link rel="stylesheet" href="css/week7.css">
</head>
<body class="week-7-page">
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header" role="banner">
    <div class="header-bar">
      <a class="site-brand" href="../index.html">
        <p class="brand-title">Unit 3 Cyber Security Hub</p>
        <p class="brand-tagline">OCR Level 3 IT</p>
      </a>
      <button type="button" class="nav-toggle" id="nav-toggle" aria-controls="site-navigation" aria-expanded="false" aria-label="Open main menu">Menu</button>
      <nav class="site-nav" id="site-navigation" aria-label="Main">
        <ul class="nav-list">
          <li><a href="../index.html">Home</a></li>
          <li><a href="../week-1/">Week 1</a></li>
          <li><a href="../week-2/">Week 2</a></li>
          <li><a href="../week-3/">Week 3</a></li>
          <li><a href="../week-4/">Week 4</a></li>
          <li><a href="../week-5/">Week 5</a></li>
          <li><a href="../week-6/">Week 6</a></li>
          <li><a href="./" aria-current="page">Week 7</a></li>
          <li><a href="../resources/">Resources</a></li>
          <li><a href="../help/">Help</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li><a href="../index.html">Home</a><span class="breadcrumb-sep" aria-hidden="true"> &gt; </span></li>
      <li><span aria-current="page">Week 7: Risk Management, Testing and Monitoring</span></li>
    </ol>
  </nav>
  <header class="page-header">
    <p class="panel-note">
      <span class="status-label status-label-active" role="status">LO3</span>
      <span class="status-label status-label-idle" role="status">Teaching content 3.1</span>
      <span class="status-label status-label-idle" role="status">Teaching content 3.2</span>
    </p>
    <h1>Week 7: Risk Management, Testing and Monitoring</h1>
    <p class="page-subtitle">LO3 - Understand measures used to protect against cyber security incidents. OCR specification sections 3.1 Cyber security risk management and 3.2 Testing and monitoring measures.</p>
  </header>
  <main id="main-content" class="site-main" tabindex="-1">
    <section class="panel" aria-labelledby="w7-outcomes-heading">
      <h2 id="w7-outcomes-heading">Weekly learning outcomes</h2>
      <ul class="section-list">
        <li>Explain the stages of cyber security risk management, including asset identification and risk analysis.</li>
        <li>Apply cost-and-benefit reasoning when deciding how to mitigate a risk.</li>
        <li>Describe vulnerability-testing methods, including penetration testing, fuzzing, security functionality testing and sandboxing.</li>
        <li>Compare intrusion detection and intrusion prevention systems.</li>
        <li>Justify the use of testing and monitoring measures in a specific organisational context.</li>
      </ul>
      <div class="w7-def-grid" role="list">
        <article class="w7-def-card" role="listitem"><h3>Asset</h3><p>Something valuable that needs protection.</p></article>
        <article class="w7-def-card" role="listitem"><h3>Threat</h3><p>Something capable of causing harm.</p></article>
        <article class="w7-def-card" role="listitem"><h3>Vulnerability</h3><p>A weakness that can be exploited.</p></article>
        <article class="w7-def-card" role="listitem"><h3>Risk</h3><p>The combination of the likelihood and impact of harm.</p></article>
      </div>
      <p class="w7-formula" role="note">Risk is not another word for threat. Threat, vulnerability and risk must stay separate terms.</p>
    </section>
    <section class="panel" aria-labelledby="w7-northbank-heading">
      <h2 id="w7-northbank-heading">Connection to previous Northbank work</h2>
      <p>This week you convert the Week 2 Northbank vulnerability register into a risk register. You do not start the asset list again. You will also reuse cost, operational and stakeholder thinking from Week 6 and the NCSC Exercise in a Box classroom pattern from Weeks 5 and 6.</p>
    </section>
    <section class="panel" aria-labelledby="w7-exam-heading">
      <h2 id="w7-exam-heading">Examination focus</h2>
      <ul class="section-list">
        <li>Use risk, threat and vulnerability as separate terms.</li>
        <li>Tie recommendations to features of the organisation described.</li>
        <li>Justify why a measure is suitable and how effectiveness would be judged.</li>
        <li>Include cost-and-benefit reasoning and recognise that accepting a risk can be legitimate.</li>
        <li>Compare a chosen measure with a less appropriate alternative.</li>
      </ul>
    </section>
    <section class="panel" aria-labelledby="w7-sessions-heading">
      <h2 id="w7-sessions-heading">Session summaries</h2>
      <ul class="section-list">
        <li><strong>Session 1:</strong> Prior-learning retrieval, risk-management learning, Northbank risk register, testing methods, sandbox observation, detection and prevention, then the Heightened cyber threat decision log.</li>
        <li><strong>Session 2:</strong> Retrieval quiz, testing and monitoring matching, justified recommendation practice, OCR-style questions and answer improvement.</li>
      </ul>
    </section>
    <section class="panel" aria-labelledby="w7-progress-heading">
      <h2 id="w7-progress-heading">Your Week 7 progress</h2>
      <div id="w7-completion" class="w7-completion-banner" aria-live="polite"></div>
      <p class="panel-note">Progress is stored in this browser only and is separate from Weeks 1 to 6. Opening a page does not complete an activity.</p>
    </section>
    <details class="session-disclosure panel" id="session-1" open>
      <summary class="session-disclosure__summary">
        <span class="session-disclosure__text">
          <h2 id="session-1-heading" class="session-disclosure__heading">Session 1: Risk management, testing and monitoring</h2>
          <span class="session-disclosure__meta">7 scored activities</span>
          <span class="visually-hidden">. Show or hide Session 1 activities</span>
        </span>
        <span class="session-disclosure__icon" aria-hidden="true"></span>
      </summary>
      <div class="session-disclosure__content">
        <p class="panel-note">Convert the vulnerability register into a risk register, learn testing methods, compare detection and prevention, then support the facilitated NCSC exercise.</p>
        <div class="card-grid" id="w7-session-1-cards" data-session="1"></div>
      </div>
    </details>
    <section class="panel w7-platform-section" aria-labelledby="w7-ncsc-heading">
      <h2 id="w7-ncsc-heading">NCSC Exercise in a Box (facilitated)</h2>
      <p class="panel-note">Opening the NCSC site does not complete a scored Week 7 activity. Completion requires decision-log entries linked to the risk register during the facilitated session.</p>
      <div class="card-grid" id="w7-ncsc-cards"></div>
    </section>
    <details class="session-disclosure panel" id="session-2">
      <summary class="session-disclosure__summary">
        <span class="session-disclosure__text">
          <h2 id="session-2-heading" class="session-disclosure__heading">Session 2: Retrieval, matching and examination practice</h2>
          <span class="session-disclosure__meta">5 scored activities</span>
          <span class="visually-hidden">. Show or hide Session 2 activities</span>
        </span>
        <span class="session-disclosure__icon" aria-hidden="true"></span>
      </summary>
      <div class="session-disclosure__content">
        <p class="panel-note">Retrieve key distinctions, match measures to situations, practise justified recommendations and complete OCR-style questions.</p>
        <div class="card-grid" id="w7-session-2-cards" data-session="2"></div>
      </div>
    </details>
    <details class="session-disclosure panel" id="directed-study">
      <summary class="session-disclosure__summary">
        <span class="session-disclosure__text">
          <h2 class="session-disclosure__heading">Directed independent study</h2>
          <span class="session-disclosure__meta">About 1 hour 45 minutes · Cisco · OpenVAS · Intro to Logs · Product research</span>
          <span class="visually-hidden">. Show or hide directed study</span>
        </span>
        <span class="session-disclosure__icon" aria-hidden="true"></span>
      </summary>
      <div class="session-disclosure__content">
        <p class="panel-note">Unscored guidance. Product research summaries will be used during Week 8 retrieval.</p>
        <p><a class="btn btn-secondary" href="directed-study/">Open directed independent study</a></p>
      </div>
    </details>
    <details class="session-disclosure panel" id="support-challenge">
      <summary class="session-disclosure__summary">
        <span class="session-disclosure__text">
          <h2 class="session-disclosure__heading">Support and challenge</h2>
          <span class="session-disclosure__meta">Sentence starters · Scoring prompts · Optional challenge</span>
          <span class="visually-hidden">. Show or hide support and challenge</span>
        </span>
        <span class="session-disclosure__icon" aria-hidden="true"></span>
      </summary>
      <div class="session-disclosure__content">
        <p class="panel-note">Support is optional. Confident learners should attempt the main tasks independently first.</p>
        <p><a class="btn btn-secondary" href="support-challenge/">Open support and challenge</a></p>
      </div>
    </details>
    <section class="panel" aria-labelledby="w7-related-heading">
      <h2 id="w7-related-heading">Related weeks</h2>
      <ul class="section-list">
        <li><a href="../week-2/">Week 2</a> - Northbank vulnerability register</li>
        <li><a href="../week-5/">Week 5</a> - Impacts and Exercise in a Box companion pattern</li>
        <li><a href="../week-6/">Week 6</a> - Cost, operational and stakeholder considerations</li>
      </ul>
    </section>
  </main>
  <footer class="site-footer" role="contentinfo">
    <p>Unit 3 Cyber Security Hub - Week 7 formative learning resources</p>
  </footer>
  <script src="../js/navigation.js"></script>
  <script src="../js/session-disclosure.js"></script>
  <script src="../js/week7-progress.js"></script>
  <script src="js/dashboard.js"></script>
</body>
</html>
`
);

write(
  'week-7/js/dashboard.js',
  `/**
 * Week 7 landing dashboard.
 */
(function () {
  'use strict';
  var progress = window.Unit3Week7Progress;
  if (!progress) return;

  function statusClass(status) {
    if (status === 'completed') return 'status-label-complete';
    if (status === 'in-progress') return 'status-label-progress';
    return 'status-label-idle';
  }
  function statusMarker(status) {
    if (status === 'completed') return '●';
    if (status === 'in-progress') return '◐';
    return '○';
  }
  function renderCompletion() {
    var host = document.getElementById('w7-completion');
    if (!host) return;
    var summary = progress.getCompletionSummary();
    host.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = summary.completed + ' of ' + summary.total + ' activities completed';
    host.appendChild(strong);
    var detail = document.createElement('span');
    detail.textContent =
      summary.inProgress + ' in progress · ' + summary.notStarted + ' not started';
    host.appendChild(detail);
  }
  function renderCard(item) {
    var state = progress.getActivityState(item.activityId);
    var article = document.createElement('article');
    article.className = 'hub-card';
    article.setAttribute('aria-labelledby', 'w7-item-' + item.number + '-heading');
    var status = document.createElement('span');
    status.className = 'status-label ' + statusClass(state.status);
    status.setAttribute('role', 'status');
    status.appendChild(
      document.createTextNode(statusMarker(state.status) + ' ' + progress.statusLabel(state.status))
    );
    article.appendChild(status);
    var heading = document.createElement('h3');
    heading.id = 'w7-item-' + item.number + '-heading';
    heading.textContent = item.number + '. ' + item.title;
    article.appendChild(heading);
    var description = document.createElement('p');
    description.textContent = item.description;
    article.appendChild(description);
    var meta = document.createElement('ul');
    meta.className = 'activity-meta';
    meta.innerHTML =
      '<li>Type: ' +
      item.type +
      '</li><li>About ' +
      item.estimatedMinutes +
      ' minutes</li><li>Total: ' +
      item.total +
      '</li>';
    article.appendChild(meta);
    if (state.status === 'completed' && state.score != null) {
      var score = document.createElement('p');
      score.className = 'activity-score';
      score.textContent =
        'Last score: ' + state.score + ' / ' + (state.total != null ? state.total : item.total);
      article.appendChild(score);
    }
    var link = document.createElement('a');
    link.className = 'card-link';
    link.href = item.path;
    link.textContent = progress.buttonLabel(state.status) + ' ' + item.title;
    article.appendChild(link);
    return article;
  }
  function renderSession(sessionNumber, hostId) {
    var host = document.getElementById(hostId);
    if (!host) return;
    host.textContent = '';
    progress.ACTIVITY_CATALOG.filter(function (item) {
      return item.session === sessionNumber;
    }).forEach(function (item) {
      host.appendChild(renderCard(item));
    });
  }
  function renderNcsc() {
    var host = document.getElementById('w7-ncsc-cards');
    if (!host) return;
    host.textContent = '';
    var guidance = document.createElement('article');
    guidance.className = 'hub-card w7-ncsc-card';
    var platform = document.createElement('p');
    platform.className = 'w7-thm-platform';
    platform.textContent = 'NCSC';
    guidance.appendChild(platform);
    var badge = document.createElement('span');
    badge.className = 'status-label status-label-progress';
    badge.textContent = 'Tutor-facilitated';
    guidance.appendChild(badge);
    var h = document.createElement('h3');
    h.textContent = 'Heightened cyber threat';
    guidance.appendChild(h);
    var p = document.createElement('p');
    p.textContent =
      'Northbank Community Health Partnership. Use the decision log companion and link every proposed action to a risk-register entry. Follow tutor-facilitated NCSC materials; do not invent exercise prompts.';
    guidance.appendChild(p);
    var actions = document.createElement('div');
    actions.className = 'w7-actions';
    var recordLink = document.createElement('a');
    recordLink.className = 'btn btn-primary';
    recordLink.href = 'heightened-threat/';
    recordLink.textContent = 'Open decision log';
    actions.appendChild(recordLink);
    var open = document.createElement('a');
    open.className = 'btn btn-secondary w7-thm-external-link';
    open.href = 'https://www.ncsc.gov.uk/section/exercise-in-a-box/heightened-cyber-threat';
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'Open NCSC Heightened cyber threat (opens in a new tab)';
    var icon = document.createElement('span');
    icon.className = 'w7-external-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = ' ↗';
    open.appendChild(icon);
    actions.appendChild(open);
    guidance.appendChild(actions);
    host.appendChild(guidance);
  }
  renderCompletion();
  renderSession(1, 'w7-session-1-cards');
  renderSession(2, 'w7-session-2-cards');
  renderNcsc();
})();
`
);

for (const a of ACTIVITIES) {
  write(`week-7/${a.folder}/index.html`, activityShell(a));
}

console.log('Shells and overview generated. Content packs are written by companion files.');
