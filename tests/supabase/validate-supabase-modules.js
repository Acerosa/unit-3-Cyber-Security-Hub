/**
 * Unit 3 Supabase migration test suite (browser runner + Node-compatible).
 *
 * Verifies:
 *   - Supabase public configuration exists with no privileged credentials
 *   - Explicit rollback backend mode with no automatic Apps Script fallback
 *   - Activity key normalisation (Week 1 upper- to lower-case)
 *   - Activity version mapping (1.0 -> 1.0.0)
 *   - Question stable key uppercasing
 *   - Adapter payload shape (only the eight RPC parameters, no browser-owned
 *     learner identity fields)
 *   - Stable client_attempt_id across retries of the same attempt
 *   - Signed-out submissions are prevented (SupabaseLearningApi.canSubmit)
 *   - Response mapping across representative shapes (single-choice,
 *     matching/classification, multi-mark OCR, reflection)
 */
(function (global) {
  "use strict";

  function record(results, name, ok, detail) {
    results.push({ name: name, ok: !!ok, detail: detail || "" });
  }

  function assertEquals(results, name, actual, expected) {
    var ok = actual === expected;
    record(
      results,
      name,
      ok,
      ok ? "" : "expected " + String(expected) + " got " + String(actual)
    );
  }

  function assertDeepEqual(results, name, actual, expected) {
    var actualJson = JSON.stringify(actual);
    var expectedJson = JSON.stringify(expected);
    record(
      results,
      name,
      actualJson === expectedJson,
      actualJson === expectedJson
        ? ""
        : "expected " + expectedJson + " got " + actualJson
    );
  }

  function assertTruthy(results, name, value, detail) {
    record(results, name, Boolean(value), Boolean(value) ? "" : detail || "");
  }

  function assertMatches(results, name, value, pattern) {
    var ok = pattern.test(String(value == null ? "" : value));
    record(
      results,
      name,
      ok,
      ok ? "" : "value did not match " + pattern.toString()
    );
  }

  function assertDoesNotMatch(results, name, value, pattern) {
    var ok = !pattern.test(String(value == null ? "" : value));
    record(
      results,
      name,
      ok,
      ok ? "" : "value unexpectedly matched " + pattern.toString()
    );
  }

  function runSupabaseModuleTests() {
    var results = [];
    var config = global.SUPABASE_CONFIG;
    var backendMode = global.Unit3BackendMode;
    var keyMap = global.Unit3ActivityKeyMap;
    var adapter = global.Unit3SupabaseAdapter;
    var learningApi = global.SupabaseLearningApi;
    var client = global.SupabaseClient;

    // Config presence and safety
    assertTruthy(results, "supabase-config-present", config);
    if (config) {
      assertMatches(
        results,
        "config-project-url",
        config.projectUrl,
        /^https:\/\/hubwpkrqndorznwzvaer\.supabase\.co$/
      );
      assertMatches(
        results,
        "config-publishable-key",
        config.publishableKey,
        /^sb_publishable_/
      );
      // No privileged credentials anywhere in the module
      var configSerialised = JSON.stringify(config);
      assertDoesNotMatch(
        results,
        "config-no-service-role-key",
        configSerialised,
        /sb_secret_|service_role|SERVICE_ROLE|SUPABASE_DB_PASSWORD|postgresql:\/\//i
      );
      assertTruthy(
        results,
        "config-enabled-activities",
        Array.isArray(config.enabledActivities) &&
          config.enabledActivities.length >= 45
      );
      assertTruthy(
        results,
        "config-course-and-module",
        config.course === "ocr-level-3-it" &&
          config.module === "unit-3-cyber-security"
      );
      assertEquals(
        results,
        "config-version-alias",
        (config.activityVersionAliases || {})["1.0"],
        "1.0.0"
      );
    }

    // Backend mode
    assertTruthy(results, "backend-mode-module-present", backendMode);
    if (backendMode) {
      assertEquals(
        results,
        "backend-mode-default-is-apps-script",
        backendMode.getMode(),
        "APPS_SCRIPT"
      );
      var setResult;
      try {
        setResult = backendMode.setMode("SUPABASE");
      } catch (error) {
        setResult = error && error.message ? error.message : String(error);
      }
      assertEquals(results, "backend-mode-set-supabase", setResult, "SUPABASE");
      assertEquals(
        results,
        "backend-mode-after-set",
        backendMode.getMode(),
        "SUPABASE"
      );
      backendMode.clearOverride();
      assertEquals(
        results,
        "backend-mode-after-clear-defaults-apps-script",
        backendMode.getMode(),
        "APPS_SCRIPT"
      );
      var threw = false;
      try {
        backendMode.setMode("UNKNOWN_MODE");
      } catch (error) {
        threw = true;
      }
      assertTruthy(
        results,
        "backend-mode-rejects-unknown",
        threw,
        "setMode('UNKNOWN_MODE') should throw"
      );
    }

    // Activity key map
    assertTruthy(results, "activity-key-map-present", keyMap);
    if (keyMap) {
      assertEquals(
        results,
        "activity-key-week1-lowercase",
        keyMap.normaliseActivityKey("U3-W01-BASELINE"),
        "u3-w01-baseline"
      );
      assertEquals(
        results,
        "activity-key-week2-preserved",
        keyMap.normaliseActivityKey("week2-session1-retrieval"),
        "week2-session1-retrieval"
      );
      assertEquals(
        results,
        "activity-key-trim",
        keyMap.normaliseActivityKey("  U3-W01-CIA  "),
        "u3-w01-cia"
      );
      assertEquals(
        results,
        "question-key-uppercase-hyphen",
        keyMap.normaliseQuestionKey("s1-q1"),
        "S1-Q1"
      );
      assertEquals(
        results,
        "question-key-uppercase-mixed",
        keyMap.normaliseQuestionKey("Sort-01"),
        "SORT-01"
      );
      assertEquals(
        results,
        "activity-version-mapping",
        keyMap.normaliseActivityVersion("1.0"),
        "1.0.0"
      );
      assertEquals(
        results,
        "activity-version-passthrough",
        keyMap.normaliseActivityVersion("2.1.3"),
        "2.1.3"
      );
      var threwOnForbidden = false;
      try {
        keyMap.assertNoLearnerIdentity({ studentId: "AB123" });
      } catch (err) {
        threwOnForbidden = true;
      }
      assertTruthy(
        results,
        "forbidden-fields-reject-studentId",
        threwOnForbidden
      );
    }

    // Adapter and payload shape
    assertTruthy(results, "adapter-present", adapter);
    if (adapter && keyMap) {
      var responses = [
        {
          questionId: "s1-q1",
          response: { chosenIndex: 1 },
          correct: true,
          score: 1
        },
        {
          questionId: "s1-q2",
          response: { chosenIndex: 0 },
          correct: false,
          score: 0
        }
      ];
      var payload = adapter.buildRpcPayload({
        activityId: "week2-session1-retrieval",
        activityVersion: "1.0",
        clientAttemptId: "11111111-1111-1111-1111-111111111111",
        responses: responses,
        startedAt: "2026-08-10T12:00:00.000Z",
        completedAt: "2026-08-10T12:05:00.000Z"
      });
      assertEquals(
        results,
        "payload-activity-key-normalised",
        payload.p_activity_key,
        "week2-session1-retrieval"
      );
      assertEquals(
        results,
        "payload-activity-version-mapped",
        payload.p_activity_version,
        "1.0.0"
      );
      assertEquals(
        results,
        "payload-client-attempt-id",
        payload.p_client_attempt_id,
        "11111111-1111-1111-1111-111111111111"
      );
      assertEquals(
        results,
        "payload-programming-language-null",
        payload.p_programming_language,
        null
      );
      assertEquals(
        results,
        "payload-responses-uppercased",
        payload.p_responses[0].question_id,
        "S1-Q1"
      );
      assertDeepEqual(
        results,
        "payload-response-payload-preserved",
        payload.p_responses[0].response_payload,
        { chosenIndex: 1 }
      );
      assertEquals(
        results,
        "payload-response-is-correct",
        payload.p_responses[0].is_correct,
        true
      );
      assertEquals(
        results,
        "payload-response-awarded-score",
        payload.p_responses[0].awarded_score,
        1
      );
      // Only the eight RPC parameters may be present
      var allowedKeys = [
        "p_activity_key",
        "p_activity_version",
        "p_client_attempt_id",
        "p_responses",
        "p_source_page",
        "p_started_at",
        "p_completed_at",
        "p_programming_language"
      ];
      var extra = Object.keys(payload).filter(function (key) {
        return allowedKeys.indexOf(key) === -1;
      });
      assertEquals(results, "payload-only-allowed-keys", extra.length, 0);

      // Payload must not contain browser-owned learner identity
      var payloadJson = JSON.stringify(payload);
      assertDoesNotMatch(
        results,
        "payload-no-student-id",
        payloadJson,
        /"student_id"|"studentId"|"enrolment_id"|"assignment_id"|"attempt_number"|"max_score"/i
      );

      // Week 1 case normalisation from the adapter
      var week1Payload = adapter.buildRpcPayload({
        activityId: "U3-W01-BASELINE",
        activityVersion: "1.0",
        clientAttemptId: "22222222-2222-2222-2222-222222222222",
        responses: [
          {
            questionId: "b-q1",
            response: "example",
            correct: true,
            score: 1
          }
        ]
      });
      assertEquals(
        results,
        "week1-payload-activity-key-lowercased",
        week1Payload.p_activity_key,
        "u3-w01-baseline"
      );

      // Stable client_attempt_id across the same attempt
      adapter.clearClientAttemptId("week2-session1-retrieval");
      var first = adapter.getOrCreateClientAttemptId("week2-session1-retrieval");
      var second = adapter.getOrCreateClientAttemptId("week2-session1-retrieval");
      assertEquals(
        results,
        "client-attempt-id-stable-across-retries",
        first,
        second
      );
      var fresh = adapter.beginNewClientAttempt("week2-session1-retrieval");
      var notEqual = fresh !== first && fresh.length >= 12;
      record(
        results,
        "client-attempt-id-changes-on-new-attempt",
        notEqual,
        notEqual ? "" : "beginNewClientAttempt did not rotate the UUID"
      );

      // Response mapping — matching/classification style
      var classification = adapter.normaliseResponse({
        questionId: "sort-01",
        response: {
          category: "threat",
          subcategory: "phishing",
          justification: "External social engineering."
        },
        correct: true,
        score: 1,
        responseType: "classification"
      });
      assertEquals(
        results,
        "response-classification-question-id",
        classification.question_id,
        "SORT-01"
      );
      assertEquals(
        results,
        "response-classification-type",
        classification.response_type,
        "classification"
      );
      assertDeepEqual(
        results,
        "response-classification-payload",
        classification.response_payload,
        {
          category: "threat",
          subcategory: "phishing",
          justification: "External social engineering."
        }
      );

      // Multi-mark OCR-style response with an object evidence blob
      var ocr = adapter.normaliseResponse({
        questionId: "w2ocr-q07",
        response: {
          points: [
            { point: "Phishing", explain: "…", context: "Northbank" },
            { point: "Malware", explain: "…", context: "Northbank" }
          ],
          markCount: 6
        },
        correct: true,
        score: 6,
        responseType: "extended-response"
      });
      assertEquals(
        results,
        "response-ocr-multi-mark-key",
        ocr.question_id,
        "W2OCR-Q07"
      );
      assertEquals(
        results,
        "response-ocr-multi-mark-score",
        ocr.awarded_score,
        6
      );

      // Reflection/text response
      var reflection = adapter.normaliseResponse({
        questionId: "w2v101-q02",
        response: "Least privilege limits attacker impact.",
        correct: true,
        score: 1,
        responseType: "reflection"
      });
      assertEquals(
        results,
        "response-reflection-key",
        reflection.question_id,
        "W2V101-Q02"
      );
      assertEquals(
        results,
        "response-reflection-type",
        reflection.response_type,
        "reflection"
      );
      assertEquals(
        results,
        "response-reflection-payload",
        reflection.response_payload,
        "Least privilege limits attacker impact."
      );
    }

    // Learning API — signed-out submissions must be prevented
    assertTruthy(results, "learning-api-present", learningApi);
    if (learningApi) {
      var canSubmit = learningApi.canSubmit({
        p_activity_key: "week2-session1-retrieval"
      });
      assertEquals(results, "signed-out-can-submit-false", canSubmit, false);
    }

    // Client wrapper — no privileged credential handling
    if (client) {
      assertEquals(
        results,
        "client-is-configured-shape",
        typeof client.isConfigured,
        "function"
      );
    }

    var runner = global.Unit3SupabaseSubmitRunner;
    assertTruthy(results, "shared-submit-runner-present", runner);
    if (runner) {
      assertEquals(
        results,
        "runner-exposes-in-flight-guard",
        typeof runner.isInFlight,
        "function"
      );
      assertEquals(
        results,
        "runner-not-in-flight-initially",
        runner.isInFlight(),
        false
      );
    }

    // Question-key aliases and Week 1 force override
    var aliases = global.Unit3QuestionKeyAliases;
    assertTruthy(results, "question-key-aliases-present", aliases);
    if (aliases && keyMap) {
      assertEquals(
        results,
        "alias-week2-ocr",
        keyMap.normaliseQuestionKey("ocr-q1", "week2-ocr-question-practice"),
        "W2OCR-Q01"
      );
      assertEquals(
        results,
        "alias-week4-motivation",
        keyMap.normaliseQuestionKey("mot-kc3", "week4-motivations-learning"),
        "MOTKC3"
      );
      assertEquals(
        results,
        "alias-week5-answer-improvement",
        keyMap.normaliseQuestionKey("m2", "week5-answer-improvement"),
        "AI2"
      );
      assertEquals(
        results,
        "uppercase-week2-retrieval-still-works",
        keyMap.normaliseQuestionKey("s1-q1", "week2-session1-retrieval"),
        "S1-Q1"
      );
    }

    if (backendMode) {
      var originalPath = global.location && global.location.pathname;
      var originalSearch = global.location && global.location.search;
      if (global.location) {
        global.location.pathname = "/activities/activity.html";
        global.location.search = "?activityId=U3-W01-BASELINE";
      }
      assertEquals(
        results,
        "week1-activity-api-forced-apps-script",
        backendMode.getMode(),
        "APPS_SCRIPT"
      );
      assertTruthy(
        results,
        "week1-override-helper",
        backendMode.isWeek1ActivityApiPage &&
          backendMode.isWeek1ActivityApiPage()
      );
      if (global.location) {
        global.location.pathname = originalPath || "/tests/supabase/";
        global.location.search = originalSearch || "";
      }
      backendMode.clearOverride();
    }

    // Evidence helpers across response families
    var evidence = global.Unit3SupabaseEvidence;
    assertTruthy(results, "evidence-helpers-present", evidence);
    if (evidence && adapter) {
      var quizResponses = evidence.fromQuizResult(
        {
          answers: [
            { questionId: "s1-q1", chosenIndex: 1, correct: true },
            { questionId: "s1-q2", chosenIndex: 0, correct: false }
          ]
        },
        [
          { id: "s1-q1", options: ["A", "B"] },
          { id: "s1-q2", options: ["A", "B"] }
        ]
      );
      assertEquals(results, "evidence-quiz-count", quizResponses.length, 2);
      assertEquals(
        results,
        "evidence-quiz-selected-option",
        quizResponses[0].response.selectedOption,
        "B"
      );

      var sort = evidence.classification("sort-01", "threat", {
        correct: true,
        score: 1
      });
      assertEquals(results, "evidence-classification-type", sort.responseType, "classification");

      var reflection = evidence.freeText(
        "w2v101-q01",
        "Least privilege limits impact.",
        { responseType: "reflection" }
      );
      assertEquals(results, "evidence-reflection-type", reflection.responseType, "reflection");

      var ocr = evidence.structured(
        "W2OCR-Q07",
        { text: "Point–Explanation–Context", markCount: 6 },
        { responseType: "extended-response", score: 6, correct: true }
      );
      assertEquals(results, "evidence-ocr-score", ocr.score, 6);

      var matching = evidence.structured(
        "C1",
        { bestAnswer: "phisher", evidence: "cloned login page" },
        { responseType: "matching", correct: true, score: 1 }
      );
      assertEquals(results, "evidence-matching-key", matching.questionId, "C1");

      // Payload from mixed evidence must still only include RPC fields
      var mixedPayload = adapter.buildRpcPayload({
        activityId: "week2-threat-vulnerability-sort",
        activityVersion: "1.0",
        clientAttemptId: "33333333-3333-3333-3333-333333333333",
        responses: [sort, reflection, ocr, matching]
      });
      assertEquals(
        results,
        "mixed-payload-version",
        mixedPayload.p_activity_version,
        "1.0.0"
      );
      assertEquals(
        results,
        "mixed-payload-sort-key",
        mixedPayload.p_responses[0].question_id,
        "SORT-01"
      );
    }

    return results;
  }

  global.Unit3SupabaseTests = Object.freeze({
    runSupabaseModuleTests: runSupabaseModuleTests
  });
})(typeof window !== "undefined" ? window : this);
