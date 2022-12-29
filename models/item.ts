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

  public static createFromJson = (id: string, categoryIndex: number, json: Item): Item => {
    const { name, createdBy, broughtBy } = json
    return new Item(name, createdBy, broughtBy, categoryIndex, id)
  }
}
