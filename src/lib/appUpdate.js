const isDesktop = () => typeof window !== "undefined" && !!window.__TAURI_INTERNALS__;

export async function checkForAppUpdate() {
  if (!isDesktop()) return;
  try {
    const { check } = await import("@tauri-apps/plugin-updater");
    const update = await check();
    if (!update?.available) return;

    const { ask } = await import("@tauri-apps/plugin-dialog");
    const accepted = await ask(`Compilearn ${update.version} is ready to install.`, {
      title: "Update available",
      kind: "info",
      okLabel: "Install and restart",
      cancelLabel: "Later",
    });
    if (!accepted) return;

    await update.downloadAndInstall();
    const { relaunch } = await import("@tauri-apps/plugin-process");
    await relaunch();
  } catch (err) {
    console.warn("[update] check failed", err);
  }
}
