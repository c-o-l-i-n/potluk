import { useForm } from '@formspree/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ReactElement } from 'react'
import FormspreeField from '../components/FormspreeField'

export default function Feedback (): ReactElement {
  const [state, handleSubmit] = useForm('mzbokqkv')

  const router = useRouter()

  const head = (
    <Head>
      <title>Submit Feedback</title>
    </Head>
  )

  if (state.succeeded) {
    return (
      <>
        {head}

        <h2>Thank you for your feedback!</h2>
        <p>We will review your message and take it into consideration for our next update.</p>

        <button
          type='button'
          className='button is-primary'
          onClick={() => router.back()}
        >
          Back
        </button>
      </>
    )
  }

  return (
    <>
      {head}

      <h2>Submit Feedback</h2>
      <form onSubmit={(e) => {
        void handleSubmit(e)
      }}
      >
        <FormspreeField state={state} name='Name' />
        <FormspreeField state={state} name='Email' type='email' placeholder='you@website.com' />
        <FormspreeField state={state} name='Feedback' isTextArea required />

        <div className='field is-flex is-justify-content-flex-end'>
          <div className='control'>
            <button
              type='submit'
              disabled={state.submitting}
              className={`button is-primary ${
                state.submitting ? 'is-loading' : ''
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
