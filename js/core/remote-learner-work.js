/**
 * Authenticated persistence for Weeks 2–7 learner work that still lives
 * in classic week engines (progress, notes, worksheets).
 *
 * Uses Core progress.createStore against published, assigned activity keys.
 * Unpublished ids such as week3-directed-study cannot be saved by
 * api.save_activity_state, so those notes ride on host-mode carriers.
 * Does not call api.submit_attempt.
 */
(function (global) {
  "use strict";

  var HOST_WORK_CARRIERS = Object.freeze({
    2: Object.freeze([
      "week2-northbank-vulnerability-register",
      "week2-ocr-question-practice"
    ]),
    3: Object.freeze(["week3-peer-marking", "week3-ocr-question-practice"]),
    4: Object.freeze(["week4-analyse-practice", "week4-ocr-question-practice"]),
    5: Object.freeze(["week5-impact-analysis", "week5-ocr-question-practice"]),
    6: Object.freeze(["week6-revision-organiser", "week6-ocr-question-practice"]),
    7: Object.freeze(["week7-heightened-threat", "week7-ocr-question-practice"])
  });

  var HOST_ACTIVITY_IDS = Object.freeze({
    2: Object.freeze([
      "week2-northbank-vulnerability-analysis",
      "week2-ocr-question-practice",
      "week2-peer-marking-answer-improvement",
      "week2-northbank-vulnerability-register"
    ]),
    3: Object.freeze(["week3-ocr-question-practice", "week3-peer-marking"]),
    4: Object.freeze([
      "week4-ocr-question-practice",
      "week4-answer-improvement",
      "week4-mtm-mapping",
      "week4-northbank-exposure",
      "week4-analyse-practice"
    ]),
    5: Object.freeze([
      "week5-ocr-question-practice",
      "week5-answer-improvement",
      "week5-ransomware-companion",
      "week5-stakeholder-grid",
      "week5-impact-analysis"
    ]),
    6: Object.freeze([
      "week6-ocr-question-practice",
      "week6-answer-improvement",
      "week6-discuss-planner",
      "week6-stakeholder-debate",
      "week6-revision-organiser",
      "week6-exercise-decision-record",
      "week6-legislation-matching",
      "week6-government-initiatives",
      "week6-ncsc-guidance",
      "week6-discuss-learning"
    ]),
    7: Object.freeze([
      "week7-ocr-question-practice",
      "week7-answer-improvement",
      "week7-northbank-risk-register",
      "week7-heightened-threat"
    ])
  });

  function platform() {
    return global.LearningPlatform && global.LearningPlatform.platform;
  }

  function isSignedIn() {
    var current = platform();
    return Boolean(
      current &&
        current.auth &&
        typeof current.auth.isSignedIn === "function" &&
        current.auth.isSignedIn()
    );
  }

  function activityKey(value) {
    var map = global.Unit3ActivityKeyMap;
    if (map && typeof map.normaliseActivityKey === "function") {
      return map.normaliseActivityKey(value);
    }
    return String(value || "").trim().toLowerCase();
  }

  function activityVersion(key, version) {
    var map = global.Unit3ActivityKeyMap;
    if (map && typeof map.normaliseActivityVersion === "function") {
      return map.normaliseActivityVersion(version, key);
    }
    return version || "";
  }

  function weekFromValue(value) {
    var match = String(value || "").match(/week(?:-|)?(\d)/i) || String(value || "").match(/unit3-week(\d)/i);
    return match ? Number(match[1]) : 0;
  }

  function allHostIds() {
    var ids = [];
    Object.keys(HOST_ACTIVITY_IDS).forEach(function (week) {
      ids = ids.concat(HOST_ACTIVITY_IDS[week]);
    });
    return ids;
  }

  function isHostActivity(key) {
    return allHostIds().indexOf(activityKey(key)) !== -1;
  }

  function publishedActivityKey(value) {
    var key = activityKey(value);
    if (!key) return "";
    if (key.indexOf("u3-w01-") === 0) return key;
    if (key.indexOf("unit3-") === 0) {
      key = key.replace(/^unit3-/, "");
    }
    if (isHostActivity(key)) return key;
    return "";
  }

  function carriersFor(week) {
    return HOST_WORK_CARRIERS[week] || [];
  }

  function createStore(key, version, legacyKeys) {
    var current = platform();
    var normalised = publishedActivityKey(key) || activityKey(key);
    var resolved = activityVersion(normalised, version);
    if (!current || !current.progress || typeof current.progress.createStore !== "function") {
      return null;
    }
    if (!isSignedIn() || !normalised || !resolved || !publishedActivityKey(normalised)) return null;
    try {
      return current.progress.createStore({
        activityKey: normalised,
        activityVersion: resolved,
        storage: global.localStorage,
        legacyKeys: legacyKeys || []
      });
    } catch (err) {
      return null;
    }
  }

  function mergeObjects() {
    var next = {};
    var i;
    var source;
    for (i = 0; i < arguments.length; i += 1) {
      source = arguments[i];
      if (source && typeof source === "object" && !Array.isArray(source)) {
        Object.keys(source).forEach(function (key) {
          next[key] = source[key];
        });
      }
    }
    return next;
  }

  function saveWork(key, version, payload, options) {
    var store = createStore(key, version, options && options.legacyKeys);
    var next = Object.assign({ completed: false }, payload || {});
    if (!store || typeof store.save !== "function") return next;
    try {
      store.save(next, options || { immediate: true });
    } catch (err) {
      /* local cache in Core store still holds the draft */
    }
    return next;
  }

  function hydrateWork(key, version, local, options) {
    var store = createStore(key, version, options && options.legacyKeys);
    if (!store || typeof store.hydrate !== "function") {
      return Promise.resolve(local || null);
    }
    return store.hydrate(local || null).catch(function () {
      return local || null;
    });
  }

  function persistOntoCarriers(week, patch, options) {
    var keys = carriersFor(week);
    if (!keys.length) return Promise.resolve(patch);
    return Promise.all(keys.map(function (key) {
      return hydrateWork(key, null, null).then(function (existing) {
        var next = {
          responses: existing && existing.responses && typeof existing.responses === "object"
            ? existing.responses
            : {},
          checked: existing && existing.checked && typeof existing.checked === "object"
            ? existing.checked
            : {},
          weekRoot: mergeObjects(existing && existing.weekRoot, patch && patch.weekRoot),
          localKeys: mergeObjects(existing && existing.localKeys, patch && patch.localKeys),
          completed: false
        };
        if (patch && patch.responses && publishedActivityKey(key) === publishedActivityKey(patch.activityKey)) {
          next.responses = patch.responses;
          next.checked = patch.checked || next.checked;
        }
        saveWork(key, null, next, options || { immediate: true });
        return next;
      });
    }));
  }

  function persistStorageKey(storageKey, activityId, values, options) {
    try {
      global.localStorage.setItem(storageKey, JSON.stringify(values || {}));
    } catch (err) {
      /* ignore */
    }
    var published = publishedActivityKey(activityId);
    var week = weekFromValue(storageKey) || weekFromValue(activityId) || weekFromValue(published);
    var payload = {
      localKeys: {}
    };
    payload.localKeys[storageKey] = values && typeof values === "object" ? values : {};
    if (published && isHostActivity(published)) {
      payload.activityKey = published;
      payload.responses = payload.localKeys[storageKey];
    }
    if (!week) {
      if (published) {
        saveWork(published, options && options.activityVersion, {
          responses: payload.localKeys[storageKey],
          checked: (options && options.checked) || {},
          completed: false
        }, { immediate: true, legacyKeys: [storageKey] });
      }
      return payload;
    }
    persistOntoCarriers(week, payload, {
      immediate: !(options && options.immediate === false)
    });
    return payload;
  }

  function restoreStorageKey(storageKey, activityId, options) {
    var local = null;
    try {
      local = JSON.parse(global.localStorage.getItem(storageKey) || "null");
    } catch (err) {
      local = null;
    }
    var published = publishedActivityKey(activityId);
    var week = weekFromValue(storageKey) || weekFromValue(activityId) || weekFromValue(published);
    var keys = week ? carriersFor(week).slice() : [];
    if (published && keys.indexOf(published) === -1) keys.unshift(published);
    if (!keys.length) {
      return Promise.resolve(local && typeof local === "object" ? local : {});
    }
    return Promise.all(keys.map(function (key) {
      return hydrateWork(key, options && options.activityVersion, null, { legacyKeys: [storageKey] });
    })).then(function (rows) {
      var values = local && typeof local === "object" ? local : {};
      rows.forEach(function (resolved) {
        if (!resolved) return;
        if (resolved.localKeys && resolved.localKeys[storageKey] && typeof resolved.localKeys[storageKey] === "object") {
          values = mergeObjects(values, resolved.localKeys[storageKey]);
        } else if (resolved.weekRoot && resolved.weekRoot.localKeys && resolved.weekRoot.localKeys[storageKey]) {
          values = mergeObjects(values, resolved.weekRoot.localKeys[storageKey]);
        } else if (published && resolved.responses && typeof resolved.responses === "object" && isHostActivity(published)) {
          values = mergeObjects(values, resolved.responses);
        }
      });
      try {
        global.localStorage.setItem(storageKey, JSON.stringify(values));
      } catch (err) {
        /* ignore */
      }
      return values;
    });
  }

  function persistWeekRoot(progress, activityId) {
    if (!progress || typeof progress.getRoot !== "function") return;
    var root = progress.getRoot();
    var week = weekFromValue(progress.ROOT_KEY) || weekFromValue(activityId);
    var catalogId = publishedActivityKey(activityId);
    if (!catalogId && progress.ACTIVITY_CATALOG) {
      progress.ACTIVITY_CATALOG.forEach(function (item) {
        var path = String((item && item.path) || "").replace(/\/$/, "");
        if (path && path === activityId) catalogId = item.activityId;
      });
    }
    var drafts = root.drafts || {};
    var patch = {
      weekRoot: {
        drafts: drafts,
        activities: root.activities || {}
      }
    };
    if (catalogId && isHostActivity(catalogId)) {
      patch.activityKey = catalogId;
      patch.responses = drafts[activityId] || drafts[catalogId] || {};
      if (typeof activityId === "string" && drafts[activityId]) {
        patch.responses = drafts[activityId];
      }
    }
    if (week) persistOntoCarriers(week, patch, { immediate: true });
    else if (catalogId && isHostActivity(catalogId)) {
      saveWork(catalogId, null, {
        responses: patch.responses || {},
        weekRoot: patch.weekRoot,
        completed: false
      }, { immediate: true });
    }
  }

  function hydrateWeekRoot(progress) {
    var week = weekFromValue(progress && progress.ROOT_KEY);
    var keys = carriersFor(week);
    if (!progress || !keys.length) return Promise.resolve();
    return Promise.all(keys.map(function (key) {
      return hydrateWork(key, null, null);
    })).then(function (rows) {
      var drafts = {};
      var activities = {};
      rows.forEach(function (resolved) {
        if (!resolved || !resolved.weekRoot) return;
        drafts = mergeObjects(drafts, resolved.weekRoot.drafts);
        activities = mergeObjects(activities, resolved.weekRoot.activities);
      });
      if (typeof progress.__lpSetDraft === "function") {
        Object.keys(drafts).forEach(function (key) {
          progress.__lpSetDraft(key, drafts[key]);
        });
      }
      if (typeof progress.__lpUpdateActivity === "function") {
        Object.keys(activities).forEach(function (activityId) {
          var row = activities[activityId];
          if (row && row.extra) {
            progress.__lpUpdateActivity(activityId, { extra: row.extra });
          }
        });
      }
    });
  }

  global.Unit3RemoteLearnerWork = Object.freeze({
    isSignedIn: isSignedIn,
    isHostActivity: isHostActivity,
    publishedActivityKey: publishedActivityKey,
    createStore: createStore,
    saveWork: saveWork,
    hydrateWork: hydrateWork,
    persistStorageKey: persistStorageKey,
    restoreStorageKey: restoreStorageKey,
    persistWeekRoot: persistWeekRoot,
    hydrateWeekRoot: hydrateWeekRoot,
    carriersFor: carriersFor
  });
})(window);
