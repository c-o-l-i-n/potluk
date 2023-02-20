import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'

interface Props {
  onClick: () => void
  text: string
  icon: IconDefinition
}

export default function BottomButton ({ onClick, text, icon }: Props): ReactElement {
  return (
    <button
      type='button'
      className='button is-primary'
      onClick={onClick}
    >
      <span>{text}</span>
      <span className='icon'>
        <FontAwesomeIcon icon={icon} />
      </span>
    </button>
  )
}
