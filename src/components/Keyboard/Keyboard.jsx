import React from "react";
import KeyboardButton from "../KeyboardButton/KeybordButton";
import "./keyboard.css";

export default function Keyboard({ setInput, reset }) {
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ".", "C"];

  return (
    <div className="keyboard">
      {buttons.map((button) => (
        <KeyboardButton
          className="num"
          value={button}
          key={button}
          setInput={setInput}
          reset={reset}
        />
      ))}
    </div>
  );
}
