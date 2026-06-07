export type AnalyticsSink = {
  capture(event: string, properties?: Record<string, unknown>): void;
};

// Capture only the error message and explicit context, never raw PII or full
// request bodies. No-ops when analytics is not configured.
export function captureError(
  sink: AnalyticsSink | null,
  error: unknown,
  context: Record<string, unknown> = {},
): void {
  if (!sink) {
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  sink.capture("$exception", { message, ...context });
}
