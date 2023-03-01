import { ValidationError } from '@formspree/react'
import React, { HTMLInputTypeAttribute, ReactElement } from 'react'

interface Props {
  state: {
    submitting: boolean
    succeeded: boolean
    errors: unknown[]
  }
  name: string
  placeholder?: string
  type?: HTMLInputTypeAttribute
  isTextArea?: boolean
  required?: boolean
}

export default function FormspreeField ({
  state,
  name,
  placeholder = name,
  type = 'text',
  isTextArea = false,
  required = false
}: Props): ReactElement {
  const htmlName = name.toLowerCase().replace(/ /g, '-')

  const inputElement = isTextArea
    ? (
      <textarea
        className='textarea'
        name={htmlName}
        placeholder={placeholder}
        disabled={state.submitting}
        required={required}
      />
      )
    : (
      <input
        className='input'
        type={type}
        name={htmlName}
        placeholder={placeholder}
        disabled={state.submitting}
        required={required}
      />
      )

  return (
    <div className='field mb-5'>
      <label className='label' htmlFor={htmlName}>
        {name} {required ? '' : '(Optional)'}
      </label>
      <div className='control'>
        {inputElement}
        <ValidationError
          field={name}
          prefix='🤨 This'
          errors={state.errors}
          className='has-text-danger'
        />
      </div>
    </div>
  )
}
