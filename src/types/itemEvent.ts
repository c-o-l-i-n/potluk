import { DataSnapshot, Query, Unsubscribe } from 'firebase/database'
import { ItemDatabaseEntry } from './item'

export enum ItemEventType {
  ADD = 'add',
  CHANGE = 'change',
  DELETE = 'delete'
}

export default interface ItemEvent {
  type: ItemEventType
  categoryIndex: number
  itemId: string
  itemDatabaseEntry: ItemDatabaseEntry
}

export type ItemEventListener = (event: ItemEvent) => void

export interface EventFunctions {
  firebaseEvent: (query: Query, callback: (snapshot: DataSnapshot) => unknown) => Unsubscribe
  itemEventListener: ItemEventListener
}
