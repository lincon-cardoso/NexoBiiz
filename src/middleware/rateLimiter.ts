import { NextApiRequest, NextApiResponse } from "next";

const attemptTracker: Record<
  string,
  { attempts: number; lastAttempt: number }
> = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

export const loginRateLimiter = (
  req: NextApiRequest | Request,
  res: NextApiResponse,
  next: () => void
) => {
  const ip =
    req instanceof Request
      ? req.headers.get("x-forwarded-for") ||
        req.headers.get("remote-address") ||
        ""
      : (
          req.headers["x-forwarded-for"] ||
          req.socket?.remoteAddress ||
          ""
        ).toString();

  const sanitizedIp = ip.split(",")[0]?.trim();

  if (!sanitizedIp) {
    return res
      .status(500)
      .json({ error: "Não foi possível identificar o IP." });
  }

  const now = Date.now();
  const tracker = attemptTracker[sanitizedIp] || {
    attempts: 0,
    lastAttempt: 0,
  };

  if (
    tracker.attempts >= MAX_ATTEMPTS &&
    now - tracker.lastAttempt < WINDOW_MS
  ) {
    return res.status(429).json({
      error:
        "Muitas tentativas de login. Por favor, tente novamente mais tarde.",
    });
  }

  if (now - tracker.lastAttempt > WINDOW_MS) {
    tracker.attempts = 0;
  }

  tracker.attempts++;
  tracker.lastAttempt = now;
  attemptTracker[sanitizedIp] = tracker;

  next();
};
