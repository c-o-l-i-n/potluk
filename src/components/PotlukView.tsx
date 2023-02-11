import Head from 'next/head'
import Potluk from '../types/potluk'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faList,
  faQrcode
} from '@fortawesome/free-solid-svg-icons'
import copy from 'copy-to-clipboard'
import Box from './Box'
import BoxItem from './BoxItem'
import Item from '../types/item'
import AddItemButton from './AddItemButton'
import BoxHeader from './BoxHeader'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import InputField from './InputField'
import {
  addItemToDatabase,
  bringOrUnbringItemInDatabase,
  changeItemNameInDatabase,
  deleteItemFromDatabase,
  subscribeToUpdates
} from '../firebase/firebase'
import ItemEvent from '../types/itemEvent'
import QrCode from './QrCode'
import { toast, Toaster } from 'react-hot-toast'

interface Props {
  initialPotluk: Potluk
  initialUsername: string
}

export default function PotlukView ({ initialPotluk, initialUsername }: Props): ReactElement {
  const [potluk, setPotluk] = useState<Potluk>(initialPotluk)
  const [username, setUsername] = useState(initialUsername)
  const [loginFieldValue, setLoginFieldValue] = useState('')
  const [showingQrCode, setShowingQrCode] = useState(false)
  const [online, setOnline] = useState(true)
  const onlineRef = useRef(true)
  const inOfflineGracePeriod = useRef(false)
  const initiallyConnected = useRef(false)

  // get realtime updates
  useEffect(() =>
    subscribeToUpdates(
      initialPotluk.id,
      potluk.categories.length,
      onAddEvent,
      onChangeEvent,
      onDeleteEvent,
      onConnectedStatusChange
    ), []
  )

  // disable controls and show toast if user goes offline
  // allow for 200 ms "grace priod" to avoid simultaneous on and offline toasts when switching back to the browswer
  function onConnectedStatusChange (connected: boolean): void {
    onlineRef.current = connected

    if (!initiallyConnected.current || inOfflineGracePeriod.current) {
      initiallyConnected.current = true
      return
    }

    if (connected) {
      toast.success("You're back online!")
      setOnline(true)
    } else {
      inOfflineGracePeriod.current = true
      setTimeout(() => {
        inOfflineGracePeriod.current = false

        // if still offline after the 200 ms grace period, change state and show toast
        if (!onlineRef.current) {
          toast.error("You're offline")
          setOnline(false)
        }
      }, 200)
    }
  }

  function addItem (categoryIndex: number): void {
    addItemToDatabase(potluk.id, new Item({ createdBy: username, categoryIndex }))
  }

  function onAddEvent (addEvent: ItemEvent): void {
    const category = potluk.categories[addEvent.categoryIndex]

    const item = Item.createFromDatabaseEntry(addEvent.itemId, addEvent.categoryIndex, addEvent.itemDatabaseEntry)
    console.log('Add Item', item)

    category.items[item.id] = item

    // set state so UI reacts
    setPotluk(potluk.copy())
  }

  function deleteItem (item: Item): void {
    deleteItemFromDatabase(potluk.id, item)
  }

  function onDeleteEvent (deleteEvent: ItemEvent): void {
    const items = potluk.categories[deleteEvent.categoryIndex].items

    console.log('Delete Item', items[deleteEvent.itemId])
    // eslint-disable-next-line
    delete items[deleteEvent.itemId]

    // set state so UI reacts
    setPotluk(potluk.copy())
  }

  function bringOrUnbringItem (item: Item, bring: boolean): void {
    bringOrUnbringItemInDatabase(potluk.id, item, username, bring)
  }

  function changeItemName (item: Item, name: string): void {
    if (item.name === name) return
    changeItemNameInDatabase(potluk.id, item, name)
  }

  function onChangeEvent (changeEvent: ItemEvent): void {
    const item = Item.createFromDatabaseEntry(changeEvent.itemId, changeEvent.categoryIndex, changeEvent.itemDatabaseEntry)
    potluk.categories[changeEvent.categoryIndex].items[changeEvent.itemId] = item
    console.log('Change Item', item)
    setPotluk(potluk.copy())
  }

  function deleteBlankItemsCreatedByCurrentUser (): void {
    potluk.categories.forEach(category =>
      Object.values(category.items).forEach(item =>
        item.name === '' && item.createdBy === username && deleteItem(item)))
  }

  interface ShareData {
    title?: string
    url?: string
    text?: string
  }

  function share (data: ShareData): void {
    if (typeof navigator.canShare !== 'function' || !navigator.canShare(data)) {
      const text = data.text ?? data.url ?? 'Error'
      copy(text)
      alert('✅ Copied to clipboard')
      return
    }
    void navigator.share(data)
  }

  function shareLink (): void {
    share({
      title: potluk.name,
      url: window.location.href
    })
  }

  function shareList (): void {
    share({
      text: generateListString(potluk)
    })
  }

  function generateListString (potluk: Potluk): string {
    let text = `👉 ${potluk.name}\n📆 ${customDateString(
      potluk.date
    )}\n🔗 ${window.location.href.split('://').at(-1) ?? 'Link Unavailable'}\n`

    for (const category of potluk.categories) {
      text += '\n' + category.name.toUpperCase() + '\n'

      const items = Object.values(category.items)

      if (items.length === 0) {
        text += '(nothing yet)\n'
        continue
      }

      for (const item of items) {
        text += item.broughtBy === undefined ? '🔲 ' : '✅ '
        text += item.name + ` (${item.broughtBy ?? 'up for grabs'})\n`
      }
    }
    return text
  }

  function login (): void {
    if (loginFieldValue.trim() !== '') {
      setUsername(loginFieldValue.trim())
    }
  }

  function logout (): void {
    deleteBlankItemsCreatedByCurrentUser()
    setUsername('')
    setLoginFieldValue('')
  }

  function customDateString (date: Date): string {
    const correctedDate = new Date(new Date(date).toISOString().slice(0, -1))
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return correctedDate.toLocaleDateString('en-US', options)
  }

  return (
    <>
      <Head>
        <title>{potluk.name}</title>
      </Head>

      {
        showingQrCode &&
          <QrCode
            url={window.location.href}
            bottomText={potluk.name}
            onClick={() => setShowingQrCode(false)}
          />
      }

      <h2 className='mb-1'>{potluk.name}</h2>
      <p className='is-uppercase has-text-grey has-text-weight-bold'>
        {customDateString(potluk.date)}
      </p>
      {online
        ? (
          <div className='is-flex is-flex-direction-row-reverse is-justify-content-space-between is-align-items-center mb-5 w-100'>
            {username !== ''
              ? (
                <>
                  <button
                    type='button'
                    className='button is-primary ml-3'
                    onClick={logout}
                  >
                    Log Out
                  </button>
                  <p className='mb-0'>
                    Logged in as: <strong>{username}</strong>
                  </p>
                </>
                )
              : (
                <>
                  <button
                    type='button'
                    className='button is-primary ml-3 is-align-self-flex-end'
                    onClick={login}
                  >
                    Log In
                  </button>
                  <InputField
                    type='text'
                    placeholder='Enter your name to edit'
                    onChange={setLoginFieldValue}
                    onEnterKeyPressed={login}
                    swapBold
                  />
                </>
                )}
          </div>)
        : <></>}

      {potluk.categories.map((category, categoryIndex) => (
        <Box key={categoryIndex}>
          <BoxHeader title={category.name} />
          {Object.values(category.items).find(i => i.name !== '' || i.createdBy === username) === undefined
            ? (
              <p className='has-text-grey has-text-centered is-italic mb-0 mt-3'>
                {username === '' ? <>Nothing yet!<br />Log in to add an item</> : <>Tap the <strong>+</strong> button to add an item</>}
              </p>
              )
            : Object.values(category.items).map(item => (
              item.name === '' && item.createdBy !== username
                ? <React.Fragment key={item.id} />
                : (
                  <BoxItem
                    key={item.id}
                    categoryName={category.name}
                    initialItem={item}
                    onChangeItemName={changeItemName}
                    onBringOrUnbring={bringOrUnbringItem}
                    onDelete={deleteItem}
                    username={online ? username : ''}
                  />
                  )
            ))}
          {online && username !== ''
            ? (
              <AddItemButton onClick={() => addItem(categoryIndex)} />
              )
            : (
              <></>
              )}
        </Box>
      ))}

      <div className='buttons is-flex is-justify-content-center mt-6 mb-0'>
        <button
          type='button'
          className='button is-primary'
          onClick={shareList}
        >
          <span>Share List</span>
          <span className='icon'>
            <FontAwesomeIcon icon={faList} />
          </span>
        </button>
        <button
          type='button'
          className='button is-primary'
          onClick={shareLink}
        >
          <span>Share Link</span>
          <span className='icon'>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </span>
        </button>
        <button
          type='button'
          className='button is-primary'
          onClick={() => setShowingQrCode(true)}
        >
          <span>QR Code</span>
          <span className='icon'>
            <FontAwesomeIcon icon={faQrcode} />
          </span>
        </button>
      </div>

      <Toaster />
    </>
  )
}
