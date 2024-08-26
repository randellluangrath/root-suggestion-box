import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/utils";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const { suggestionId, comment, userId } = await req.json();
  if (!suggestionId || !comment || !userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/suggestions/${suggestionId}/comments`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment, userId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error || "Failed to add comment" },
      { status: response.status }
    );
  }

  const responseData = await response.json();
  return NextResponse.json(
    { message: responseData.message || "Comment added successfully" },
    { status: 201 }
  );
});
