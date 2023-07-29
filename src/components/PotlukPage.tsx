import Head from 'next/head'
import Potluk from '../types/potluk'
import Item from '../types/item'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import FirebaseService from '../services/firebase'
import ItemEvent from '../types/itemEvent'
import { toast, Toaster } from 'react-hot-toast'
import ShareListButton from './ShareListButton'
import QrCodeButton from './QrCodeButton'
import ShareLinkButton from './ShareLinkButton'
import LoginForm from './LoginForm'
import CategoryBox from './CategoryBox'

interface Props {
  initialPotluk: Potluk
  initialUsername: string
}

export default function PotlukPage ({ initialPotluk, initialUsername }: Props): ReactElement {
  const [potluk, setPotluk] = useState<Potluk>(initialPotluk)
  const [username, setUsername] = useState(initialUsername)
  const [online, setOnline] = useState(true)
  const onlineRef = useRef(true)
  const inOfflineGracePeriod = useRef(false)
  const initiallyConnected = useRef(false)

  // get realtime updates
  useEffect(() =>
    FirebaseService.subscribeToUpdates(
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

  function onAddEvent (addEvent: ItemEvent): void {
    const category = potluk.categories[addEvent.categoryIndex]

    const item = Item.createFromDatabaseEntry(addEvent.itemId, addEvent.categoryIndex, addEvent.itemDatabaseEntry)
    console.log('Add Item', item)

    category.items[item.id] = item

    // set state so UI reacts
    setPotluk(potluk.copy())
  }

  function onChangeEvent (changeEvent: ItemEvent): void {
    const item = Item.createFromDatabaseEntry(changeEvent.itemId, changeEvent.categoryIndex, changeEvent.itemDatabaseEntry)
    potluk.categories[changeEvent.categoryIndex].items[changeEvent.itemId] = item
    console.log('Change Item', item)
    setPotluk(potluk.copy())
  }

  function onDeleteEvent (deleteEvent: ItemEvent): void {
    const items = potluk.categories[deleteEvent.categoryIndex].items

    console.log('Delete Item', items[deleteEvent.itemId])
    // eslint-disable-next-line
    delete items[deleteEvent.itemId]

    // set state so UI reacts
    setPotluk(potluk.copy())
  }

  function deleteBlankItemsCreatedByCurrentUser (): void {
    potluk.categories.forEach(category =>
      Object.values(category.items).forEach(item =>
        item.name === '' && item.createdBy === username &&
        FirebaseService.deleteItemFromDatabase(potluk.id, item)
      )
    )
  }

  function logout (): void {
    deleteBlankItemsCreatedByCurrentUser()
    setUsername('')
  }

  return (
    <>
      {/* Title */}
      <Head>
        <title>{potluk.name}</title>
      </Head>

      {/* Page Heading */}
      <h2 className='mb-1'>{potluk.name}</h2>
      <p className='is-uppercase has-text-grey has-text-weight-bold'>
        {Potluk.formatEventDateForDisplay(potluk.date)}
      </p>

      {/* Login Area */}
      {
        online &&
          <LoginForm
            username={username}
            onLogin={setUsername}
            onLogout={logout}
          />
      }

      {/* Categories */}
      {potluk.categories.map((category, categoryIndex) =>
        <CategoryBox
          key={categoryIndex}
          potluk={potluk}
          category={category}
          categoryIndex={categoryIndex}
          username={username}
          online={online}
        />
      )}

      {/* Bottom Buttons */}
      <div className='buttons is-flex is-justify-content-center mt-6 mb-0'>
        <ShareListButton potluk={potluk} />
        <ShareLinkButton potlukName={potluk.name} />
        <QrCodeButton potlukName={potluk.name} />
      </div>

      {/* Toast Component  */}
      <Toaster />
    </>
  )
}
