import { ChangeEvent, FunctionComponent } from 'react'

type Props = {
	type: string
	label: string
	placeholder?: string
	onChange: Function
}

const InputField: FunctionComponent<Props> = ({
	type,
	label,
	placeholder,
	onChange,
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
					onInput={(e: ChangeEvent<HTMLInputElement>) => {
						onChange(e.target.value)
					}}
				/>
			</div>
		</div>
	)
}

export default InputField
