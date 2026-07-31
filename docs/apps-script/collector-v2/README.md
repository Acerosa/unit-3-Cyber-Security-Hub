# Collector v2: allow 10, 12 and 15 mark totals

This folder contains a backward-compatible Google Apps Script update for the existing Unit 3 formative results collector.

## Why this update is needed

- Baseline Knowledge Check submits `totalCards = 10`
- Incident Classification and Cyber Security Glossary submit `totalCards = 12`
- Session 2 Retrieval Quiz submits `totalCards = 15`
- The original collector only accepted a single total (12)

## What is preserved

- Existing spreadsheet
- Existing worksheet structure and field names
- Existing `/exec` web app URL after redeployment of the same deployment
- Duplicate Attempt ID checking
- Score range validation against the submitted total
- Text-length limits
- Completion-time validation
- Formula-injection protection
- Script locking for simultaneous submissions

## Configuration

Add or keep this setting on the `Configuration` sheet:

| Setting | Suggested value |
| --- | --- |
| Allowed totals | `10,12,15` |

If the live Configuration sheet still shows only `12,15`, update it to `10,12,15`.

If `Allowed totals` is missing, the script falls back to the existing `Total cards` setting.

## Manual deployment steps

1. Open the existing Apps Script project linked to the results spreadsheet.
2. Replace the current server code with `Code.gs` from this folder, or merge the Allowed totals validation into your live script carefully.
3. Save the project.
4. Run `setupWorkbook` once from the Apps Script editor to ensure the Configuration sheet contains `Allowed totals`.
5. Authorise the script if prompted.
6. Open **Deploy → Manage deployments**.
7. Edit the existing web app deployment.
8. Set version to **New version**.
9. Keep the same access settings.
10. Deploy and confirm the `/exec` URL is unchanged.
11. Set **Allowed totals** to `10,12,15` in Configuration.
12. Test:
    - Baseline Knowledge Check with `totalCards = 10`
    - Incident Classification with `totalCards = 12`
    - Cyber Security Glossary with `totalCards = 12`
    - Retrieval Quiz with `totalCards = 15`

## Important

Do not create a brand-new web app deployment if that would generate a new `/exec` URL.

Ten-mark baseline submissions and fifteen-mark retrieval quiz submissions are not operational until this updated Apps Script has been deployed and Allowed totals includes `10,12,15`.
