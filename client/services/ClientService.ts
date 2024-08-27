export const fetchSuggestions = async () => {
  try {
    const response = await fetch("/api/suggestions");
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch suggestions");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const signIn = async (userId: number) => {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign in");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addSuggestion = async (
  title: string,
  description: string,
  userId: number
) => {
  try {
    const response = await fetch("/api/suggestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        userId: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create suggestion");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addComment = async (
  suggestionId: number,
  comment: string,
  userId: number
) => {
  try {
    const response = await fetch(`/api/suggestions/${suggestionId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        suggestionId: suggestionId,
        comment: comment,
        userId: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
