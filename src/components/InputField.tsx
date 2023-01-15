import { ReactElement } from 'react'

interface Props {
  type: string
  label: string
  placeholder?: string
  onChange: Function
  disabled?: boolean
  onEnterKeyPressed?: Function
  swapBold?: boolean
  defaultValue?: string
}

export default function InputField ({
  type,
  label,
  placeholder,
  onChange,
  disabled = false,
  onEnterKeyPressed = () => {},
  swapBold = false,
  defaultValue = ''
}: Props): ReactElement {
  const kebabCase = (text: string): string => text.toLowerCase().replace(/ /g, '-')
  const fieldName = kebabCase(label)

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
          defaultValue={defaultValue}
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
