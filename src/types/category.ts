import Item from './item'
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

  public static createFromJson (index: number, json: Category): Category {
    const { name, items } = json

    items !== undefined && Object.entries(items).forEach(([itemId, itemJson]) => {
      items[itemId] = Item.createFromJson(itemId, index, itemJson)
    })

    return new Category({ name, items })
  }

  public getKey (): string {
    return this.#key
  }
}
