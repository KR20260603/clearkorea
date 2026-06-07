export function relativeTimeLabel(iso: string, now: number = Date.now()): string {
  const diffMs = now - Date.parse(iso);
  if (!Number.isFinite(diffMs) || diffMs < 60_000) {
    return "now";
  }
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  return `${Math.floor(hours / 24)}d`;
}
