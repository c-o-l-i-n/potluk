import UniqueID from './uniqueId'

export default class Item extends UniqueID {
  public name: string
  public createdBy: string
  public broughtBy: string | undefined
  public categoryIndex: number

  constructor (
    name: string,
    createdBy: string,
    broughtBy: string | undefined,
    categoryIndex: number,
    id?: string
  ) {
    super(id)
    this.name = name
    this.createdBy = createdBy
    this.broughtBy = broughtBy
    this.categoryIndex = categoryIndex
  }

  public static createFromDatabaseEntry (id: string, categoryIndex: number, json: ItemDatabaseEntry): Item {
    const { name, createdBy, broughtBy } = json
    return new Item(name, createdBy, broughtBy ?? undefined, categoryIndex, id)
  }

  public toDatabaseEntry (): ItemDatabaseEntry {
    return {
      name: this.name,
      createdBy: this.createdBy,
      broughtBy: this.broughtBy ?? null
    }
  }
}

export interface ItemDatabaseEntry {
  name: string
  createdBy: string
  broughtBy: string | null
}
