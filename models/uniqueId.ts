export default class UniqueID {
	public readonly id: string

	constructor(id?: string) {
		this.id = id || UniqueID.generateUniqueId()
	}

	/**
	 * Create unique ID by converting current Unix epoch to alphanumeric string
	 * and adding small random portion at the end in the off change of multiple
	 * IDs created during the same millisecond
	 */
	public static generateUniqueId(): string {
		const radix = 36 // 26 letters + 10 numbers
		const randomPortionLength = 2
		const timeStringProtion = new Date().getTime().toString(radix)
		const randomPortion = Math.floor(Math.random() * radix ** randomPortionLength).toString(radix)
		return timeStringProtion + randomPortion
	}
}
