import { Callout } from "@learning-platform/ui";
import type { PageContext } from "../page-context";
import { findRoute } from "../page-copy";
import { PageHost } from "./PageHost";

export function ActivityPage({
  context,
  adaptersReady
}: {
  context: PageContext;
  adaptersReady: boolean;
}) {
  const route = findRoute(context);
  const week1 = context.view === "week1-activity";
  return (
    <>
      <Callout
        tone="info"
        title={week1 ? "Week 1 Activity API" : "Formative activity"}
        message={week1
          ? "This activity is marked by the Week 1 Activity API. Answers are not stored in the browser marking path."
          : "This activity is formative. It is not a qualification grade, and you can retry it."}
      />
      <PageHost
        root={context.root}
        scripts={route?.scripts || []}
        adaptersReady={adaptersReady}
      />
    </>
  );
}
