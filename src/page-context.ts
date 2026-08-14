export type PageContext = {
  page: string;
  section: string;
  root: string;
  view: string;
  week?: number;
  activity?: string;
  activityId?: string;
};

export function readPageContext(body: HTMLElement = document.body): PageContext {
  const params = new URLSearchParams(window.location.search);
  const weekValue = body.dataset.week ? Number(body.dataset.week) : undefined;
  return {
    page: body.dataset.page || "home",
    section: body.dataset.section || body.dataset.page || "home",
    root: body.dataset.root || ".",
    view: body.dataset.view || "home",
    week: Number.isFinite(weekValue) ? weekValue : undefined,
    activity: body.dataset.activity,
    activityId: params.get("activityId") || body.dataset.activityId
  };
}

export function currentIds(context: PageContext): string[] {
  return context.page === context.section ? [context.page] : [context.page, context.section];
}
