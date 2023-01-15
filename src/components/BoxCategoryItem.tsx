import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Category from '../types/category'
import { ReactElement } from 'react'

interface Props {
  category: Category
  onDelete: () => unknown
  onChange: (name: string) => unknown
  disabled: boolean
}

const BoxCategoryItem = ({ category, onDelete, onChange, disabled }: Props): ReactElement => {
  return (
    <div className='box-item is-flex is-justify-content-space-between is-align-items-center'>
      <input
        className='input mr-4'
        type='text'
        defaultValue={category.name}
        onChange={(e) => onChange((e.target as HTMLInputElement).value.trim())}
        disabled={disabled}
      />
      <button
        type='button'
        className={`button is-danger ${disabled ? 'disabled' : ''}`}
        onClick={onDelete}
      >
        <span className='icon is-small'>
          <FontAwesomeIcon icon={faTrashCan} />
        </span>
      </button>
    </div>
  )
}

export default BoxCategoryItem
