const isServer = typeof window === "undefined";

export function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  return `${timestamp}-${random}`;
}

function serializeError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return { raw: String(err) };
}

function serializeExtras(
  extras: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(extras)) {
    out[k] = v instanceof Error ? serializeError(v) : v;
  }
  return out;
}

type Level = "debug" | "info" | "warn" | "error";

function log(
  level: Level,
  correlationId: string,
  stage: string,
  message: string,
  extras?: Record<string, unknown>
): void {
  const entry: Record<string, unknown> = {
    level,
    correlationId,
    stage,
    message,
    timestamp: new Date().toISOString(),
    ...(extras ? serializeExtras(extras) : {}),
  };

  if (isServer) {
    process.stdout.write(JSON.stringify(entry) + "\n");
  } else {
    const prefix = `[${level.toUpperCase()}] [${correlationId}] [${stage}]`;
    const fn =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "debug"
            ? console.debug
            : console.log;
    extras ? fn(prefix, message, serializeExtras(extras)) : fn(prefix, message);
  }
}

export interface Logger {
  debug(message: string, extras?: Record<string, unknown>): void;
  info(message: string, extras?: Record<string, unknown>): void;
  warn(message: string, extras?: Record<string, unknown>): void;
  error(message: string, extras?: Record<string, unknown>): void;
}

export function createLogger(correlationId: string): (stage: string) => Logger {
  return (stage: string): Logger => ({
    debug: (message, extras) => log("debug", correlationId, stage, message, extras),
    info:  (message, extras) => log("info",  correlationId, stage, message, extras),
    warn:  (message, extras) => log("warn",  correlationId, stage, message, extras),
    error: (message, extras) => log("error", correlationId, stage, message, extras),
  });
}
