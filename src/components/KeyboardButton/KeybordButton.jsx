import React from "react";
import "./keyboardButton.css"
import { Button } from "@mui/material";

function KeyboardButton(props) {
  return (
    <Button
      variant="outlined"
      color="info"
      className={props.className}
    >
      {props.value}
    </Button>
  );
}

export default KeyboardButton;
