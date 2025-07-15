import { NextRequest, NextResponse } from "next/server";

export function csrfValidator(req: NextRequest) {
  const csrfTokenFromCookie = req.cookies.get("csrfToken")?.value;
  const csrfTokenFromHeader = req.headers.get("x-csrf-token");

  console.log("CSRF Token from Cookie:", csrfTokenFromCookie);
  console.log("CSRF Token from Header:", csrfTokenFromHeader);

  if (
    !csrfTokenFromCookie ||
    !csrfTokenFromHeader ||
    csrfTokenFromCookie !== csrfTokenFromHeader
  ) {
    console.error("CSRF validation failed.");
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const mfaHeader = req.headers.get("x-mfa-code");
  if (!mfaHeader) {
    console.error("MFA code não fornecido.");
    return NextResponse.json(
      { error: "MFA code obrigatório" },
      { status: 403 }
    );
  }

  console.log("CSRF and MFA validation passed.");
  return NextResponse.next();
}
