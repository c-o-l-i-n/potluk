import Category, { CategoryDatabaseEntry } from './category'
import UniqueID from './uniqueId'

export default class Potluk extends UniqueID {
  public lastModified: Date
  public name: string
  public date: Date
  public categories: Category[]

  constructor (
    name: string,
    date: Date,
    categories: Category[],
    id?: string,
    lastModified?: Date
  ) {
    super(id)
    this.name = name
    this.date = date
    this.categories = categories
    this.lastModified = lastModified ?? new Date()
  }

  public static createFromDatabaseEntry (id: string, potlukDatabaseEntry: PotlukDatabaseEntry): Potluk {
    console.log('Creating Potluk from Database Entry:', JSON.parse(JSON.stringify(potlukDatabaseEntry)))

    const { name } = potlukDatabaseEntry
    const date = new Date(potlukDatabaseEntry.date)
    const lastModified = new Date(potlukDatabaseEntry.lastModified)

    const categories = Object.values(potlukDatabaseEntry.categories).map((categoryJson, index) =>
      Category.createFromDatabaseEntry(index, categoryJson)
    )

    return new Potluk(name, date, categories, id, lastModified)
  }

  public copy (): Potluk {
    return new Potluk(
      this.name,
      this.date,
      this.categories,
      this.id,
      this.lastModified
    )
  }
}

export interface PotlukDatabaseEntry {
  name: string
  date: string
  categories: CategoryDatabaseEntry[]
  lastModified: string
}
