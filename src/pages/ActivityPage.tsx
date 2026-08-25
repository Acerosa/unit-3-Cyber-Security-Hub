import { Callout } from "@learning-platform/ui";
import {
  PILOT_ACTIVITY_ID,
  isCataloguePilotPage,
  publishedActivity,
  scorableBlocks,
  scriptsForActivityPage
} from "../catalogue/week2-session1-retrieval";
import type { PageContext } from "../page-context";
import { findRoute } from "../page-copy";
import { CataloguePilot } from "./CataloguePilot";
import { PageHost } from "./PageHost";

export function ActivityPage({
  context,
  adaptersReady
}: {
  context: PageContext;
  adaptersReady: boolean;
}) {
  const route = findRoute(context);
  const activity = isCataloguePilotPage(context.page)
    ? publishedActivity(window.__lpPackage, PILOT_ACTIVITY_ID)
    : null;
  const usePilot = Boolean(activity && scorableBlocks(activity).length);
  const scripts = usePilot
    ? scriptsForActivityPage(context.page, route?.scripts || [])
    : route?.scripts || [];

  return (
    <>
      <Callout
        tone="info"
        title="Formative activity"
        message="This activity is for practice. It is not a qualification grade, and you can retry it."
      />
      <PageHost
        root={context.root}
        scripts={scripts}
        adaptersReady={adaptersReady}
      />
      {usePilot && activity ? (
        <CataloguePilot activity={activity} adaptersReady={adaptersReady} />
      ) : null}
    </>
  );
}
