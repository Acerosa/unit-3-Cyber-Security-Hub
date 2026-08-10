(function () {
  'use strict';

  var startedAt = new Date().toISOString();

  var data = window.Week2SixMarkGuide;
  var progress = window.Unit3Week2Progress;

  if (!data || !window.Unit3Week2Quiz) {
    return;
  }

  if (progress) {
    progress.markStarted(data.activityId);
  }

  function renderGuide() {
    var host = document.getElementById('w2-guide-host');
    if (!host) return;

    var structureSection = document.createElement('section');
    structureSection.className = 'panel';
    structureSection.setAttribute('aria-labelledby', 'structure-heading');
    var structureHeading = document.createElement('h2');
    structureHeading.id = 'structure-heading';
    structureHeading.textContent = data.structure.title;
    structureSection.appendChild(structureHeading);

    var pecGrid = document.createElement('div');
    pecGrid.className = 'w2-pec-grid';
    data.structure.points.forEach(function (point) {
      var card = document.createElement('article');
      card.className = 'w2-pec-card';
      var title = document.createElement('h3');
      title.textContent = point.letter + ' — ' + point.name;
      card.appendChild(title);
      var text = document.createElement('p');
      text.textContent = point.description;
      card.appendChild(text);
      pecGrid.appendChild(card);
    });
    structureSection.appendChild(pecGrid);
    host.appendChild(structureSection);

    var questionSection = document.createElement('section');
    questionSection.className = 'panel';
    questionSection.setAttribute('aria-labelledby', 'question-heading');
    var questionHeading = document.createElement('h2');
    questionHeading.id = 'question-heading';
    questionHeading.textContent = 'Exam-style question';
    questionSection.appendChild(questionHeading);
    var meta = document.createElement('p');
    meta.className = 'panel-note';
    meta.textContent =
      'Command word: ' +
      data.examQuestion.commandWord +
      ' · ' +
      data.examQuestion.marks +
      ' marks';
    questionSection.appendChild(meta);
    var qText = document.createElement('p');
    qText.className = 'w2-scenario';
    qText.textContent = data.examQuestion.text;
    questionSection.appendChild(qText);
    host.appendChild(questionSection);

    var compareSection = document.createElement('section');
    compareSection.className = 'panel';
    compareSection.setAttribute('aria-labelledby', 'compare-heading');
    var compareHeading = document.createElement('h2');
    compareHeading.id = 'compare-heading';
    compareHeading.textContent = 'Weak vs improved response';
    compareSection.appendChild(compareHeading);
    var twoCol = document.createElement('div');
    twoCol.className = 'w2-two-col';
    var weakBlock = document.createElement('article');
    weakBlock.className = 'w2-callout w2-weak-response';
    var weakTitle = document.createElement('h3');
    weakTitle.textContent = 'Weak response';
    weakBlock.appendChild(weakTitle);
    var weakP = document.createElement('p');
    weakP.textContent = data.weakResponse;
    weakBlock.appendChild(weakP);
    var improvedBlock = document.createElement('article');
    improvedBlock.className = 'w2-callout w2-improved-response';
    var improvedTitle = document.createElement('h3');
    improvedTitle.textContent = 'Improved response';
    improvedBlock.appendChild(improvedTitle);
    var improvedP = document.createElement('p');
    improvedP.textContent = data.improvedResponse;
    improvedBlock.appendChild(improvedP);
    twoCol.appendChild(weakBlock);
    twoCol.appendChild(improvedBlock);
    compareSection.appendChild(twoCol);
    host.appendChild(compareSection);

    var modelSection = document.createElement('section');
    modelSection.className = 'panel';
    modelSection.setAttribute('aria-labelledby', 'model-heading');
    var modelHeading = document.createElement('h2');
    modelHeading.id = 'model-heading';
    modelHeading.textContent = 'Annotated model answer';
    modelSection.appendChild(modelHeading);
    data.modelAnswer.forEach(function (part) {
      var block = document.createElement('article');
      block.className = 'w2-model-part';
      var partTitle = document.createElement('h3');
      partTitle.textContent = part.part;
      block.appendChild(partTitle);
      var partText = document.createElement('p');
      partText.textContent = part.text;
      block.appendChild(partText);
      var annotation = document.createElement('p');
      annotation.className = 'panel-note w2-annotation';
      annotation.textContent = part.annotation;
      block.appendChild(annotation);
      modelSection.appendChild(block);
    });
    host.appendChild(modelSection);

    var planSection = document.createElement('section');
    planSection.className = 'panel';
    planSection.setAttribute('aria-labelledby', 'plan-heading');
    var planHeading = document.createElement('h2');
    planHeading.id = 'plan-heading';
    planHeading.textContent = 'Planning area';
    planSection.appendChild(planHeading);
    var planNote = document.createElement('p');
    planNote.className = 'panel-note';
    planNote.textContent =
      'Draft three PEC chains before you write. This is for practice — it is not submitted.';
    planSection.appendChild(planNote);
    var planGrid = document.createElement('div');
    planGrid.className = 'w2-plan-grid';
    ['Point 1 + Explanation + Context', 'Point 2 + Explanation + Context', 'Point 3 (optional)'].forEach(
      function (label, i) {
        var group = document.createElement('div');
        group.className = 'form-group';
        var lbl = document.createElement('label');
        var planId = 'plan-area-' + i;
        lbl.setAttribute('for', planId);
        lbl.textContent = label;
        group.appendChild(lbl);
        var textarea = document.createElement('textarea');
        textarea.id = planId;
        textarea.className = 'form-control';
        textarea.rows = 4;
        group.appendChild(textarea);
        planGrid.appendChild(group);
      }
    );
    planSection.appendChild(planGrid);
    host.appendChild(planSection);

    var startersSection = document.createElement('section');
    startersSection.className = 'panel';
    startersSection.setAttribute('aria-labelledby', 'starters-heading');
    var startersHeading = document.createElement('h2');
    startersHeading.id = 'starters-heading';
    startersHeading.textContent = 'Sentence-building starters';
    startersSection.appendChild(startersHeading);
    var startersList = document.createElement('ul');
    startersList.className = 'section-list';
    data.sentenceStarters.forEach(function (starter) {
      var li = document.createElement('li');
      li.textContent = starter;
      startersList.appendChild(li);
    });
    startersSection.appendChild(startersList);

    var buildGroup = document.createElement('div');
    buildGroup.className = 'form-group';
    var buildLabel = document.createElement('label');
    buildLabel.setAttribute('for', 'sentence-build');
    buildLabel.textContent = 'Build one sentence using a starter';
    buildGroup.appendChild(buildLabel);
    var buildArea = document.createElement('textarea');
    buildArea.id = 'sentence-build';
    buildArea.className = 'form-control';
    buildArea.rows = 3;
    buildArea.setAttribute(
      'placeholder',
      'Use a starter above to write one PEC sentence about Northbank phishing…'
    );
    buildGroup.appendChild(buildArea);
    startersSection.appendChild(buildGroup);
    host.appendChild(startersSection);
  }

  renderGuide();

  window.Unit3Week2Quiz.createQuiz({
    activityId: data.activityId,
    questions: data.questions.slice(),
    onComplete: function (result) {
      window.Unit3Week2Submit.renderSubmitPanel({
        activityId: data.activityId,
        getScore: function () {
          return result.score;
        },
        getTotal: function () {
          return result.total;
        },
        getQuestionsForReview: function () {
          return result.incorrectIndexes;
        },
        getCompletionTimeSeconds: function () {
          return result.completionTimeSeconds;
        },

        getResponses: function () {
          var evidence = window.Unit3SupabaseEvidence;
          if (evidence && evidence.fromQuizResult) {
            return evidence.fromQuizResult(result, data.questions);
          }
          return (result.answers || []).map(function (answer, index) {
            var question = (data.questions)[index] || {};
            return {
              questionId: question.id || answer.questionId,
              response: { chosenIndex: answer.chosenIndex },
              correct: Boolean(answer.correct),
              score: answer.correct ? 1 : 0,
              responseType: 'single-choice'
            };
          });
        },
        getStartedAt: function () { return startedAt; },
        getCompletedAt: function () { return new Date().toISOString(); },
        canSubmit: function () {
          return true;
        }
      });
    },
    onRetry: function () {
      var submitHost = document.getElementById('w2-submit-host');
      if (submitHost) {
        submitHost.hidden = true;
        submitHost.textContent = '';
      }
    }
  });
})();
