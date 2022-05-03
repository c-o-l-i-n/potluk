import { ChangeEvent } from 'react'

type Props = {
	type: string
	label: string
	placeholder?: string
	onChange: Function
	disabled: boolean
	onEnterKeyPressed: Function
}

const InputField = ({
	type,
	label,
	placeholder,
	onChange,
	disabled,
	onEnterKeyPressed,
}: Props) => {
	const kebabCase = (text: string) => text.toLowerCase().replace(' ', '-')
	const fieldName = kebabCase(label)

	return (
		<div className='field'>
			<label className='label' htmlFor={fieldName}>
				{label}
			</label>
			<div className='control'>
				<input
					className='input'
					type={type}
					name={fieldName}
					placeholder={placeholder}
					onChange={(e) => {
						onChange((e.target as HTMLInputElement).value)
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
