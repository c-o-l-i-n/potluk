export default class UniqueID {
	public static readonly ID_LENGTH: number = 8
	public static readonly ID_ALPHABET: string =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

	public readonly id: string

	constructor(id?: string) {
		this.id = id || UniqueID.generateUniqueId()
	}

	private static generateUniqueId() {
		let id = ''
		for (let i = 0; i < UniqueID.ID_LENGTH; i++) {
			id += UniqueID.ID_ALPHABET.charAt(
				Math.floor(Math.random() * UniqueID.ID_ALPHABET.length)
			)
		}
		return id
	}

	public static updateListItemMaintainOrder = (
		list: Array<UniqueID>,
		element: UniqueID
	) => {
		const index = list.findIndex((e) => e.id === element.id)
		const updatedList = [...list]
		updatedList.splice(index, 1, element)
		return updatedList
	}

	public static deleteListItemMaintainOrder = (
		list: Array<UniqueID>,
		elementId: string
	) => {
		const index = list.findIndex((e) => e.id === elementId)
		const updatedList = [...list]
		updatedList.splice(index, 1)
		return updatedList
	}
}
