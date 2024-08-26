import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Suggestion from "@/types/Suggestion";
import { useAuth } from "@/contexts/AuthContext";

interface ViewSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  suggestion: Suggestion;
  onAddComment: () => void;
}

const commentSchema = z.object({
  newComment: z.string().optional(),
});

type CommentFormData = z.infer<typeof commentSchema>;

const ViewSuggestionDialog: React.FC<ViewSuggestionDialogProps> = ({
  isOpen,
  onOpenChange,
  suggestion,
  onAddComment,
}) => {
  const { register, handleSubmit } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const { isSignedIn, user } = useAuth();

  const handleAddComment = async (data: CommentFormData) => {
    if (suggestion && data.newComment) {
      try {
        const response = await fetch(
          `/api/suggestions/${suggestion.id}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              suggestionId: suggestion.id,
              comment: data.newComment,
              userId: user?.id,
            }),
          }
        );

        if (response.ok) {
          onAddComment();
        } else {
          console.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={() => onOpenChange(false)}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={`bg-gray-100 rounded-lg shadow-lg w-3/5 h-4/5 max-w-none max-h-none p-4 flex flex-col transform transition-transform duration-300 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          <button
            onClick={() => onOpenChange(false)}
            className="self-end text-xl font-bold mb-2"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <h2 className="mx-2 mb-1 text-xl font-bold">{suggestion.title}</h2>
          <h3 className="mx-2 mb-4 text-gray-500">{suggestion.description}</h3>

          <div className="space-y-4 overflow-y-auto flex-grow border border-gray-300 rounded-md p-4 bg-white">
            {suggestion.comments
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((comment, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex gap-1">
                    <span className="font-bold text-sm">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.body}</p>
                </div>
              ))}
          </div>

          <form
            onSubmit={handleSubmit(handleAddComment)}
            className="flex items-center mt-4 relative gap-2"
          >
            <Input
              type="text"
              {...register("newComment")}
              className="flex-grow p-2 border border-gray-500 rounded-md bg-white"
              placeholder="Add a comment..."
              disabled={!isSignedIn}
            />
            <Button type="submit" disabled={!isSignedIn}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewSuggestionDialog;
