import React, { ReactElement } from 'react'
import Item from '../types/item'
import FirebaseService from '../services/firebase'

interface Props {
  potlukId: string
  item: Item
  username: string
  shouldShowBringButton: boolean
  shouldShowUnBringButton: boolean
}

export default function BringOrUnbringButton ({ potlukId, item, username, shouldShowBringButton, shouldShowUnBringButton }: Props): ReactElement {
  if (shouldShowBringButton) {
    return (
      <button
        type='button'
        className='button is-dark is-size-7 ml-3 has-text-weight-bold'
        onClick={() => item.name !== '' && FirebaseService.bringOrUnbringItemInDatabase(potlukId, item, username, true)}
      >
        Bring
      </button>
    )
  }

  if (shouldShowUnBringButton) {
    return (
      <button
        type='button'
        className='button is-warning is-size-7 ml-3 has-text-weight-bold'
        onClick={() => FirebaseService.bringOrUnbringItemInDatabase(potlukId, item, username, false)}
      >
        Unbring
      </button>
    )
  }

  return <></>
}
