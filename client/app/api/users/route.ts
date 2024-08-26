import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/utils";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { error: "Missing required field: id" },
      { status: 400 }
    );
  }

  const signInResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/users/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );

  console.log();

  if (!signInResponse.ok) {
    const errorData = await signInResponse.json();
    return NextResponse.json(
      { error: errorData.error || "Failed to sign in user" },
      { status: signInResponse.status }
    );
  }

  const { token, user } = await signInResponse.json();

  return NextResponse.json({ user, token }, { status: 200 });
});
