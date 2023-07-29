import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { ReactElement } from 'react'

interface Props {
  onClick: () => void
  disabled?: boolean
}

export default function AddButton ({ onClick, disabled = false }: Props): ReactElement {
  return (
    <div className='box-row is-flex is-justify-content-center is-align-items-center'>
      <button
        aria-label='add'
        type='button'
        className='button is-medium is-ghost'
        disabled={disabled}
        onClick={onClick}
      >
        <span className='icon is-medium'>
          <FontAwesomeIcon
            icon={faPlusCircle}
            className='has-text-grey fa-2x'
          />
        </span>
      </button>
    </div>
  )
}
