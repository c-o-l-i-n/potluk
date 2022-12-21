type Props = {
	type: string
	label: string
	placeholder?: string
	onChange: Function
	disabled?: boolean
	onEnterKeyPressed: Function
	swapBold: boolean
}

const InputField = ({
	type,
	label,
	placeholder,
	onChange,
	disabled = false,
	onEnterKeyPressed,
	swapBold,
}: Props) => {
	const kebabCase = (text: string) => text.toLowerCase().replaceAll(' ', '-')
	const fieldName = kebabCase(label)

	const defaultDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`

	return (
		<div className='field w-100'>
			<label
				className={`label ${swapBold ? 'has-text-weight-normal' : ''}`}
				htmlFor={fieldName}
			>
				{label}
			</label>
			<div className='control'>
				<input
					className={`input ${swapBold ? 'has-text-weight-bold' : ''}`}
					type={type}
					name={fieldName}
					placeholder={placeholder}
					defaultValue={type === 'date' ? defaultDate : ''}
					onChange={(e) => {
						onChange((e.target as HTMLInputElement).value.trim())
					}}
					disabled={disabled}
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							onEnterKeyPressed()
						}
					}}
				/>
			</div>
		</div>
	)
}

export default InputField
