import React from "react";
import { Flashcard, FlashcardType } from "../Flashcard";
import "./FlashcardList.css";

type FlashcardListProps = {
  flashcards: Array<FlashcardType>;
};

export const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards }) => {
  return (
    <div className="card-grid">
      {flashcards.map((flashcard, i) => (
        <Flashcard key={i} flashcard={flashcard} />
      ))}
    </div>
  );
};
