/**
 * Unit 3 Supabase migration test suite (browser runner + Node-compatible).
 *
 * Verifies:
 *   - Supabase public configuration exists with no privileged credentials
 *   - Explicit rollback backend mode with no automatic Apps Script fallback
 *   - Activity key normalisation (Week 1 upper- to lower-case)
 *   - Activity version mapping (1.0 fallback; Batch B catalogue versions by activity)
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
    var onboarding = global.SupabaseOnboarding;

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
        "backend-mode-default-is-supabase",
        backendMode.getMode(),
        "SUPABASE"
      );
      var setResult;
      try {
        setResult = backendMode.setMode("APPS_SCRIPT");
      } catch (error) {
        setResult = error && error.message ? error.message : String(error);
      }
      assertEquals(results, "backend-mode-set-apps-script", setResult, "APPS_SCRIPT");
      assertEquals(
        results,
        "backend-mode-ignores-storage-override",
        backendMode.getMode(),
        "SUPABASE"
      );
      backendMode.clearOverride();
      assertEquals(
        results,
        "backend-mode-after-clear-defaults-supabase",
        backendMode.getMode(),
        "SUPABASE"
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
      assertEquals(
        results,
        "catalogue-version-week2-malware",
        keyMap.catalogueVersionFor("week2-malware-symptoms"),
        "1.1.0"
      );
      assertEquals(
        results,
        "catalogue-version-week2-ocr",
        keyMap.catalogueVersionFor("week2-ocr-question-practice"),
        "1.2.0"
      );
      assertEquals(
        results,
        "catalogue-version-week5-patterns",
        keyMap.catalogueVersionFor("week5-vulnerability-patterns"),
        "1.0.0"
      );
      assertEquals(
        results,
        "catalogue-version-week1",
        keyMap.catalogueVersionFor("U3-W01-BASELINE"),
        "1.2.0"
      );
      assertEquals(
        results,
        "catalogue-version-week6-legislation",
        keyMap.catalogueVersionFor("week6-legislation-matching"),
        "1.2.0"
      );
      assertEquals(
        results,
        "activity-version-uses-catalogue-when-activity-known",
        keyMap.normaliseActivityVersion("1.0", "week2-session1-retrieval"),
        "1.1.0"
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
          response: { chosenIndex: 1, selectedOptionId: "b" },
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
        "1.1.0"
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
        { chosenIndex: 1, selectedOptionId: "B", optionId: "B" }
      );
      assertEquals(
        results,
        "payload-response-omits-client-mark",
        payload.p_responses[0].is_correct,
        undefined
      );
      assertEquals(
        results,
        "payload-response-omits-awarded-score",
        payload.p_responses[0].awarded_score,
        undefined
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

      // Week 1 mapping uses live catalogue keys and Batch B 1.2.0.
      // Production submit remains Apps Script; this only tests the mapping layer.
      var week1Payload = adapter.buildRpcPayload({
        activityId: "U3-W01-BASELINE",
        activityVersion: "1.0",
        clientAttemptId: "22222222-2222-2222-2222-222222222222",
        responses: [
          {
            questionId: "BAS-Q01",
            response: { optionId: "a" },
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
      assertEquals(
        results,
        "week1-payload-activity-version-batch-b",
        week1Payload.p_activity_version,
        "1.2.0"
      );
      assertEquals(
        results,
        "week1-payload-question-id",
        week1Payload.p_responses[0].question_id,
        "BAS-Q01"
      );
      assertEquals(
        results,
        "week1-payload-omits-is-correct",
        week1Payload.p_responses[0].is_correct,
        undefined
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
          justification: "External social engineering.",
          categoryId: "threat"
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
        "response-ocr-omits-client-score",
        ocr.awarded_score,
        undefined
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

    if (client) {
      assertEquals(
        results,
        "client-exposes-sign-up",
        typeof client.signUpWithPassword,
        "function"
      );
    }

    var auth = global.SupabaseAuth;
    if (auth) {
      assertEquals(
        results,
        "auth-exposes-sign-up",
        typeof auth.signUpWithPassword,
        "function"
      );
      assertEquals(
        results,
        "auth-exposes-is-signed-in",
        typeof auth.isSignedIn,
        "function"
      );
      assertEquals(
        results,
        "auth-exposes-context-refresh",
        typeof auth.refreshContext,
        "function"
      );
    }

    assertTruthy(results, "onboarding-module-present", onboarding);
    if (onboarding) {
      assertEquals(
        results,
        "onboarding-exposes-registration-options",
        typeof onboarding.getRegistrationOptions,
        "function"
      );
      assertEquals(
        results,
        "onboarding-exposes-completion",
        typeof onboarding.complete,
        "function"
      );
      var leadingZeroProfile = onboarding.validateProfile({
        firstName: "Ada",
        surname: "Lovelace",
        studentNumber: "001234"
      });
      assertEquals(
        results,
        "onboarding-preserves-leading-zeroes",
        leadingZeroProfile.value.studentNumber,
        "001234"
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
        "alias-week2-ocr-q8",
        keyMap.normaliseQuestionKey("ocr-q8", "week2-ocr-question-practice"),
        "W2OCR-Q08"
      );
      assertEquals(
        results,
        "alias-week2-ocr-canonical-passthrough",
        keyMap.normaliseQuestionKey("W2OCR-Q08", "week2-ocr-question-practice"),
        "W2OCR-Q08"
      );
      assertEquals(
        results,
        "alias-week4-mtm-mot",
        keyMap.normaliseQuestionKey("map-espionage-mot", "week4-mtm-mapping"),
        "MAP1MOT"
      );
      assertEquals(
        results,
        "alias-week4-mtm-tgt",
        keyMap.normaliseQuestionKey("MAP4TGT", "week4-mtm-mapping"),
        "MAP4TGT"
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
      assertEquals(results, "evidence-reflection-default-unscored", reflection.correct, false);
      assertEquals(results, "evidence-reflection-default-score", reflection.score, 0);

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
        "1.1.0"
      );
      assertEquals(
        results,
        "mixed-payload-sort-key",
        mixedPayload.p_responses[0].question_id,
        "SORT-01"
      );
      assertEquals(
        results,
        "mixed-payload-sort-option-from-category",
        mixedPayload.p_responses[0].response_payload.optionId,
        "A"
      );
      assertEquals(
        results,
        "mixed-payload-sort-preserves-category",
        mixedPayload.p_responses[0].response_payload.category,
        "threat"
      );
    }

    if (adapter && keyMap) {
      var chosenIndexPayload = adapter.normaliseResponse(
        {
          questionId: "mw-q1",
          response: { chosenIndex: 1 },
          responseType: "single-choice"
        },
        "week2-malware-symptoms"
      );
      assertEquals(
        results,
        "chosen-index-fallback-week2-uppercase",
        chosenIndexPayload.response_payload.optionId,
        "B"
      );

      var ocrOption = adapter.normaliseResponse(
        {
          questionId: "ocr-q7",
          response: { chosenIndex: 2, selectedOptionId: "c" },
          responseType: "single-choice"
        },
        "week2-ocr-question-practice"
      );
      assertEquals(results, "ocr-q7-maps-to-q07", ocrOption.question_id, "W2OCR-Q07");
      assertEquals(
        results,
        "ocr-option-letter-lowercase",
        ocrOption.response_payload.optionId,
        "c"
      );

      var selectedAlias = adapter.normaliseResponse(
        {
          questionId: "P1",
          response: { selectedOptionId: "A" },
          responseType: "single-choice"
        },
        "week5-vulnerability-patterns"
      );
      assertEquals(
        results,
        "selected-option-id-to-option-id-lower",
        selectedAlias.response_payload.optionId,
        "a"
      );

      var week5Version = adapter.buildRpcPayload({
        activityId: "week5-vulnerability-patterns",
        activityVersion: "1.0",
        clientAttemptId: "44444444-4444-4444-4444-444444444444",
        responses: [{ questionId: "P1", response: { optionId: "a" } }]
      });
      assertEquals(
        results,
        "week5-patterns-keeps-1-0-0",
        week5Version.p_activity_version,
        "1.0.0"
      );

      var ocrVersion = adapter.buildRpcPayload({
        activityId: "week2-ocr-question-practice",
        activityVersion: "1.0",
        clientAttemptId: "55555555-5555-5555-5555-555555555555",
        responses: [
          { questionId: "ocr-q8", response: { text: "phishing at Northbank" } }
        ]
      });
      assertEquals(results, "ocr-version-1-2-0", ocrVersion.p_activity_version, "1.2.0");
      assertEquals(
        results,
        "ocr-q8-maps-to-w2ocr-q08",
        ocrVersion.p_responses[0].question_id,
        "W2OCR-Q08"
      );
      assertDeepEqual(
        results,
        "ocr-q8-text-passthrough",
        ocrVersion.p_responses[0].response_payload,
        { text: "phishing at Northbank" }
      );

      var classificationMapped = adapter.normaliseResponse(
        {
          questionId: "sort-01",
          response: {
            category: "vulnerability",
            justification: "Weak password."
          },
          responseType: "classification"
        },
        "week2-threat-vulnerability-sort"
      );
      assertDeepEqual(
        results,
        "classification-maps-category-and-option",
        classificationMapped.response_payload,
        {
          category: "vulnerability",
          justification: "Weak password.",
          optionId: "B",
          categoryId: "vulnerability"
        }
      );

      var incidents = adapter.normaliseResponse(
        {
          questionId: "INC-Q01",
          value: {
            incidentType: "phishing",
            ciaAim: "Confidentiality",
            evidence: "Fake invoice email."
          },
          responseType: "matching"
        },
        "U3-W01-INCIDENTS"
      );
      assertEquals(results, "week1-incident-key", incidents.question_id, "INC-Q01");
      assertDeepEqual(
        results,
        "week1-incident-multi-field-preserved",
        incidents.response_payload,
        {
          incidentType: "phishing",
          ciaAim: "Confidentiality",
          evidence: "Fake invoice email."
        }
      );

      var legislation = adapter.normaliseResponse(
        {
          questionId: "M1",
          response: {
            legislation: "Computer Misuse Act 1990",
            duty: "Unauthorised access"
          },
          responseType: "matching"
        },
        "week6-legislation-matching"
      );
      assertDeepEqual(
        results,
        "legislation-multi-field-preserved",
        legislation.response_payload,
        {
          legislation: "Computer Misuse Act 1990",
          duty: "Unauthorised access"
        }
      );

      var mtmMot = adapter.normaliseResponse(
        {
          questionId: "MAP1MOT",
          response: {
            motivation: "Espionage",
            evidence: "Quiet collection",
            connection: "Secret documents without publicity."
          },
          responseType: "structured"
        },
        "week4-mtm-mapping"
      );
      assertEquals(results, "mtm-mot-option-from-label", mtmMot.response_payload.optionId, "m0");
      assertEquals(
        results,
        "mtm-mot-keeps-motivation",
        mtmMot.response_payload.motivation,
        "Espionage"
      );

      var week7Path = adapter.buildRpcPayload({
        activityId: "week7-session2-retrieval",
        activityVersion: "1.0",
        clientAttemptId: "66666666-6666-6666-6666-666666666666",
        responses: [{ questionId: "S2R1", response: { chosenIndex: 0 } }]
      });
      assertEquals(
        results,
        "week7-submission-path-version",
        week7Path.p_activity_version,
        "1.1.0"
      );
      assertEquals(results, "week7-submission-path-key", week7Path.p_responses[0].question_id, "S2R1");
      assertEquals(
        results,
        "week7-chosen-index-lower-letter",
        week7Path.p_responses[0].response_payload.optionId,
        "a"
      );

      var marked = adapter.normaliseResponse(
        {
          questionId: "S1-Q1",
          response: {
            optionId: "B",
            awarded_score: 1,
            is_correct: true
          }
        },
        "week2-session1-retrieval"
      );
      assertEquals(results, "strips-awarded-score", marked.response_payload.awarded_score, undefined);
      assertEquals(results, "strips-is-correct", marked.response_payload.is_correct, undefined);
      assertEquals(results, "keeps-server-option", marked.response_payload.optionId, "B");

      var unknownAliasThrew = false;
      var unknownAliasMessage = "";
      try {
        keyMap.normaliseQuestionKey("ocr-q99", "week2-ocr-question-practice");
      } catch (err) {
        unknownAliasThrew = /UNKNOWN_QUESTION/.test(String(err && err.message));
        unknownAliasMessage = String(err && err.message);
      }
      record(
        results,
        "unknown-alias-fails-closed",
        unknownAliasThrew,
        unknownAliasThrew ? "" : unknownAliasMessage || "expected UNKNOWN_QUESTION"
      );

      var bareMtmThrew = false;
      try {
        keyMap.normaliseQuestionKey("map-espionage", "week4-mtm-mapping");
      } catch (err) {
        bareMtmThrew = /UNKNOWN_QUESTION/.test(String(err && err.message));
      }
      record(
        results,
        "mtm-bare-scenario-fails-closed",
        bareMtmThrew,
        bareMtmThrew ? "" : "map-espionage must not invent MAP1"
      );

      var missingWeek1Threw = false;
      try {
        adapter.normaliseResponse(
          { questionId: "b-q1", response: "example" },
          "U3-W01-BASELINE"
        );
      } catch (err) {
        missingWeek1Threw = /UNKNOWN_QUESTION/.test(String(err && err.message));
      }
      record(
        results,
        "missing-week1-mapping-fails-closed",
        missingWeek1Threw,
        missingWeek1Threw ? "" : "b-q1 must not invent B-Q1"
      );

      var malformedThrew = false;
      try {
        adapter.normaliseResponse(
          {
            questionId: "sort-01",
            response: "threat",
            responseType: "classification"
          },
          "week2-threat-vulnerability-sort"
        );
      } catch (err) {
        malformedThrew = /MALFORMED_CLASSIFICATION/.test(String(err && err.message));
      }
      record(
        results,
        "malformed-classification-fails-closed",
        malformedThrew,
        malformedThrew ? "" : "string classification payload must throw"
      );

      var emptyClassificationThrew = false;
      try {
        adapter.normaliseResponse(
          {
            questionId: "sort-01",
            response: {},
            responseType: "classification"
          },
          "week2-threat-vulnerability-sort"
        );
      } catch (err) {
        emptyClassificationThrew = /MALFORMED_CLASSIFICATION/.test(
          String(err && err.message)
        );
      }
      record(
        results,
        "empty-classification-fails-closed",
        emptyClassificationThrew,
        emptyClassificationThrew ? "" : "empty classification object must throw"
      );

      var week1Counts = {
        "u3-w01-baseline": [
          "BAS-Q01",
          "BAS-Q02",
          "BAS-Q03",
          "BAS-Q04",
          "BAS-Q05",
          "BAS-Q06",
          "BAS-Q07",
          "BAS-Q08",
          "BAS-Q09",
          "BAS-Q10"
        ],
        "u3-w01-incidents": [
          "INC-Q01",
          "INC-Q02",
          "INC-Q03",
          "INC-Q04",
          "INC-Q05",
          "INC-Q06",
          "INC-Q07",
          "INC-Q08",
          "INC-Q09",
          "INC-Q10",
          "INC-Q11",
          "INC-Q12"
        ]
      };
      Object.keys(week1Counts).forEach(function (activityId) {
        var keys = week1Counts[activityId];
        var mapped = keys.map(function (id) {
          return keyMap.normaliseQuestionKey(id, activityId);
        });
        var unique = mapped.filter(function (id, index) {
          return mapped.indexOf(id) === index;
        });
        record(
          results,
          "week1-response-count-" + activityId,
          unique.length === keys.length &&
            unique.every(function (id, index) {
              return id === keys[index];
            }),
          unique.length === keys.length
            ? ""
            : "mapped " + unique.join(",")
        );
      });
    }

    return results;
  }

  global.Unit3SupabaseTests = Object.freeze({
    runSupabaseModuleTests: runSupabaseModuleTests
  });
})(typeof window !== "undefined" ? window : this);
