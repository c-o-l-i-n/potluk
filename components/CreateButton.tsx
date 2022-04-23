type Props = {
	onClick: Function
	isLoading: boolean
}

const CreateButton = ({ onClick, isLoading }: Props) => {
	return (
		<button
			className={`button is-primary is-size-4 is-large has-text-weight-bold mt-3 ${
				isLoading ? 'is-loading' : ''
			}`}
			onClick={() => onClick()}
		>
			Create
		</button>
	)
}

export default CreateButton
