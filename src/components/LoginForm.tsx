import React, { ReactElement, useState } from 'react'
import InputField from './InputField'

interface Props {
  username: string
  onLogin: (newUsername: string) => unknown
  onLogout: () => unknown
}

export default function LoginForm ({ username, onLogin, onLogout: logout }: Props): ReactElement {
  const [loginFieldValue, setLoginFieldValue] = useState(username)

  function login (): void {
    if (loginFieldValue.trim() !== '') {
      onLogin(loginFieldValue.trim())
    }
  }

  const loggedOutView = (
    <>
      <button
        type='button'
        className='button is-primary ml-3 is-align-self-flex-end'
        onClick={login}
      >
        Log In
      </button>
      <InputField
        type='text'
        placeholder='Enter your name to edit'
        onChange={setLoginFieldValue}
        onEnterKeyPressed={login}
        swapBold
      />
    </>
  )

  const loggedInView = (
    <>
      <button
        type='button'
        className='button is-primary ml-3'
        onClick={logout}
      >
        Log Out
      </button>
      <p className='mb-0'>
        Logged in as: <strong className='no-wrap'>{username}</strong>
      </p>
    </>
  )

  return (
    <div className='is-flex is-flex-direction-row-reverse is-justify-content-space-between is-align-items-center mb-5 w-100'>
      {username !== '' ? loggedInView : loggedOutView}
    </div>
  )
}
