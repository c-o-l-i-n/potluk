import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import Item from '../types/item'
import { ReactElement, useEffect, useState } from 'react'

interface Props {
  initialItem: Item
  onChangeItemName: (item: Item, name: string) => unknown
  onBringOrUnbring: (item: Item, bring: boolean) => unknown
  onDelete: (item: Item) => unknown
  username: string
}

export default function BoxItem ({
  initialItem,
  onChangeItemName,
  onBringOrUnbring,
  onDelete,
  username
}: Props): ReactElement {
  const [item, setItem] = useState(initialItem)

  useEffect(() => {
    setItem(initialItem)
  }, [initialItem])

  return (
    <div className='box-item is-flex is-justify-content-space-between is-align-items-center'>
      <span
        className={`icon is-size-4 mr-4 ${item.broughtBy === undefined ? 'has-text-grey' : 'has-text-primary'}`}
      >
        <FontAwesomeIcon icon={item.broughtBy === undefined ? faCircle : faCheckCircle} />
      </span>
      {username !== '' && username === item.createdBy && item.broughtBy === undefined
        ? (
          <input
            className='input'
            type='text'
            defaultValue={item.name}
            onBlur={(e) => onChangeItemName(item, (e.target as HTMLInputElement).value.trim())}
          />
          )
        : (
          <div className='mr-auto'>
            <p className='mb-0 has-text-weight-bold'>{item.name}</p>
            {item.broughtBy !== undefined
              ? (
                <p className='is-size-7'>{item.broughtBy} is bringing</p>
                )
              : (
                <></>
                )}
          </div>
          )}

      {username !== ''
        ? (
          <>
            {item.broughtBy === undefined
              ? (
                <button
                  type='button'
                  className='button is-dark is-size-7 ml-3 has-text-weight-bold'
                  onClick={() => item.name !== '' && onBringOrUnbring(item, true)}
                >
                  Bring
                </button>
                )
              : (
                <>
                  {username === item.broughtBy
                    ? (
                      <button
                        type='button'
                        className='button is-dark is-size-7 ml-3 has-text-weight-bold'
                        onClick={() => onBringOrUnbring(item, false)}
                      >
                        Unbring
                      </button>
                      )
                    : (
                      <></>
                      )}
                </>
                )}
          </>
          )
        : (
          <></>
          )}
      {username === item.createdBy && item.broughtBy === undefined
        ? (
          <button
            type='button'
            className='button is-danger ml-3'
            onClick={() => {
              onDelete(item)
            }}
          >
            <span className='icon is-small'>
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
          </button>
          )
        : (
          <></>
          )}
    </div>
  )
}
