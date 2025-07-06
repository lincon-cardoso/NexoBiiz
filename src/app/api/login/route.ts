import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { errorMessages } from "@/constants/errorMessages";
import { csrfValidator } from "@/middleware/csrfValidator";
import { loginRateLimiter } from "@/middleware/rateLimiter";

const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  // Aplicar middlewares
  loginRateLimiter(req, res, () => {});
  csrfValidator(req, res, () => {});

  try {
    const data = await req.body;
    const { email, password } = loginSchema.parse(data);

    const user = await prisma.user.findUnique({ where: { email } });
    const storedHash = user
      ? user.password
      : await argon2.hash("invalid-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: errorMessages.INVALID_CREDENTIALS });
    }

    const isValid = await argon2.verify(storedHash, password);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: errorMessages.INCORRECT_PASSWORD });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`,
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
    ]);

    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; object-src 'none'"
    );
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.status(200).json({
      message: errorMessages.LOGIN_SUCCESS,
      accessToken,
      user: { id: user.id },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: errorMessages.LOGIN_FAILED, errors: error.errors });
    }
    console.error("Erro no login:", error);
    return res
      .status(500)
      .json({ message: errorMessages.AUTHENTICATION_ERROR });
  }
}
