import React from "react";
import "./keyboardButton.css";
import { Button } from "@mui/material";

function KeyboardButton(props) {
  return (
    <Button
      variant="outlined"
      color="info"
      className={props.className}
      onClick={
        props.value !== "C"
          ? () => props.setInput(props.value)
          : () => props.reset()
      }
    >
      {props.value}
    </Button>
  );
}

export default KeyboardButton;
