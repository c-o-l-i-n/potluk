import { serverTimestamp } from 'firebase/database'
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

  public toDatabaseEntry (): PotlukDatabaseEntry {
    return {
      name: this.name,
      date: this.date.toLocaleDateString('fr-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      categories: this.categories.map(category => category.toDatabaseEntry()),
      lastModified: serverTimestamp() as any
    }
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
  lastModified: number
}
