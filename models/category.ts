import Item from './item'

export default class Category {
	public name: string
	public items: Record<string, Item>

	constructor(index: number, name: string, items: Record<string, Item> = {}) {
		this.name = name
		this.items = items
	}

	public static createFromJson = (index: number, json: Category): Category => {
		const { name, items } = json

		items && Object.entries(items).forEach(([itemId, itemJson]) =>
			items[itemId] = Item.createFromJson(itemId, index, itemJson)
		)
		
		return new Category(index, name, items)
	}
}
