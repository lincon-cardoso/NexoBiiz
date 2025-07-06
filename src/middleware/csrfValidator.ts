import { NextApiRequest, NextApiResponse } from "next";

// Middleware para validar CSRF token
export const csrfValidator = (
  req: NextApiRequest | Request,
  res: NextApiResponse,
  next: () => void
) => {
  const csrfToken =
    req.headers instanceof Headers
      ? req.headers.get("x-csrf-token")
      : req.headers["x-csrf-token"];

  const validToken = "cookies" in req ? req.cookies?.["csrf-token"] : undefined;

  if (!csrfToken || csrfToken !== validToken) {
    return res
      .status(403)
      .json({ error: "Requisição inválida. CSRF token ausente ou inválido." });
  }

  next();
};
