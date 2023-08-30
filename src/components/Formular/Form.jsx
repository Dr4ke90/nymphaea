import React from 'react'
import "./form.css"

export default function Form(props) {
  return (
    <form {...props}>{props.children}</form>
  )
}
