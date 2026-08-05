/**
 * Renders Activity API content into the generic activity page.
 * Does not contain activity-specific questions or answer keys.
 */

(function (global) {
  'use strict';

  var utils = global.Unit3ActivityUtils || {};
  var el = utils.el;

  function ensureEl() {
    if (el) return;
    el = function (tag, attrs, children) {
      var node = document.createElement(tag);
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          var value = attrs[key];
          if (key === 'className') node.className = value;
          else if (key === 'textContent') node.textContent = value;
          else if (key === 'htmlFor') node.htmlFor = value;
          else if (value !== null && value !== undefined && value !== false) {
            node.setAttribute(key, value === true ? '' : String(value));
          }
        });
      }
      (children || []).forEach(function (child) {
        if (child == null) return;
        node.appendChild(
          typeof child === 'string' ? document.createTextNode(child) : child
        );
      });
      return node;
    };
  }

  function sortByDisplayOrder(items) {
    return (items || []).slice().sort(function (a, b) {
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
  }

  function renderContentBlock(block) {
    ensureEl();
    var article = el('article', {
      className: 'ae-content-block ae-block-' + (block.blockType || 'information'),
      id: block.blockId || undefined
    });
    if (block.heading) {
      article.appendChild(el('h4', { textContent: block.heading }));
    }
    var typeLabel = {
      information: 'Information',
      checklist: 'Checklist',
      definition: 'Definition',
      'worked-example': 'Worked example',
      'model-answer': 'Model answer',
      tip: 'Tip',
      warning: 'Warning'
    }[block.blockType];
    if (typeLabel) {
      article.appendChild(
        el('p', { className: 'ae-block-type', textContent: typeLabel })
      );
    }
    if (block.content) {
      article.appendChild(el('p', { textContent: block.content }));
    }
    return article;
  }

  function findItemResult(markResult, questionId) {
    if (!markResult || !markResult.results) return null;
    for (var i = 0; i < markResult.results.length; i += 1) {
      if (markResult.results[i].questionId === questionId) {
        return markResult.results[i];
      }
    }
    return null;
  }

  function appendQuestionFeedback(fieldset, itemResult, question) {
    if (!itemResult) return;
    var feedback = el('div', {
      className: 'ae-question-feedback',
      role: 'region',
      'aria-label': 'Feedback for ' + (itemResult.questionId || 'question')
    });
    var statusLabel =
      itemResult.status === 'correct'
        ? 'Correct'
        : itemResult.status === 'partial'
          ? 'Partial credit'
          : itemResult.status === 'completed'
            ? 'Completed'
            : 'Requires review';
    var awarded =
      itemResult.marksAwarded != null
        ? itemResult.marksAwarded
        : itemResult.marks != null
          ? itemResult.marks
          : null;
    var available =
      itemResult.maximumMarks != null
        ? itemResult.maximumMarks
        : itemResult.marksAvailable != null
          ? itemResult.marksAvailable
          : question && (question.marks != null || question.maximumMarks != null)
            ? question.marks != null
              ? question.marks
              : question.maximumMarks
            : null;
    var marksSuffix =
      awarded != null && available != null
        ? itemResult.status === 'completed'
          ? ' · Response recorded'
          : ' · ' + awarded + ' / ' + available
        : '';
    feedback.appendChild(
      el('p', {
        textContent: statusLabel + marksSuffix
      })
    );
    if (itemResult.feedback) {
      feedback.appendChild(el('p', { textContent: itemResult.feedback }));
    }
    if (itemResult.explanation) {
      feedback.appendChild(el('p', { textContent: itemResult.explanation }));
    }
    if (itemResult.correctValue != null && itemResult.correctValue !== '') {
      var correctText =
        typeof itemResult.correctValue === 'object'
          ? [
              itemResult.correctValue.incidentType
                ? 'Incident type: ' + itemResult.correctValue.incidentType
                : '',
              itemResult.correctValue.ciaAim
                ? 'CIA aim: ' + itemResult.correctValue.ciaAim
                : '',
              itemResult.correctValue.evidence
                ? 'Evidence: ' + itemResult.correctValue.evidence
                : ''
            ]
              .filter(Boolean)
              .join(' · ')
          : String(itemResult.correctValue);
      if (correctText) {
        feedback.appendChild(
          el('p', { textContent: 'Correct response: ' + correctText })
        );
      }
    }
    fieldset.appendChild(feedback);
  }

  function splitClassificationOptions(options) {
    var incident = [];
    var cia = [];
    var other = [];
    sortByDisplayOrder(options).forEach(function (option) {
      var id = String(option.optionId || '');
      if (id.indexOf('CIA-') === 0) {
        cia.push(option);
      } else if (id.indexOf('INCIDENT-') === 0) {
        incident.push(option);
      } else {
        other.push(option);
      }
    });
    return { incident: incident, cia: cia, other: other };
  }

  function renderOptionRadios(questionId, groupName, options, selectedId, itemResult, onPick) {
    var list = el('ul', { className: 'ae-choice-list' });
    options.forEach(function (option) {
      var inputId = questionId + '-' + option.optionId;
      var input = el('input', {
        type: 'radio',
        name: groupName,
        id: inputId,
        value: option.optionId
      });
      if (selectedId === option.optionId) input.checked = true;
      input.addEventListener('change', function () {
        onPick(option.optionId);
      });

      var labelClass = 'ae-choice';
      if (itemResult) {
        var correct = itemResult.correctValue;
        var correctId =
          typeof correct === 'object' && correct
            ? groupName.indexOf('-incident') !== -1
              ? correct.incidentType
              : correct.ciaAim
            : correct;
        if (correctId && option.optionId === correctId) {
          labelClass += ' is-correct-option';
        } else if (selectedId === option.optionId && itemResult.status !== 'correct') {
          labelClass += ' is-incorrect-selected';
        }
      }

      list.appendChild(
        el('li', null, [
          el('label', { className: labelClass, htmlFor: inputId }, [
            input,
            el('span', { textContent: option.text || option.optionId })
          ])
        ])
      );
    });
    return list;
  }

  function renderClassificationQuestion(question, state, itemResult, handlers, fieldset) {
    var qid = question.questionId;
    var current = state.responses[qid] || {};
    if (typeof current !== 'object' || current === null) {
      current = {};
    }
    var groups = splitClassificationOptions(question.options || []);

    var evidenceId = qid + '-evidence';
    var minChars = question.minimumCharacters != null ? question.minimumCharacters : 1;
    var maxChars = question.maximumCharacters != null ? question.maximumCharacters : 300;

    function readLiveValue() {
      var incidentInput = fieldset.querySelector(
        'input[name="question-' + qid + '-incident"]:checked'
      );
      var ciaInput = fieldset.querySelector(
        'input[name="question-' + qid + '-cia"]:checked'
      );
      var evidenceNode = document.getElementById(evidenceId);
      return {
        incidentType: incidentInput ? incidentInput.value : current.incidentType || '',
        ciaAim: ciaInput ? ciaInput.value : current.ciaAim || '',
        evidence: evidenceNode ? evidenceNode.value : current.evidence || ''
      };
    }

    function emit(opts) {
      if (handlers && handlers.onAnswer) {
        handlers.onAnswer(qid, readLiveValue(), opts || {});
      }
    }

    if (groups.incident.length) {
      fieldset.appendChild(
        el('p', {
          className: 'ae-classification-label',
          id: qid + '-incident-label',
          textContent: 'Incident type'
        })
      );
      var incidentList = renderOptionRadios(
        qid,
        'question-' + qid + '-incident',
        groups.incident,
        current.incidentType || '',
        itemResult,
        function () {
          emit({});
        }
      );
      incidentList.setAttribute('aria-labelledby', qid + '-incident-label');
      fieldset.appendChild(incidentList);
    }

    if (groups.cia.length) {
      fieldset.appendChild(
        el('p', {
          className: 'ae-classification-label',
          id: qid + '-cia-label',
          textContent: 'Affected CIA aim'
        })
      );
      var ciaList = renderOptionRadios(
        qid,
        'question-' + qid + '-cia',
        groups.cia,
        current.ciaAim || '',
        itemResult,
        function () {
          emit({});
        }
      );
      ciaList.setAttribute('aria-labelledby', qid + '-cia-label');
      fieldset.appendChild(ciaList);
    }

    fieldset.appendChild(
      el('label', {
        className: 'ae-classification-label',
        htmlFor: evidenceId,
        textContent: 'Evidence from the scenario'
      })
    );
    var textarea = el('textarea', {
      id: evidenceId,
      className: 'ae-evidence-input',
      name: 'evidence-' + qid,
      rows: '3',
      maxlength: String(maxChars),
      'aria-describedby': qid + '-evidence-hint'
    });
    textarea.value = current.evidence || '';
    textarea.addEventListener('input', function () {
      emit({ deferRender: true });
    });
    textarea.addEventListener('blur', function () {
      emit({});
    });
    fieldset.appendChild(textarea);
    fieldset.appendChild(
      el('p', {
        id: qid + '-evidence-hint',
        className: 'ae-evidence-hint',
        textContent:
          'Enter at least ' +
          minChars +
          ' characters (maximum ' +
          maxChars +
          ').'
      })
    );

    appendQuestionFeedback(fieldset, itemResult, question);
    return fieldset;
  }

  function renderTextResponseQuestion(question, state, itemResult, handlers, fieldset, options) {
    options = options || {};
    var qid = question.questionId;
    var current = String(state.responses[qid] || '');
    var minChars =
      question.minimumCharacters != null ? Number(question.minimumCharacters) : 1;
    var maxChars =
      question.maximumCharacters != null ? Number(question.maximumCharacters) : 500;
    var inputId = 'response-' + qid;
    var hintId = qid + '-response-hint';
    var countId = qid + '-response-count';
    var forceMultiline = options.forceMultiline === true;
    var useTextarea = forceMultiline || maxChars > 120;
    var classPrefix =
      options.classPrefix ||
      (forceMultiline ? 'ae-extended-response' : 'ae-short-response');
    var labelClass = classPrefix + '-label';
    var inputClass =
      classPrefix +
      '-input' +
      (useTextarea ? ' ' + classPrefix + '-textarea' : '');
    var hintClass = classPrefix + '-hint';
    var countClass = classPrefix + '-count';

    function emit(opts) {
      var node = document.getElementById(inputId);
      var value = node ? node.value : current;
      if (handlers && handlers.onAnswer) {
        handlers.onAnswer(qid, value, opts || {});
      }
      var countNode = document.getElementById(countId);
      if (countNode) {
        countNode.textContent =
          normalisedDisplayLength(value) + ' / ' + maxChars + ' characters';
      }
    }

    fieldset.appendChild(
      el('label', {
        className: labelClass,
        htmlFor: inputId,
        textContent: 'Your response'
      })
    );

    var control = useTextarea
      ? el('textarea', {
          id: inputId,
          className: inputClass,
          name: 'response-' + qid,
          rows: forceMultiline ? (maxChars > 1200 ? '8' : '5') : maxChars > 400 ? '6' : '3',
          maxlength: String(maxChars),
          'aria-describedby': hintId + ' ' + countId
        })
      : el('input', {
          type: 'text',
          id: inputId,
          className: inputClass,
          name: 'response-' + qid,
          maxlength: String(maxChars),
          'aria-describedby': hintId + ' ' + countId
        });
    control.value = current;
    control.addEventListener('input', function () {
      emit({ deferRender: true });
    });
    control.addEventListener('blur', function () {
      emit({});
    });
    fieldset.appendChild(control);
    fieldset.appendChild(
      el('p', {
        id: hintId,
        className: hintClass,
        textContent:
          'Enter at least ' +
          minChars +
          ' characters (maximum ' +
          maxChars +
          ').'
      })
    );
    fieldset.appendChild(
      el('p', {
        id: countId,
        className: countClass,
        textContent: normalisedDisplayLength(current) + ' / ' + maxChars + ' characters'
      })
    );

    appendQuestionFeedback(fieldset, itemResult, question);
    return fieldset;
  }

  function renderShortResponseQuestion(question, state, itemResult, handlers, fieldset) {
    return renderTextResponseQuestion(
      question,
      state,
      itemResult,
      handlers,
      fieldset,
      { forceMultiline: false }
    );
  }

  function renderExtendedResponseQuestion(question, state, itemResult, handlers, fieldset) {
    return renderTextResponseQuestion(
      question,
      state,
      itemResult,
      handlers,
      fieldset,
      { forceMultiline: true, classPrefix: 'ae-extended-response' }
    );
  }

  function renderReflectionQuestion(question, state, itemResult, handlers, fieldset) {
    return renderTextResponseQuestion(
      question,
      state,
      itemResult,
      handlers,
      fieldset,
      { forceMultiline: true, classPrefix: 'ae-reflection' }
    );
  }

  function renderSelfAssessmentQuestion(question, state, itemResult, handlers, fieldset) {
    var qid = question.questionId;
    var selected = state.responses[qid] || '';
    var list = el('ul', {
      className: 'ae-choice-list ae-self-assessment-list',
      role: 'presentation'
    });
    sortByDisplayOrder(question.options || []).forEach(function (option) {
      var inputId = qid + '-' + option.optionId;
      var input = el('input', {
        type: 'radio',
        name: 'question-' + qid,
        id: inputId,
        value: option.optionId
      });
      if (selected === option.optionId) input.checked = true;
      input.addEventListener('change', function () {
        if (handlers && handlers.onAnswer) {
          handlers.onAnswer(qid, option.optionId);
        }
      });

      var labelClass = 'ae-choice ae-self-assessment-choice';
      if (itemResult && selected === option.optionId) {
        labelClass +=
          itemResult.status === 'completed' || itemResult.status === 'correct'
            ? ' is-recorded-option'
            : ' is-incorrect-selected';
      }

      list.appendChild(
        el('li', null, [
          el('label', { className: labelClass, htmlFor: inputId }, [
            input,
            el('span', { textContent: option.text || '' })
          ])
        ])
      );
    });
    fieldset.appendChild(list);
    appendQuestionFeedback(fieldset, itemResult, question);
    return fieldset;
  }

  function normalisedDisplayLength(value) {
    return String(value == null ? '' : value)
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ').length;
  }

  function renderSingleChoiceQuestion(question, state, itemResult, handlers, fieldset) {
    var qid = question.questionId;
    var selected = state.responses[qid] || '';
    var list = el('ul', { className: 'ae-choice-list' });
    sortByDisplayOrder(question.options).forEach(function (option) {
      var inputId = qid + '-' + option.optionId;
      var input = el('input', {
        type: 'radio',
        name: 'question-' + qid,
        id: inputId,
        value: option.optionId
      });
      if (selected === option.optionId) input.checked = true;
      input.addEventListener('change', function () {
        if (handlers && handlers.onAnswer) {
          handlers.onAnswer(qid, option.optionId);
        }
      });

      var labelClass = 'ae-choice';
      if (itemResult) {
        if (itemResult.correctValue && option.optionId === itemResult.correctValue) {
          labelClass += ' is-correct-option';
        } else if (
          selected === option.optionId &&
          itemResult.status !== 'correct'
        ) {
          labelClass += ' is-incorrect-selected';
        }
      }

      list.appendChild(
        el('li', null, [
          el('label', { className: labelClass, htmlFor: inputId }, [
            input,
            el('span', {
              className: 'ae-option-id',
              textContent: option.optionId
            }),
            el('span', { textContent: option.text || '' })
          ])
        ])
      );
    });
    fieldset.appendChild(list);
    appendQuestionFeedback(fieldset, itemResult, question);
    return fieldset;
  }

  function renderQuestion(question, state, markResult, handlers, options) {
    ensureEl();
    options = options || {};
    var qid = question.questionId;
    var itemResult = findItemResult(markResult, qid);
    var completionActivity = options.isCompletionActivity === true;
    var completionQuestion =
      question.questionType === 'reflection' ||
      question.questionType === 'self-assessment';

    var statusClass = '';
    if (itemResult) {
      if (itemResult.status === 'correct') statusClass = ' is-correct';
      else if (itemResult.status === 'partial') statusClass = ' is-partial';
      else if (itemResult.status === 'completed') statusClass = ' is-completed';
      else statusClass = ' is-incorrect';
    }

    var fieldset = el('fieldset', {
      className: 'ae-question' + statusClass,
      id: 'question-' + qid
    });

    var marks = question.marks || question.maximumMarks || 1;
    var markLabel =
      completionActivity || completionQuestion
        ? marks === 1
          ? ' completion point'
          : ' completion points'
        : marks === 1
          ? ' mark'
          : ' marks';
    var promptText = (question.prompt || 'Question') + ' (' + marks + markLabel + ')';
    // Wrap the prompt so long legends stay inside the bordered panel.
    var legend = el('legend', { className: 'ae-question-legend' });
    legend.appendChild(
      el('span', {
        className: 'ae-question-prompt',
        id: 'question-prompt-' + qid,
        textContent: promptText
      })
    );
    fieldset.appendChild(legend);

    if (question.instruction) {
      fieldset.appendChild(
        el('p', { className: 'ae-question-instruction', textContent: question.instruction })
      );
    }

    if (question.questionType === 'single-choice') {
      return renderSingleChoiceQuestion(question, state, itemResult, handlers, fieldset);
    }
    if (question.questionType === 'classification') {
      return renderClassificationQuestion(question, state, itemResult, handlers, fieldset);
    }
    if (question.questionType === 'short-response') {
      return renderShortResponseQuestion(question, state, itemResult, handlers, fieldset);
    }
    if (question.questionType === 'extended-response') {
      return renderExtendedResponseQuestion(
        question,
        state,
        itemResult,
        handlers,
        fieldset
      );
    }
    if (question.questionType === 'self-assessment') {
      return renderSelfAssessmentQuestion(
        question,
        state,
        itemResult,
        handlers,
        fieldset
      );
    }
    if (question.questionType === 'reflection') {
      return renderReflectionQuestion(question, state, itemResult, handlers, fieldset);
    }

    fieldset.appendChild(
      el('p', {
        className: 'message message-error',
        textContent:
          'This question type (' +
          (question.questionType || 'unknown') +
          ') is not supported in this version of the activity engine.'
      })
    );
    return fieldset;
  }

  function renderSection(section, state, handlers, options) {
    ensureEl();
    options = options || {};
    var sectionId = section.sectionId;
    var isAssessment = section.sectionType === 'assessment';
    var markResult = state.markedSections[sectionId] || null;
    var openByDefault = options.open === true;
    var isCompletionActivity = options.isCompletionActivity === true;

    var details = el('details', {
      className:
        'session-disclosure ae-section ae-section-' +
        (section.sectionType || 'learning'),
      id: 'section-' + sectionId,
      open: openByDefault
    });

    var summary = el('summary', { className: 'session-disclosure__summary' });
    var text = el('span', { className: 'session-disclosure__text' });
    text.appendChild(
      el('h3', {
        className: 'session-disclosure__heading',
        textContent: section.title || sectionId
      })
    );
    var metaBits = [section.sectionType || 'section'];
    if (isAssessment) {
      var markedScore =
        markResult &&
        (markResult.score != null ? markResult.score : markResult.sectionScore);
      var markedMax =
        markResult &&
        (markResult.maximumScore != null
          ? markResult.maximumScore
          : markResult.maximumMarks);
      if (markResult) {
        metaBits.push(
          isCompletionActivity
            ? (markedScore != null ? markedScore : '?') +
                ' of ' +
                (markedMax != null ? markedMax : '?') +
                ' steps completed'
            : 'Checked: ' +
                (markedScore != null ? markedScore : '?') +
                ' / ' +
                (markedMax != null ? markedMax : '?')
        );
      } else {
        metaBits.push(isCompletionActivity ? 'Not completed yet' : 'Not checked yet');
      }
    }
    text.appendChild(
      el('span', {
        className: 'session-disclosure__meta',
        textContent: metaBits.join(' · ')
      })
    );
    summary.appendChild(text);
    summary.appendChild(
      el('span', { className: 'session-disclosure__icon', 'aria-hidden': 'true' })
    );
    details.appendChild(summary);

    var content = el('div', { className: 'session-disclosure__content ae-section-content' });
    sortByDisplayOrder(section.contentBlocks).forEach(function (block) {
      content.appendChild(renderContentBlock(block));
    });

    var questions = sortByDisplayOrder(section.questions);
    questions.forEach(function (question) {
      content.appendChild(
        renderQuestion(question, state, markResult, handlers, {
          isCompletionActivity: isCompletionActivity
        })
      );
    });

    if (isAssessment) {
      var actions = el('div', { className: 'ae-section-actions' });
      var checkBtn = el('button', {
        type: 'button',
        className: 'btn btn-primary',
        textContent: isCompletionActivity
          ? 'Record this section'
          : 'Check this section'
      });
      checkBtn.addEventListener('click', function () {
        if (handlers && handlers.onMarkSection) {
          handlers.onMarkSection(sectionId);
        }
      });
      actions.appendChild(checkBtn);
      content.appendChild(actions);

      var status = el('div', {
        className: 'status-messages ae-section-status',
        id: 'section-status-' + sectionId,
        'aria-live': 'polite',
        'aria-atomic': 'true'
      });
      content.appendChild(status);

      if (markResult) {
        var sectionScore =
          markResult.score != null ? markResult.score : markResult.sectionScore;
        var sectionMax =
          markResult.maximumScore != null
            ? markResult.maximumScore
            : markResult.maximumMarks;
        content.appendChild(
          el('p', {
            className: 'ae-section-score',
            textContent: isCompletionActivity
              ? (sectionScore != null ? sectionScore : '0') +
                ' of ' +
                (sectionMax != null ? sectionMax : '?') +
                ' steps completed'
              : 'Section score: ' +
                (sectionScore != null ? sectionScore : '0') +
                ' / ' +
                (sectionMax != null ? sectionMax : '?')
          })
        );
      }
    }

    details.appendChild(content);
    return details;
  }

  function renderMetadata(host, activity, recordType) {
    ensureEl();
    host.textContent = '';
    var list = el('dl', { className: 'ae-meta-list' });
    function row(label, value) {
      list.appendChild(el('dt', { textContent: label }));
      list.appendChild(el('dd', { textContent: value }));
    }
    var completionActivity =
      String(activity.activityType || '')
        .replace(/^\s+|\s+$/g, '')
        .toLowerCase() === 'reflection';
    row('Activity', activity.activityName || '');
    row('Week', 'Week ' + (activity.weekNumber || ''));
    row('Session', activity.sessionName || '');
    row('Type', activity.activityType || '');
    row('Version', activity.activityVersion || '');
    row(
      completionActivity ? 'Maximum completion points' : 'Maximum score',
      String(activity.maximumScore || '')
    );
    row('Submission mode', recordType === 'LIVE' ? 'LIVE' : 'TEST');
    host.appendChild(list);
    if (recordType !== 'LIVE') {
      host.appendChild(
        el('p', {
          className: 'ae-test-banner',
          role: 'status',
          textContent:
            'TEST mode: submissions are recorded for checking only and do not count as learner attempts.'
        })
      );
    }
  }

  function renderProgress(host, completed, total, options) {
    ensureEl();
    options = options || {};
    host.textContent = '';
    host.appendChild(
      el('p', {
        className: 'progress-text',
        textContent: options.isCompletionActivity
          ? 'Completion progress: ' +
            completed +
            ' of ' +
            total +
            ' sections completed'
          : 'Assessment progress: ' +
            completed +
            ' of ' +
            total +
            ' sections checked'
      })
    );
  }

  global.Unit3ActivityRenderer = {
    sortByDisplayOrder: sortByDisplayOrder,
    renderMetadata: renderMetadata,
    renderProgress: renderProgress,
    renderSection: renderSection,
    renderQuestion: renderQuestion
  };
})(window);
