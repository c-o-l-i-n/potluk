import React, { ReactElement } from 'react'

interface Props {
  text: string
}

export default function BoxHeader ({ text }: Props): ReactElement {
  return (
    <div className='box-item is-size-5 has-text-centered has-text-weight-bold'>
      {text}
    </div>
  )
}
