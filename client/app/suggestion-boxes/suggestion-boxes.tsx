"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SuggestionCard from "@/components/SuggestionCard/SuggestionCard";
import ViewSuggestionDialog from "@/components/SuggestionDialog/ViewSuggestionDialog";
import NewSuggestionDialog from "@/components/SuggestionDialog/NewSuggestionDialog";
import Suggestion from "@/types/Suggestion";
import { useAuth } from "@/contexts/AuthContext";
import io, { Socket } from "socket.io-client";
import { EVENTS } from "@/types/Events";

interface SuggestionBoxesProps {
  initialSuggestions: Suggestion[];
}

const SuggestionBoxes: React.FC<SuggestionBoxesProps> = ({
  initialSuggestions,
}) => {
  const { isLoggedIn } = useAuth();
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(initialSuggestions);
  const [isViewSuggestionsDialogOpen, setIsViewSuggestionsDialogOpen] =
    useState(false);
  const [isNewSuggestionsDialogOpen, setIsNewSuggestionsDialogOpen] =
    useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/suggestions");
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        console.error("Failed to fetch suggestions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Setup WebSocket connection
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsSocketConnected(true);
      });

      socket.on("disconnect", () => {
        setIsSocketConnected(false);
      });

      // Listen for new suggestions from the server
      socket.on(EVENTS.SUGGESTION_CREATED, (newSuggestion: Suggestion) => {
        setSuggestions((prevSuggestions) => {
          const isDuplicate = prevSuggestions.some(
            (suggestion) => suggestion.id === newSuggestion.id
          );

          if (isDuplicate) {
            return prevSuggestions;
          }

          return [...prevSuggestions, newSuggestion];
        });
      });

      // Cleanup the WebSocket connection on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, setSuggestions]);

  const openDialog = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsViewSuggestionsDialogOpen(true);
  };

  const closeViewSuggestionDialog = async () => {
    setIsViewSuggestionsDialogOpen(false);
    await fetchSuggestions();
  };

  const closeNewSuggestionDialogAndRefresh = async () => {
    setIsNewSuggestionsDialogOpen(false);
    await fetchSuggestions();
  };

  const toggleSocketConnection = () => {
    if (socket) {
      if (socket.connected) {
        socket.disconnect();
      } else {
        socket.connect();
      }
    } else {
      const socketInstance = io(process.env.NEXT_PUBLIC_BASE_API_URL!);
      setSocket(socketInstance);
    }
  };

  return (
    <main className="bg-black min-h-screen">
      <section className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white">#SuggestionBoxes</h1>
      </section>

      <section className="mx-auto max-w-7xl mt-2 p-6 bg-gray-100 rounded-t-lg md:rounded-t-lg md:rounded-b-none lg:rounded-lg relative gap-4">
        {isLoggedIn && (
          <div className="flex justify-end p-4">
            <Button
              className="text-white px-4 py-2 rounded"
              onClick={() => setIsNewSuggestionsDialogOpen(true)}
            >
              Start a Suggestion Box
            </Button>
            <Button
              className="text-white px-4 py-2 rounded ml-2"
              onClick={toggleSocketConnection}
            >
              {isSocketConnected ? "Disconnect Socket" : "Connect Socket"}
            </Button>
          </div>
        )}
        <div className="flex flex-wrap">
          {suggestions
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((s: Suggestion) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onClick={() => openDialog(s)}
              />
            ))}
        </div>
      </section>

      {isViewSuggestionsDialogOpen && selectedSuggestion && (
        <ViewSuggestionDialog
          suggestion={selectedSuggestion}
          isOpen={isViewSuggestionsDialogOpen}
          onOpenChange={closeViewSuggestionDialog}
          onAddComment={closeViewSuggestionDialog}
        />
      )}

      {isNewSuggestionsDialogOpen && (
        <NewSuggestionDialog
          isOpen={isNewSuggestionsDialogOpen}
          onOpenChange={setIsNewSuggestionsDialogOpen}
          onAddSuggestion={closeNewSuggestionDialogAndRefresh}
        />
      )}
    </main>
  );
};

export default SuggestionBoxes;
