import React from "react";
import { MessageSquare, User } from "lucide-react";
import Suggestion from "@/types/Suggestion";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onClick: (suggestion: Suggestion) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onClick,
}) => {
  const { title, createdAt, comments, user } = suggestion;
  const commentCount = comments.length;
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="w-full sm:w-1/2 p-4">
      <div
        className="min-w-[300px] h-[125px] p-4 rounded-lg space-y-3 bg-white cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200"
        onClick={() => onClick(suggestion)}
      >
        <div className="flex justify-between items-start space-x-2">
          <h4 className="text-lg font-bold truncate">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
        </div>
        <p className="text-sm flex items-center text-gray-700">
          <MessageSquare className="h-5 w-5 mr-1 text-gray-500" />
          {commentCount} comment{commentCount !== 1 ? "s" : ""}
        </p>
        <p className="text-sm flex items-center text-gray-700">
          <User className="h-5 w-5 mr-1 text-gray-500" />
          {user.firstName} {user.lastName}
        </p>
      </div>
    </div>
  );
};

export default SuggestionCard;
