type Props = {
	children: React.ReactNode
}

const Box = ({ children }: Props) => {
	return <div className='box'>{children}</div>
}

export default Box
