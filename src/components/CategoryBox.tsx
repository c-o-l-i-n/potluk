import React, { ReactElement } from 'react'
import Category from '../types/category'
import Potluk from '../types/potluk'
import AddButton from './AddButton'
import Box from './Box'
import BoxHeader from './BoxHeader'
import FirebaseService from '../services/firebase'
import Item from '../types/item'
import ItemRow from './ItemRow'

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

function shouldShowAddButton (online: boolean, username: string): boolean {
  return online && username !== ''
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
      {shouldShowAddButton(online, username)
        ? (
          <AddButton
            onClick={() =>
              FirebaseService.addItemToDatabase(potluk.id, new Item({ createdBy: username, categoryIndex }))}
          />
          )
        : <></>}
    </Box>
  )
}
