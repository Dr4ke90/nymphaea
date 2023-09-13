import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./CustomButton.css";

export default function CustomButton(props) {
  return (
    <Link
      key={props.name}
      to={`/${props.name.toLowerCase()}`}
      className="custom-link"
    >
      <Button variant="contained" color="secondary" {...props}>
        {props.name}
      </Button>
    </Link>
  );
}
