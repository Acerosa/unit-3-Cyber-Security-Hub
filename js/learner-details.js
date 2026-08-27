/**
 * Shared learner identification form for Collector v3 activities.
 * Does not store personal data in browser storage.
 */

(function (global) {
  'use strict';

  var utils = global.Unit3ActivityUtils || {};
  var course = global.Unit3CourseContext || {};
  var el = utils.el;

  var STUDENT_ID_PATTERN = /^[A-Z0-9_-]{4,30}$/;
  var MAX_NAME_LENGTH = 80;

  function ensureEl() {
    if (!el) {
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
          node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
        });
        return node;
      };
    }
  }

  function normaliseSpaces(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
  }

  function normaliseStudentId(value) {
    return normaliseSpaces(value).toUpperCase();
  }

  function normaliseClassGroup(value) {
    return normaliseSpaces(value).toUpperCase();
  }

  function getCourseContext() {
    return course.COURSE_CONTEXT || {};
  }

  function renderCourseDetails(containerId, activityMeta) {
    ensureEl();
    var host = document.getElementById(containerId);
    if (!host || !activityMeta) return;
    var ctx = getCourseContext();
    host.textContent = '';
    var details = el('details', {
      className: 'session-disclosure course-details-disclosure'
    });
    var summary = el('summary', { className: 'session-disclosure__summary' });
    var text = el('span', { className: 'session-disclosure__text' });
    text.appendChild(
      el('h3', {
        id: 'course-details-heading',
        className: 'session-disclosure__heading',
        textContent: 'Course details'
      })
    );
    text.appendChild(
      el('span', {
        className: 'session-disclosure__meta',
        textContent: activityMeta.activityName || 'Read-only course information'
      })
    );
    text.appendChild(
      el('span', {
        className: 'visually-hidden',
        textContent: '. Show or hide course details'
      })
    );
    summary.appendChild(text);
    summary.appendChild(
      el('span', { className: 'session-disclosure__icon', 'aria-hidden': 'true' })
    );
    details.appendChild(summary);

    var content = el('div', { className: 'session-disclosure__content' });
    var list = el('dl', { className: 'course-details-list' });
    function row(label, value) {
      list.appendChild(el('dt', { textContent: label }));
      list.appendChild(el('dd', { textContent: value }));
    }
    row('Academic year', ctx.academicYear || '');
    row('Programme year', ctx.yearGroup || '');
    row('Level', ctx.qualificationLevel || '');
    row('Programme', ctx.programme || '');
    row('Unit', ctx.unitDisplayName || ctx.unitName || '');
    row('Week', 'Week ' + activityMeta.weekNumber);
    row('Activity', activityMeta.activityName || '');
    content.appendChild(list);
    details.appendChild(content);
    host.appendChild(details);
  }

  function renderClassGroupField(ctx) {
    var groups = ctx.classGroups || [];
    if (groups.length > 0) {
      var select = el('select', {
        id: 'ld-class-group',
        name: 'classGroup',
        required: true,
        'aria-required': 'true'
      });
      select.appendChild(el('option', { value: '', textContent: 'Select class group' }));
      groups.forEach(function (group) {
        select.appendChild(el('option', { value: group, textContent: group }));
      });
      return el('div', { className: 'field' }, [
        el('label', {
          htmlFor: 'ld-class-group',
          textContent: 'Class group '
        }),
        el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
        el('span', { className: 'visually-hidden', textContent: ' (required)' }),
        select
      ]);
    }
    return el('div', { className: 'field' }, [
      el('label', {
        htmlFor: 'ld-class-group',
        textContent: 'Class group '
      }),
      el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
      el('span', { className: 'visually-hidden', textContent: ' (required)' }),
      el('input', {
        type: 'text',
        id: 'ld-class-group',
        name: 'classGroup',
        required: true,
        'aria-required': 'true',
        autocomplete: 'off',
        maxlength: '250',
        spellcheck: 'false'
      })
    ]);
  }

  function renderLearnerForm(containerId, options) {
    ensureEl();
    options = options || {};
    var host = document.getElementById(containerId);
    if (!host) return;

    host.textContent = '';
    var ctx = getCourseContext();
    var form = el('form', {
      id: 'learner-details-form',
      className: 'learner-details-form',
      novalidate: true,
      'aria-labelledby': 'learner-details-heading',
      'data-academic-integrity': 'exclude'
    });

    form.appendChild(el('h3', { id: 'learner-details-heading', textContent: 'Your details' }));
    form.appendChild(renderPrivacyNoticeElement());

    var grid = el('div', { className: 'form-grid learner-form-grid' });
    grid.appendChild(el('div', { className: 'field' }, [
      el('label', { htmlFor: 'ld-student-id', textContent: 'Student ID ' }),
      el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
      el('span', { className: 'visually-hidden', textContent: ' (required)' }),
      el('input', {
        type: 'text',
        id: 'ld-student-id',
        name: 'studentId',
        required: true,
        'aria-required': 'true',
        autocomplete: 'off',
        inputmode: 'text',
        spellcheck: 'false',
        maxlength: '30',
        'aria-describedby': 'ld-student-id-hint'
      }),
      el('p', {
        id: 'ld-student-id-hint',
        className: 'field-hint',
        textContent: 'Use letters, numbers, hyphens or underscores. Leading zeroes are kept.'
      })
    ]));
    grid.appendChild(el('div', { className: 'field' }, [
      el('label', { htmlFor: 'ld-first-name', textContent: 'First name ' }),
      el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
      el('span', { className: 'visually-hidden', textContent: ' (required)' }),
      el('input', {
        type: 'text',
        id: 'ld-first-name',
        name: 'firstName',
        required: true,
        'aria-required': 'true',
        autocomplete: 'off',
        maxlength: String(MAX_NAME_LENGTH)
      })
    ]));
    grid.appendChild(el('div', { className: 'field' }, [
      el('label', { htmlFor: 'ld-surname', textContent: 'Surname ' }),
      el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
      el('span', { className: 'visually-hidden', textContent: ' (required)' }),
      el('input', {
        type: 'text',
        id: 'ld-surname',
        name: 'surname',
        required: true,
        'aria-required': 'true',
        autocomplete: 'off',
        maxlength: String(MAX_NAME_LENGTH)
      })
    ]));
    grid.appendChild(renderClassGroupField(ctx));
    form.appendChild(grid);

    if (options.showPartner) {
      var workFieldset = el('fieldset', { className: 'work-mode-fieldset', id: 'ld-work-mode-fieldset' });
      workFieldset.appendChild(el('legend', { textContent: 'How are you working?' }));
      var workOptions = el('div', { className: 'choice-list work-mode-list' });
      ['individual', 'paired'].forEach(function (mode) {
        var inputId = 'ld-work-mode-' + mode;
        var label = mode === 'individual' ? 'Individual work' : 'Paired work';
        var wrap = el('div', { className: 'choice' });
        var input = el('input', {
          type: 'radio',
          name: 'workMode',
          id: inputId,
          value: mode,
          checked: mode === 'individual'
        });
        wrap.appendChild(input);
        wrap.appendChild(el('label', { htmlFor: inputId, textContent: label }));
        workOptions.appendChild(wrap);
      });
      workFieldset.appendChild(workOptions);
      form.appendChild(workFieldset);

      var partnerBlock = el('div', {
        id: 'ld-partner-block',
        className: 'partner-details-block',
        hidden: true,
        'aria-hidden': 'true'
      });
      partnerBlock.appendChild(el('h4', { textContent: 'Partner details' }));
      var partnerGrid = el('div', { className: 'form-grid learner-form-grid' });
      partnerGrid.appendChild(el('div', { className: 'field' }, [
        el('label', { htmlFor: 'ld-partner-student-id', textContent: 'Partner Student ID ' }),
        el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
        el('span', { className: 'visually-hidden', textContent: ' (required for paired work)' }),
        el('input', {
          type: 'text',
          id: 'ld-partner-student-id',
          name: 'partnerStudentId',
          autocomplete: 'off',
          inputmode: 'text',
          spellcheck: 'false',
          maxlength: '30'
        })
      ]));
      partnerGrid.appendChild(el('div', { className: 'field' }, [
        el('label', { htmlFor: 'ld-partner-first-name', textContent: 'Partner first name ' }),
        el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
        el('input', {
          type: 'text',
          id: 'ld-partner-first-name',
          name: 'partnerFirstName',
          autocomplete: 'off',
          maxlength: String(MAX_NAME_LENGTH)
        })
      ]));
      partnerGrid.appendChild(el('div', { className: 'field' }, [
        el('label', { htmlFor: 'ld-partner-surname', textContent: 'Partner surname ' }),
        el('span', { className: 'required', 'aria-hidden': 'true', textContent: '*' }),
        el('input', {
          type: 'text',
          id: 'ld-partner-surname',
          name: 'partnerSurname',
          autocomplete: 'off',
          maxlength: String(MAX_NAME_LENGTH)
        })
      ]));
      partnerBlock.appendChild(partnerGrid);
      form.appendChild(partnerBlock);

      workOptions.querySelectorAll('input[name="workMode"]').forEach(function (input) {
        input.addEventListener('change', function () {
          setPartnerVisible(input.value === 'paired');
        });
      });
    }

    form.appendChild(el('div', {
      id: 'learner-details-errors',
      className: 'status-messages',
      tabindex: '-1',
      'aria-live': 'assertive',
      'aria-atomic': 'true'
    }));

    host.appendChild(form);
  }

  function renderPrivacyNoticeElement() {
    return el('p', {
      className: 'privacy-notice learner-privacy-notice',
      role: 'note',
      textContent:
        'Your name, Student ID, class group and activity result will be sent to the staff-controlled learning platform for formative assessment and progress tracking. Do not enter sensitive personal information beyond the fields requested.'
    });
  }

  function isPairedWorkSelected() {
    var paired = document.querySelector('input[name="workMode"][value="paired"]');
    return Boolean(paired && paired.checked);
  }

  function setPartnerVisible(show) {
    var block = document.getElementById('ld-partner-block');
    if (!block) return;
    block.hidden = !show;
    block.setAttribute('aria-hidden', show ? 'false' : 'true');
    block.querySelectorAll('input').forEach(function (input) {
      input.disabled = !show;
      if (!show) input.value = '';
    });
  }

  function readField(id) {
    var node = document.getElementById(id);
    return node ? node.value : '';
  }

  function readLearnerDetails(options) {
    options = options || {};
    var paired = options.showPartner && isPairedWorkSelected();
    var learner = {
      studentId: normaliseStudentId(readField('ld-student-id')),
      firstName: normaliseSpaces(readField('ld-first-name')),
      surname: normaliseSpaces(readField('ld-surname')),
      classGroup: normaliseClassGroup(readField('ld-class-group')),
      partnerStudentId: '',
      partnerFirstName: '',
      partnerSurname: '',
      isPaired: paired
    };
    if (paired) {
      learner.partnerStudentId = normaliseStudentId(readField('ld-partner-student-id'));
      learner.partnerFirstName = normaliseSpaces(readField('ld-partner-first-name'));
      learner.partnerSurname = normaliseSpaces(readField('ld-partner-surname'));
    }
    return learner;
  }

  function validateName(value, label) {
    if (!value) return label + ' is required.';
    if (value.length > MAX_NAME_LENGTH) {
      return label + ' must be no longer than ' + MAX_NAME_LENGTH + ' characters.';
    }
    return '';
  }

  function validateStudentId(value, label) {
    if (!value) return label + ' is required.';
    if (!STUDENT_ID_PATTERN.test(value)) {
      return label + ' must use 4 to 30 letters, numbers, hyphens or underscores.';
    }
    return '';
  }

  function validateLearnerDetails(options) {
    options = options || {};
    var learner = readLearnerDetails(options);
    var errors = [];
    var fieldErrors = {};

    function add(fieldId, message) {
      if (!message) return;
      errors.push(message);
      fieldErrors[fieldId] = message;
    }

    add('ld-student-id', validateStudentId(learner.studentId, 'Student ID'));
    add('ld-first-name', validateName(learner.firstName, 'First name'));
    add('ld-surname', validateName(learner.surname, 'Surname'));
    if (!learner.classGroup) add('ld-class-group', 'Class group is required.');

    if (options.showPartner && learner.isPaired) {
      add('ld-partner-student-id', validateStudentId(learner.partnerStudentId, 'Partner Student ID'));
      add('ld-partner-first-name', validateName(learner.partnerFirstName, 'Partner first name'));
      add('ld-partner-surname', validateName(learner.partnerSurname, 'Partner surname'));
      if (
        learner.studentId &&
        learner.partnerStudentId &&
        learner.studentId === learner.partnerStudentId
      ) {
        add('ld-partner-student-id', 'Partner Student ID must be different from your Student ID.');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      fieldErrors: fieldErrors,
      learner: learner
    };
  }

  function showValidationSummary(containerId, validation) {
    ensureEl();
    var host = document.getElementById(containerId);
    if (!host) return;
    host.textContent = '';
    document.querySelectorAll('.field-error').forEach(function (node) {
      node.textContent = '';
    });
    document.querySelectorAll('.input-invalid').forEach(function (node) {
      node.classList.remove('input-invalid');
      node.removeAttribute('aria-invalid');
    });

    if (!validation || validation.valid) return;

    host.appendChild(el('h4', { textContent: 'Please correct the following' }));
    var list = el('ul', { className: 'error-list' });
    validation.errors.forEach(function (message) {
      list.appendChild(el('li', { textContent: message }));
    });
    host.appendChild(list);

    Object.keys(validation.fieldErrors || {}).forEach(function (fieldId) {
      var input = document.getElementById(fieldId);
      var message = validation.fieldErrors[fieldId];
      if (input) {
        input.classList.add('input-invalid');
        input.setAttribute('aria-invalid', 'true');
        var errorId = fieldId + '-error';
        var errorNode = document.getElementById(errorId);
        if (!errorNode) {
          errorNode = el('p', { id: errorId, className: 'field-error', role: 'alert' });
          input.parentNode.appendChild(errorNode);
        }
        errorNode.textContent = message;
        input.setAttribute('aria-describedby', errorId);
      }
    });

    host.focus();
    var firstInvalid = Object.keys(validation.fieldErrors || {})[0];
    if (firstInvalid) {
      var focusTarget = document.getElementById(firstInvalid);
      if (focusTarget) focusTarget.focus();
    }
  }

  function renderSubmissionSummary(containerId, summary) {
    ensureEl();
    var host = document.getElementById(containerId);
    if (!host || !summary) return;
    host.textContent = '';
    var block = el('div', { className: 'submission-summary' });
    block.appendChild(el('p', {
      textContent:
        'Learner: ' + summary.firstName + ' ' + summary.surname
    }));
    block.appendChild(el('p', { textContent: 'Student ID: ' + summary.studentId }));
    block.appendChild(el('p', { textContent: 'Class group: ' + summary.classGroup }));
    block.appendChild(el('p', { textContent: 'Activity: ' + summary.activityName }));
    block.appendChild(el('p', {
      textContent: 'Score: ' + summary.score + ' / ' + summary.maximumScore
    }));
    if (summary.partnerStudentId) {
      block.appendChild(el('p', {
        textContent:
          'Partner: ' + summary.partnerFirstName + ' ' + summary.partnerSurname
      }));
      block.appendChild(el('p', {
        textContent: 'Partner Student ID: ' + summary.partnerStudentId
      }));
    }
    host.appendChild(block);
  }

  global.Unit3LearnerDetails = {
    renderCourseDetails: renderCourseDetails,
    renderLearnerForm: renderLearnerForm,
    setPartnerVisible: setPartnerVisible,
    readLearnerDetails: readLearnerDetails,
    validateLearnerDetails: validateLearnerDetails,
    showValidationSummary: showValidationSummary,
    renderSubmissionSummary: renderSubmissionSummary,
    normaliseStudentId: normaliseStudentId,
    normaliseClassGroup: normaliseClassGroup
  };
})(window);
