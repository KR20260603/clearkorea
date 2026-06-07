export function shouldAutoHide(input: {
  readonly reports: number;
  readonly dislikes: number;
  readonly settings: { readonly autoHideEnabled: boolean; readonly threshold: number };
}): boolean {
  if (!input.settings.autoHideEnabled) {
    return false;
  }
  return input.reports + input.dislikes >= input.settings.threshold;
}
