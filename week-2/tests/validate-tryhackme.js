/**
 * Week 2 TryHackMe resource checks.
 */
(function (global) {
  'use strict';

  function runWeek2TryHackMeTests() {
    var results = [];
    var data = global.Unit3Week2TryHackMeData;
    var thm = global.Unit3Week2TryHackMe;
    var progress = global.Unit3Week2Progress;
    var routing = global.Unit3ActivityEngineConfig;
    var course = global.Unit3CourseContext;

    function pass(name) {
      results.push({ name: name, ok: true });
    }
    function fail(name, detail) {
      results.push({ name: name, ok: false, detail: detail || '' });
    }

    if (!data || !data.resources) {
      fail('thm-data-loaded', 'Unit3Week2TryHackMeData missing');
      return results;
    }
    if (!thm) {
      fail('thm-helpers-loaded', 'Unit3Week2TryHackMe missing');
      return results;
    }
    pass('thm-modules-loaded');

    var v101 = thm.getResource('week2-vulnerabilities101-practical');
    var malware = thm.getResource('week2-malware-introductory-directed-study');

    if (!v101 || !malware) {
      fail('thm-resources-present', 'Expected both TryHackMe resources');
      return results;
    }
    pass('thm-resources-present');

    [v101, malware].forEach(function (resource) {
      if (!resource.url || resource.url.indexOf('https://') !== 0) {
        fail('thm-https-' + resource.roomId, resource.url);
      } else {
        pass('thm-https-' + resource.roomId);
      }
      if (resource.url.indexOf('tryhackme.com/room/') === -1) {
        fail('thm-room-path-' + resource.roomId, resource.url);
      } else {
        pass('thm-room-path-' + resource.roomId);
      }
    });

    if (v101.url !== 'https://tryhackme.com/room/vulnerabilities101') {
      fail('thm-v101-url', v101.url);
    } else {
      pass('thm-v101-url');
    }
    if (malware.url !== 'https://tryhackme.com/room/malmalintroductory') {
      fail('thm-malware-url', malware.url);
    } else {
      pass('thm-malware-url');
    }

    if (v101.linkedActivityId !== 'week2-vulnerabilities101-reflection') {
      fail('thm-v101-activity-id', v101.linkedActivityId);
    } else {
      pass('thm-v101-activity-id');
    }

    if (malware.scored !== false || malware.linkedActivityId) {
      fail('thm-malware-not-scored', 'Malware directed study must remain non-scored');
    } else {
      pass('thm-malware-not-scored');
    }

    if (routing && routing.getSubmissionService) {
      var malwareRoute = routing.getSubmissionService(
        'week2-malware-introductory-directed-study'
      );
      if (malwareRoute) {
        fail('thm-malware-not-routed', malwareRoute);
      } else {
        pass('thm-malware-not-routed');
      }
    }

    if (course && course.getActivity) {
      var reg = course.getActivity('week2-vulnerabilities101-reflection');
      if (!reg || reg.maximumScore !== 2 || reg.activityVersion !== '1.0') {
        fail(
          'thm-v101-registry',
          reg
            ? 'total=' + reg.maximumScore + ' version=' + reg.activityVersion
            : 'missing'
        );
      } else {
        pass('thm-v101-registry');
      }
      if (course.getActivity('week2-malware-introductory-directed-study')) {
        fail('thm-malware-not-in-registry', 'Must not be a scored registry activity');
      } else {
        pass('thm-malware-not-in-registry');
      }
    }

    if (v101.availabilityStatus !== 'tutor-check-required' &&
        v101.availabilityStatus !== 'available' &&
        v101.availabilityStatus !== 'unavailable') {
      fail('thm-availability-status', v101.availabilityStatus);
    } else {
      pass('thm-availability-status');
    }

    if (!data.accessNotice || data.accessNotice.indexOf('authorised') === -1) {
      fail('thm-access-notice', 'Missing tutor-controlled access notice');
    } else {
      pass('thm-access-notice');
    }

    if (!data.troubleshooting || data.troubleshooting.length < 5) {
      fail('thm-troubleshooting', 'Expected troubleshooting entries');
    } else {
      pass('thm-troubleshooting');
    }

    var safetyText = (v101.safetyNotices || [])
      .concat(malware.safetyNotices || [])
      .join(' ');
    if (safetyText.indexOf('authorised') === -1 && safetyText.indexOf('TryHackMe') === -1) {
      fail('thm-safety-notices', 'Safety notices missing');
    } else {
      pass('thm-safety-notices');
    }

    var serialised = JSON.stringify(data);
    var banned = ['THM{', 'flag{', 'Answer:', 'answers:'];
    var found = banned.filter(function (token) {
      return serialised.indexOf(token) !== -1;
    });
    if (found.length) {
      fail('thm-no-answer-strings', found.join(', '));
    } else {
      pass('thm-no-answer-strings');
    }

    // External link attributes
    var link = thm.createExternalLink(v101.url, 'Open TryHackMe room');
    if (
      link.target === '_blank' &&
      link.rel === 'noopener noreferrer' &&
      /new tab/i.test(link.textContent)
    ) {
      pass('thm-external-link-attrs');
    } else {
      fail('thm-external-link-attrs', link.outerHTML);
    }

    // Opening a room must not mark the scored activity complete
    if (progress) {
      var beforeKey = 'unit3-week2-progress';
      var before = null;
      var week1Probe = null;
      try {
        before = localStorage.getItem(beforeKey);
        week1Probe = localStorage.getItem('unit3-week1-progress');
        var prior = progress.getActivityState('week2-vulnerabilities101-reflection');
        thm.trackResourceOpened(v101);
        var after = progress.getActivityState('week2-vulnerabilities101-reflection');
        if (after.status === 'completed' && prior.status !== 'completed') {
          fail('thm-open-not-complete', after.status);
        } else {
          pass('thm-open-not-complete');
        }
        if (localStorage.getItem('unit3-week1-progress') === week1Probe) {
          pass('thm-week1-storage-untouched');
        } else {
          fail('thm-week1-storage-untouched', 'Week 1 storage changed');
        }
      } catch (err) {
        fail('thm-open-not-complete', String(err));
      } finally {
        if (before == null) localStorage.removeItem(beforeKey);
        else localStorage.setItem(beforeKey, before);
      }
    }

    // Notes persistence
    var notesKey = v101.notesStorageKey;
    var previousNotes = localStorage.getItem(notesKey);
    try {
      var payload = {
        answers: ['test note persistence'],
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(notesKey, JSON.stringify(payload));
      var reread = JSON.parse(localStorage.getItem(notesKey));
      if (reread && reread.answers && reread.answers[0] === 'test note persistence') {
        pass('thm-notes-persist');
      } else {
        fail('thm-notes-persist', 'Could not reread notes');
      }
    } catch (notesErr) {
      fail('thm-notes-persist', String(notesErr));
    } finally {
      if (previousNotes == null) localStorage.removeItem(notesKey);
      else localStorage.setItem(notesKey, previousNotes);
    }

    // Fallback when unavailable
    var unavailable = Object.assign({}, v101, {
      availabilityStatus: 'unavailable',
      fallbackPath: 'northbank-analysis/'
    });
    var host = document.createElement('div');
    document.body.appendChild(host);
    thm.renderResourceActions(host, unavailable, { pathBase: '' });
    var fallback = host.querySelector('a[href="northbank-analysis/"]');
    var disabled = host.querySelector('button[disabled]');
    if (fallback && disabled) {
      pass('thm-fallback-unavailable');
    } else {
      fail('thm-fallback-unavailable', host.innerHTML.slice(0, 200));
    }
    document.body.removeChild(host);

    if (v101.notesStorageKey !== 'unit3-week2-vulnerabilities101-notes') {
      fail('thm-v101-notes-key', v101.notesStorageKey);
    } else {
      pass('thm-v101-notes-key');
    }
    if (malware.notesStorageKey !== 'unit3-week2-malware-introductory-notes') {
      fail('thm-malware-notes-key', malware.notesStorageKey);
    } else {
      pass('thm-malware-notes-key');
    }

    return results;
  }

  global.Unit3Week2TryHackMeTests = {
    runWeek2TryHackMeTests: runWeek2TryHackMeTests
  };
})(window);
