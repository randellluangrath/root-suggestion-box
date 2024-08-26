import Suggestion from "@/types/Suggestion";
import SuggestionBoxes from "./suggestion-boxes";
import LoadingIndicator from "@/components/LoadingIndicator/LoadingIndicator";
import { Suspense } from "react";

const fetchSuggestions = async (): Promise<Suggestion[]> => {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/suggestions`
    );
    url.searchParams.append("timestamp", Date.now().toString());
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: Suggestion[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return [];
  }
};

const SuggestionsLoader: React.FC = async () => {
  const suggestions = await fetchSuggestions();
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  return <SuggestionBoxes initialSuggestions={suggestions} />;
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <SuggestionsLoader />
    </Suspense>
  );
};

export default Page;
