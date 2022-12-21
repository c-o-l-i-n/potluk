import Item from './item'

export default class Category {
	public index: number
	public name: string
	public items: Record<string, Item>

	constructor(index: number, name: string, items: Record<string, Item> = {}) {
		this.index = index
		this.name = name
		this.items = items
	}

	public static createFromJson = (json: Category): Category => {
		const { index, name, items } = json
		return new Category(index, name, items)
	}
}
