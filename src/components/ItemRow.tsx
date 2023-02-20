import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import Item from '../types/item'
import { ReactElement, useEffect, useState } from 'react'
import ItemName from './ItemName'
import BringOrUnbringButton from './BringOrUnbringButton'
import DeleteItemButton from './DeleteItemButton'

function itemWasCreatedByUser (item: Item, username: string): boolean {
  return username.toLocaleLowerCase() === item.createdBy.toLocaleLowerCase()
}

function itemWasBroughtByUser (item: Item, username: string): boolean {
  return username.toLocaleLowerCase() === item.broughtBy?.toLocaleLowerCase()
}

interface Props {
  potlukId: string
  categoryName: string
  initialItem: Item
  username: string
  online: boolean
}

export default function ItemRow ({ potlukId, categoryName, initialItem, username, online }: Props): ReactElement {
  const [item, setItem] = useState(initialItem)

  useEffect(() => {
    setItem(initialItem)
  }, [initialItem])

  if (item.name === '' && !itemWasCreatedByUser(item, username)) return <></>

  return (
    <div className='box-row is-flex is-justify-content-space-between is-align-items-center'>

      {/* Check Icon */}
      <span
        className={`icon is-size-4 mr-4 ${item.broughtBy === undefined ? 'has-text-grey' : 'has-text-primary'}`}
      >
        <FontAwesomeIcon icon={item.broughtBy === undefined ? faCircle : faCheckCircle} />
      </span>

      <ItemName
        isEditable={online && itemWasCreatedByUser(item, username) && item.broughtBy === undefined}
        potlukId={potlukId}
        categoryName={categoryName}
        item={item}
      />

      <BringOrUnbringButton
        shouldShowBringButton={online && username !== '' && item.broughtBy === undefined}
        shouldShowUnBringButton={online && itemWasBroughtByUser(item, username)}
        potlukId={potlukId}
        item={item}
        username={username}
      />

      <DeleteItemButton
        isVisible={online && itemWasCreatedByUser(item, username) && item.broughtBy === undefined}
        potlukId={potlukId}
        item={item}
      />
    </div>
  )
}
