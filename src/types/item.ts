import UniqueID from './uniqueId'

export default class Item {
  public id: string
  public name: string
  public createdBy: string
  public broughtBy: string | undefined
  public categoryIndex: number

  constructor (item: Partial<Item>) {
    this.id = item.id ?? UniqueID.generateUniqueId()
    this.name = item.name ?? ''
    this.createdBy = item.createdBy ?? 'no one'
    this.broughtBy = item.broughtBy
    this.categoryIndex = item.categoryIndex ?? 0
  }

  public static createFromDatabaseEntry (id: string, categoryIndex: number, itemDatabaseEntry: ItemDatabaseEntry): Item {
    const { n: name, c: createdBy, b: broughtBy } = itemDatabaseEntry
    return new Item({ name, createdBy, broughtBy: broughtBy ?? undefined, categoryIndex, id })
  }

  public toDatabaseEntry (): ItemDatabaseEntry {
    return {
      n: this.name,
      c: this.createdBy,
      b: this.broughtBy ?? null
    }
  }
}

export interface ItemDatabaseEntry {
  n: string // name
  c: string // createdBy
  b: string | null // broughtBy
}
