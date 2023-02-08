import Item, { ItemDatabaseEntry } from './item'
import UniqueID from './uniqueId'

export default class Category {
  public name: string
  public items: Record<string, Item>
  readonly #key: string

  constructor (obj: { name?: string, items?: Record<string, Item>, key?: string } = {}) {
    this.name = obj.name ?? ''
    this.items = obj.items ?? {}
    this.#key = obj.key ?? UniqueID.generateUniqueId()
  }

  public static createFromDatabaseEntry (index: number, json: CategoryDatabaseEntry): Category {
    const { name, items } = json
    const parsedItems: Record<string, Item> = {}

    items !== undefined && Object.entries(items).forEach(([itemId, itemJson]) => {
      parsedItems[itemId] = Item.createFromDatabaseEntry(itemId, index, itemJson)
    })

    return new Category({ name, items: parsedItems })
  }

  public getKey (): string {
    return this.#key
  }
}

export interface CategoryDatabaseEntry {
  name: string
  items: Record<string, ItemDatabaseEntry> | undefined
}
