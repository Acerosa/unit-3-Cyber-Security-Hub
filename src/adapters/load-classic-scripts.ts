const loaded = new Set<string>();

export function loadClassicScript(src: string): Promise<void> {
  if (loaded.has(src)) return Promise.resolve();
  if (typeof document === "undefined") return Promise.resolve();
  loaded.add(src);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-unit3-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.unit3Src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("UNIT3_SCRIPT_FAILED:" + src));
    document.body.appendChild(el);
  });
}

export async function loadClassicScripts(srcs: string[]): Promise<void> {
  for (const src of srcs) {
    await loadClassicScript(src);
  }
}
