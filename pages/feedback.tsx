import { NextPage } from 'next'
import { useForm, ValidationError } from '@formspree/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const Feedback: NextPage = () => {
	const [state, handleSubmit] = useForm(
		process.env.NEXT_PUBLIC_FEEDBACK_FORM_ID || ''
	)

	const router = useRouter()

	if (state.succeeded) {
		return (
			<>
				<Head>
					<title>Submit Feedback</title>
				</Head>

				<h2>Thank you for your feedback!</h2>
				<p>
					We will review your message and take it into consideration for our
					next update.
				</p>
				<button
					type='button'
					className='button is-primary'
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
			<Head>
				<title>Submit Feedback</title>
			</Head>

			<h2>Submit Feedback</h2>
			<form onSubmit={handleSubmit}>
				<div className='field mb-5'>
					<label className='label' htmlFor='name'>
						Name (Optional)
					</label>
					<div className='control'>
						<input
							className='input'
							type='text'
							name='name'
							placeholder='Name'
							disabled={state.submitting}
						/>
						<ValidationError
							field='name'
							prefix='🤨 This'
							errors={state.errors}
							className='has-text-danger'
						></ValidationError>
					</div>
				</div>

				<div className='field mb-5'>
					<label className='label' htmlFor='email'>
						Email (Optional, if you want follow-up)
					</label>
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
					<label className='label' htmlFor='feedback'>
						Feedback
					</label>
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
							type='submit'
							className={`button is-primary ${
								state.submitting ? 'disabled is-loading' : ''
							}`}
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
