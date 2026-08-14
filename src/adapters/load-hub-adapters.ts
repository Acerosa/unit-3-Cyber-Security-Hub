import inventory from "../../test/fixtures/route-inventory.json";
import { createSitePath } from "../paths";
import { loadClassicScripts } from "./load-classic-scripts";

let loaded = false;

export async function loadHubAdapters(root: string) {
  if (loaded) return;
  loaded = true;
  await loadClassicScripts(inventory.sharedAdapters.map((file) => createSitePath(root, file)));
}

export async function loadPageScripts(root: string, scripts: string[]) {
  await loadClassicScripts(scripts.map((file) => createSitePath(root, file)));
}
