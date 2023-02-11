import Item, { ItemDatabaseEntry } from './item'
import UniqueID from './uniqueId'

export default class Category {
  public name: string
  public items: Record<string, Item>
  readonly #key: string

  constructor (category: Partial<Category> & { key?: string } = {}) {
    this.name = category.name ?? ''
    this.items = category.items ?? {}
    this.#key = category.key ?? UniqueID.generateUniqueId()
  }

  public static createFromDatabaseEntry (index: number, categoryDatabaseEntry: CategoryDatabaseEntry): Category {
    const { name, items } = categoryDatabaseEntry
    const parsedItems: Record<string, Item> = {}

    items !== undefined && items !== null && Object.entries(items).forEach(([itemId, itemJson]) => {
      parsedItems[itemId] = Item.createFromDatabaseEntry(itemId, index, itemJson)
    })

    return new Category({ name, items: parsedItems })
  }

  public toDatabaseEntry (): CategoryDatabaseEntry {
    const itemDatabaseEntries: Record<string, ItemDatabaseEntry> = {}
    const itemEntries = Object.entries(this.items)
    itemEntries.forEach(([itemId, item]) => {
      itemDatabaseEntries[itemId] = item.toDatabaseEntry()
    })

    return {
      name: this.name,
      items: itemEntries.length > 0 ? itemDatabaseEntries : null
    }
  }

  public getKey (): string {
    return this.#key
  }
}

export interface CategoryDatabaseEntry {
  name: string
  items: Record<string, ItemDatabaseEntry> | null
}
