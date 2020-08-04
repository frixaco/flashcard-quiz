import React from "react";
import "./Flashcard.css";

export interface FlashcardType {
  id: number;
  question: string;
  answer: string;
  options: Array<string>;
}

interface FlashcardProps {
  flashcard: FlashcardType;
}

export function Flashcard({ flashcard }: FlashcardProps) {
  const [flip, setFlip] = React.useState<boolean>(false);
  const [height, setHeight] = React.useState<string | number>("initial");

  const handleClick = () => {
    setFlip(!flip);
  };

  const frontEl = React.useRef<HTMLDivElement>(null);
  const backEl = React.useRef<HTMLDivElement>(null);

  const setMaxHeight = () => {
    const frontHeight: any = frontEl.current?.getBoundingClientRect().height;
    const backHeight: any = backEl.current?.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
  };

  React.useEffect(setMaxHeight, [
    flashcard.question,
    flashcard.answer,
    flashcard.options,
  ]);
  React.useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);
  return (
    <div
      onClick={handleClick}
      style={{ height: height }}
      className={`card ${flip ? "flip" : ""}`}
    >
      <div className="front" ref={frontEl}>
        {flashcard.question}
        <div className="flashcard-options">
          {flashcard.options.map((option) => (
            <div key={option} className="flashcard-option">
              {option}
            </div>
          ))}
        </div>
      </div>
      <div className="back" ref={backEl}>
        {flashcard.answer}
      </div>
    </div>
  );
}
