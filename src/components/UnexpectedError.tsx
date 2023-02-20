import React, { ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function UnexpectedError (): ReactElement {
  return (
    <div className='container'>
      <h1>Unexpected Error ;(</h1>

      <div className='w-100 is-flex is-justify-content-center mb-4'>
        <Image
          src='/images/bug.svg'
          alt='Bug'
          width={300}
          height={230}
          priority
        />
      </div>

      <p>An unexpected error occurred while trying to load your Potluk. Please try again later.</p>

      <div className='w-100 is-flex is-justify-content-center'>
        <Link
          href='/'
          className='button is-primary has-text-weight-bold my-2'
        >
          Home
        </Link>
      </div>
    </div>
  )
}
