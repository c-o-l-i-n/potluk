import { ReactElement } from 'react'

interface Props {
  onClick: () => unknown
  isLoading: boolean
  disabled: boolean
}

export default function CreateButton ({ onClick, isLoading, disabled }: Props): ReactElement {
  return (
    <button
      type='button'
      disabled={disabled}
      className={`button is-primary is-size-4 is-large has-text-weight-bold mt-3 ${isLoading ? 'is-loading' : ''}`}
      onClick={onClick}
    >
      Create
    </button>
  )
}
