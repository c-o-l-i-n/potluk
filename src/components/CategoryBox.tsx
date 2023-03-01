import React, { ReactElement } from 'react'
import Category from '../types/category'
import Potluk from '../types/potluk'
import AddButton from './AddButton'
import Box from './Box'
import BoxHeader from './BoxHeader'
import FirebaseService from '../services/firebase'
import Item from '../types/item'
import ItemRow from './ItemRow'

const MAX_ITEMS_PER_CATEGORY = 20

function noRowsToShow (category: Category, username: string): boolean {
  return !Object.values(category.items).some(i => i.name !== '' || i.createdBy === username)
}

function noRowsMessage (username: string): ReactElement {
  return (
    <p className='has-text-grey has-text-centered is-italic mb-0 mt-3'>
      {username === ''
        ? <>Nothing yet!<br />Log in to add an item</>
        : <>Tap the <strong>+</strong> button to add an item</>}
    </p>
  )
}

function isOnlineAndLoggedIn (online: boolean, username: string): boolean {
  return online && username !== ''
}

function shouldShowAddButton (online: boolean, username: string, items: Record<string, Item>): boolean {
  return isOnlineAndLoggedIn(online, username) && Object.keys(items).length < MAX_ITEMS_PER_CATEGORY
}

interface Props {
  potluk: Potluk
  category: Category
  categoryIndex: number
  username: string
  online: boolean
}

export default function CategoryBox ({ potluk, category, categoryIndex, username, online }: Props): ReactElement {
  return (
    <Box>
      <BoxHeader title={category.name} />

      {/* Items */}
      {noRowsToShow(category, username)
        ? noRowsMessage(username)
        : Object.values(category.items).map(item =>
          <ItemRow
            key={item.id}
            potlukId={potluk.id}
            categoryName={category.name}
            username={username}
            initialItem={item}
            online={online}
          />)}

      {/* Add Item Buttom */}
      {shouldShowAddButton(online, username, category.items)
        ? (
          <AddButton
            onClick={() =>
              FirebaseService.addItemToDatabase(potluk.id, new Item({ createdBy: username, categoryIndex }))}
          />
          )
        : isOnlineAndLoggedIn(online, username)
          ? (
            <p className='has-text-centered is-italic mt-4 has-text-grey'>
              Maximum reached ({MAX_ITEMS_PER_CATEGORY})
            </p>
            )
          : <></>}
    </Box>
  )
}
