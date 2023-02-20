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

  public static formatEventDate (date = new Date()): string {
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  public static formatEventDateForDisplay (date: Date): string {
    const correctedDate = new Date(new Date(date).toISOString().slice(0, -1))
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return correctedDate.toLocaleDateString('en-US', options)
  }

  public static createFromDatabaseEntry (id: string, potlukDatabaseEntry: PotlukDatabaseEntry): Potluk {
    console.log('Creating Potluk from Database Entry:', JSON.parse(JSON.stringify(potlukDatabaseEntry)))

    const { n: name } = potlukDatabaseEntry
    const date = new Date(potlukDatabaseEntry.d)
    const lastModified = new Date(potlukDatabaseEntry.m)

    const categories = Object.values(potlukDatabaseEntry.c).map((categoryJson, index) =>
      Category.createFromDatabaseEntry(index, categoryJson)
    )

    return new Potluk(name, date, categories, id, lastModified)
  }

  public toDatabaseEntry (): PotlukDatabaseEntry {
    return {
      n: this.name,
      d: Potluk.formatEventDate(this.date),
      c: this.categories.map(category => category.toDatabaseEntry()),
      m: serverTimestamp() as any
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

  public toListString (): string {
    let text = `👉 ${this.name}\n`
    text += `📆 ${Potluk.formatEventDateForDisplay(this.date)}\n`
    text += `🔗 ${window.location.href.split('://').at(-1) ?? 'Link Unavailable'}\n`

    for (const category of this.categories) {
      text += '\n' + category.name.toUpperCase() + '\n'

      const items = Object.values(category.items)

      // if there are no items with names, continue to next category
      if (items.find(i => i.name !== '') === undefined) {
        text += '(nothing yet)\n'
        continue
      }

      for (const item of items) {
        if (item.name === '') continue
        text += item.broughtBy === undefined ? '🔲 ' : '✅ '
        text += item.name + ` (${item.broughtBy ?? 'Up for grabs'})\n`
      }
    }
    return text
  }
}

export interface PotlukDatabaseEntry {
  n: string // name
  d: string // date
  c: CategoryDatabaseEntry[] // categories
  m: number // lastModified
}
