import React from 'react'
import PagePreview from '../PagePreview/PagePreview'
import KeyboardButton from '../KeyboardButton/KeybordButton'
import "./keyboard.css"

export default function Keyboard () {
    const buttons = [1,2,3,4,5,6,7,8,9,0,"00","."]

  return (
    <PagePreview className="keyboard">
        {buttons.map((button) => (
          <KeyboardButton className='num' value={button} key={button}/>
        ))}
    </PagePreview>
  )
}
