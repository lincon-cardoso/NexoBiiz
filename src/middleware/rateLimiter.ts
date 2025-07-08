import { NextApiRequest, NextApiResponse } from "next";
import DOMPurify from "dompurify";
import Joi from "joi";

const attemptTracker: Record<
  string,
  { attempts: number; lastAttempt: number; blockedUntil?: number }
> = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutos

const transactionSchema = Joi.object({
  tipo: Joi.string().valid("ganho", "custo").required(),
  descricao: Joi.string().max(255).required(),
  valor: Joi.number().positive().required(),
});

export const enhancedRateLimiter = (
  req: NextApiRequest | Request,
  res: NextApiResponse | undefined,
  next: () => void
) => {
  const ip =
    req instanceof Request
      ? req.headers.get("x-forwarded-for") ||
        req.headers.get("remote-address") ||
        ""
      : req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";

  const sanitizedIp = Array.isArray(ip)
    ? ip[0]?.trim()
    : ip.split(",")[0]?.trim();

  if (!sanitizedIp) {
    if (res) {
      return res
        .status(500)
        .json({ error: "Não foi possível identificar o IP." });
    }
    throw new Error("Não foi possível identificar o IP.");
  }

  const now = Date.now();
  const tracker = attemptTracker[sanitizedIp] || {
    attempts: 0,
    lastAttempt: 0,
  };

  if (tracker.blockedUntil && now < tracker.blockedUntil) {
    if (res) {
      return res.status(429).json({
        error:
          "IP bloqueado temporariamente devido a muitas tentativas. Tente novamente mais tarde.",
      });
    }
    throw new Error(
      "IP bloqueado temporariamente devido a muitas tentativas. Tente novamente mais tarde."
    );
  }

  if (
    tracker.attempts >= MAX_ATTEMPTS &&
    now - tracker.lastAttempt < WINDOW_MS
  ) {
    tracker.blockedUntil = now + BLOCK_DURATION_MS;
    attemptTracker[sanitizedIp] = tracker;
    if (res) {
      return res.status(429).json({
        error: "Muitas tentativas de requisição. IP bloqueado temporariamente.",
      });
    }
    throw new Error(
      "Muitas tentativas de requisição. IP bloqueado temporariamente."
    );
  }

  if (now - tracker.lastAttempt > WINDOW_MS) {
    tracker.attempts = 0;
  }

  tracker.attempts++;
  tracker.lastAttempt = now;
  attemptTracker[sanitizedIp] = tracker;

  // Validação de entrada
  if (req.method === "POST") {
    try {
      const body = req.body;
      const sanitizedBody = DOMPurify.sanitize(JSON.stringify(body));
      const parsedBody = JSON.parse(sanitizedBody);
      const { error } = transactionSchema.validate(parsedBody);
      if (error) {
        if (res) {
          return res.status(400).json({ error: "Dados inválidos." });
        }
        throw new Error("Dados inválidos.");
      }
    } catch {
      if (res) {
        return res.status(400).json({ error: "Erro ao processar entrada." });
      }
      throw new Error("Erro ao processar entrada.");
    }
  }

  next();
};
