import { withErrorHandling } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/suggestions`
  );
  const suggestions = await response.json();
  return NextResponse.json(suggestions);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { title, description, userId } = await req.json();
  if (!title || !description || !userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/suggestions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, userId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error || "Failed to create suggestion" },
      { status: response.status }
    );
  }

  const newSuggestion = await response.json();
  return NextResponse.json(newSuggestion, { status: 201 });
});
