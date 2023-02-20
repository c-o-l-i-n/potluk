import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactElement } from 'react'
import Item from '../types/item'
import FirebaseService from '../services/firebase'

interface Props {
  isVisible: boolean
  potlukId: string
  item: Item
}

export default function DeleteItemButton ({ isVisible, potlukId, item }: Props): ReactElement {
  if (!isVisible) return <></>

  return (
    <button
      type='button'
      className='button is-danger ml-3'
      onClick={() => {
        FirebaseService.deleteItemFromDatabase(potlukId, item)
      }}
    >
      <span className='icon is-small'>
        <FontAwesomeIcon icon={faTrashCan} />
      </span>
    </button>
  )
}
