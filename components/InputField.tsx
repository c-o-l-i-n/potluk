import { ChangeEvent } from 'react'

type Props = {
	type: string
	label: string
	placeholder?: string
	onChange: Function
	disabled: boolean
}

const InputField = ({
	type,
	label,
	placeholder,
	onChange,
	disabled,
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
					onBlur={(e) => {
						onChange((e.target as HTMLInputElement).value)
					}}
					disabled={disabled}
				/>
			</div>
		</div>
	)
}

export default InputField
