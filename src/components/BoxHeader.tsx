import React, { ReactElement } from 'react'

interface Props {
  title: string
  subtitle?: string
}

export default function BoxHeader ({ title, subtitle }: Props): ReactElement {
  return (
    <div className='box-row has-text-centered'>
      <p className='is-size-5 has-text-weight-bold mb-0'>{title}</p>
      {subtitle === undefined ? <></> : <p className='has-text-grey'>{subtitle}</p>}
    </div>
  )
}
