import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Token ausente." }, { status: 401 });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }
}
