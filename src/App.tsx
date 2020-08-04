import React, { FormEvent } from "react";
import { FlashcardList } from "./components/FlashcardList";
import Axios from "axios";
import { FlashcardType } from "./components/Flashcard";
import Spinner from "./components/Spinner";

function App() {
  const [flashcards, setFlashcards] = React.useState<Array<FlashcardType>>([]);
  const [categories, setCategories] = React.useState<Array<CategoryType>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  function decodeString(str: string) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  }

  React.useEffect(() => {
    Axios.get("https://opentdb.com/api_category.php").then((res) =>
      setCategories(res.data.trivia_categories)
    );
  }, []);

  const categoryEl = React.useRef<HTMLSelectElement>(null);
  const amountEl = React.useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    Axios.get(
      "https://opentdb.com/api.php?amount=10&category=31&difficulty=medium",
      {
        params: {
          amount: amountEl.current?.value,
          category: categoryEl.current?.value,
        },
      }
    ).then((res) => {
      setFlashcards(
        res.data.results.map((questionItem: QuestionItemType, id: number) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [
            ...questionItem.incorrect_answers.map((a) => decodeString(a)),
            answer,
          ];
          return {
            id: `${id}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer,
            options: options.sort(() => Math.random() - 0.5),
          };
        })
      );
      setLoading(false);
    });
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select ref={categoryEl} id="category">
            {categories?.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amoung">Number of questions</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountEl}
          />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        {loading ? <Spinner /> : <FlashcardList flashcards={flashcards} />}
      </div>
    </>
  );
}

type CategoryType = { id: number; name: string };

export interface QuestionItemType {
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
}

export default App;
