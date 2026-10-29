
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function requireAdmin(
  request: Request
): Promise<NextResponse | null> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        message: "Authentication required.",
      },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      {
        ok: false,
        message: "Administrator access required.",
      },
      { status: 403 }
    );
  }

  return null;
}
