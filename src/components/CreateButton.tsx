import { ReactElement } from 'react'

interface Props {
  onClick: Function
  isLoading: boolean
  disabled: boolean
}

export default function CreateButton ({ onClick, isLoading, disabled }: Props): ReactElement {
  return (
    <button
      type='button'
      className={`button is-primary is-size-4 is-large has-text-weight-bold mt-3 ${
        isLoading || disabled ? 'disabled' : ''
      } ${isLoading ? 'is-loading' : ''}`}
      onClick={() => onClick()}
    >
      Create
    </button>
  )
}
