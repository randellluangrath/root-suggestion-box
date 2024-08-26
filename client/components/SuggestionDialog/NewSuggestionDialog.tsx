import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface NewSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddSuggestion: () => void;
}

const suggestionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type SuggestionFormData = z.infer<typeof suggestionSchema>;

const NewSuggestionDialog: React.FC<NewSuggestionDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddSuggestion,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
  });

  const { isSignedIn, user } = useAuth();

  const handleAddSuggestion = async (data: SuggestionFormData) => {
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        console.log("Suggestion created successfully");
        onAddSuggestion();
      } else {
        console.error("Failed to create suggestion");
      }
    } catch (error) {
      console.error("Error:", error);
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
          className={`bg-gray-100 rounded-lg shadow-lg w-3/5 max-w-none max-h-none p-4 flex flex-col transform transition-transform duration-300 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          <button
            onClick={() => onOpenChange(false)}
            className="self-end text-xl font-bold mb-2"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <h2 className="mb-4 text-xl font-bold">Create New Suggestion</h2>

          <form
            onSubmit={handleSubmit(handleAddSuggestion)}
            className="flex flex-col gap-4"
          >
            <label className="font-semibold">Title</label>
            <Input
              type="text"
              {...register("title")}
              className="p-2 border border-gray-500 rounded-md bg-white"
              placeholder="Title"
              disabled={!isSignedIn}
            />
            {errors.title && (
              <span className="text-red-500">{errors.title.message}</span>
            )}

            <label className="font-semibold">Description</label>
            <Input
              type="text"
              {...register("description")}
              className="p-2 border border-gray-500 rounded-md bg-white"
              placeholder="Description"
              disabled={!isSignedIn}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}

            <Button type="submit" disabled={!isSignedIn}>
              Create
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSuggestionDialog;
