import { NextPage } from 'next'
import { useForm, ValidationError } from '@formspree/react'
import { useRouter } from 'next/router'

const Feedback: NextPage = () => {
	const [state, handleSubmit] = useForm(
		process.env.NEXT_PUBLIC_FEEDBACK_FORM_ID || ''
	)

	const router = useRouter()

	if (state.succeeded) {
		return (
			<>
				<h2>Thank you for your feedback!</h2>
				<p>
					We will review your message and take it into consideration for our
					next update.
				</p>
				<button
					className='button is-primary'
					type='submit'
					onClick={() => {
						router.back()
					}}
				>
					Back
				</button>
			</>
		)
	}

	return (
		<>
			<h2>Submit Feedback</h2>
			<form onSubmit={handleSubmit}>
				<div className='field mb-5'>
					<label className='label'>Name (Optional)</label>
					<div className='control'>
						<input
							className='input'
							type='text'
							name='name'
							placeholder='Name'
							disabled={state.submitting}
						/>
						<ValidationError
							field='email'
							prefix='🤨 This'
							errors={state.errors}
							className='has-text-danger'
						></ValidationError>
					</div>
				</div>

				<div className='field mb-5'>
					<label className='label'>Email (if you want follow-up)</label>
					<div className='control'>
						<input
							className='input'
							type='email'
							name='email'
							placeholder='you@website.com'
							disabled={state.submitting}
						/>
						<ValidationError
							field='email'
							prefix='🤨 This'
							errors={state.errors}
							className='has-text-danger'
						></ValidationError>
					</div>
				</div>

				<div className='field mb-5'>
					<label className='label'>Feedback</label>
					<div className='control'>
						<textarea
							className='textarea'
							name='feedback'
							placeholder='Feedback'
							required
							disabled={state.submitting}
						></textarea>
						<ValidationError
							field='feedback'
							prefix='🤨 This'
							errors={state.errors}
							className='has-text-danger'
						></ValidationError>
					</div>
				</div>

				<div className='field is-flex is-justify-content-flex-end'>
					<div className='control'>
						<button
							className={`button is-primary ${
								state.submitting ? 'disabled is-loading' : ''
							}`}
							type='submit'
						>
							Submit
						</button>
					</div>
				</div>
			</form>
		</>
	)
}

export default Feedback
