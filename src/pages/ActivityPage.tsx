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
  return (
    <>
      <Callout
        tone="info"
        title="Formative activity"
        message="This activity is for practice. It is not a qualification grade, and you can retry it."
      />
      <PageHost
        root={context.root}
        scripts={route?.scripts || []}
        adaptersReady={adaptersReady}
      />
    </>
  );
}
