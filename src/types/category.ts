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
