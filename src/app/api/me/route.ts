import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("accessToken");
  const token = accessTokenCookie ? accessTokenCookie.value : "";

  if (!token) {
    return NextResponse.json({ message: "Token ausente." }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    return NextResponse.json({ user: payload });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
}
