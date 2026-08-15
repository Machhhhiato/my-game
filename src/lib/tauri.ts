export const isTauri: boolean =
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export async function showWidgetWindow(): Promise<void> {
  if (!isTauri) return;
  const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');
  const win = await WebviewWindow.getByLabel('widget');
  if (win) {
    await win.show();
    await win.setFocus();
  }
}
