import { singular } from 'pluralize'
import React, { ReactElement, FocusEvent } from 'react'
import Item from '../types/item'
import { STANDARD_INPUT_MAX_LENGTH } from './InputField'
import FirebaseService from '../services/firebase'

function changeName (potlukId: string, item: Item, event: FocusEvent<HTMLInputElement, Element>): void {
  const newName = event.target.value.trim()
  if (item.name === newName) return
  FirebaseService.changeItemNameInDatabase(potlukId, item, newName)
}

interface Props {
  isEditable: boolean
  potlukId: string
  categoryName: string
  item: Item
}

export default function ItemName ({ isEditable, potlukId, categoryName, item }: Props): ReactElement {
  if (isEditable) {
    return (
      <input
        className='input'
        type='text'
        placeholder={singular(categoryName)}
        defaultValue={item.name}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur()
          }
        }}
        onBlur={(e) => changeName(potlukId, item, e)}
        maxLength={STANDARD_INPUT_MAX_LENGTH}
      />
    )
  }

  return (
    <div className='mr-auto'>
      <p className='mb-0 has-text-weight-bold'>{item.name}</p>
      <p className='is-size-7'>
        {item.broughtBy === undefined
          ? 'Up for grabs'
          : `${item.broughtBy} is bringing`}
      </p>
    </div>
  )
}
