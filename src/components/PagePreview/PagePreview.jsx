import React from "react";
import './PagePreview.css'

export default function PagePreview(props) {
  return <div {...props}>{props.children}</div>;
}
