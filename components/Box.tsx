type Props = {
	children: React.ReactNode
}

const Box = ({ children }: Props) => {
	return <div className='box potluk-box mb-6'>{children}</div>
}

export default Box
