import Head from 'next/head'
import Link from 'next/link'
import React, { ReactElement } from 'react'
import Image from 'next/image'

interface Props {
  potlukId: string
}

export default function NotFound ({ potlukId }: Props): ReactElement {
  return (
    <>
      <Head>
        <title>404 - Potluk Not Found</title>
      </Head>
      <div className='has-text-centered' data-testid='not-found-page'>
        <Image
          src='/images/404.svg'
          alt='Page Not Found'
          width={300}
          height={200}
          priority
        />
        <p>Potluk with ID &quot;{potlukId}&quot; not found.</p>
        <p><strong>Tip:</strong> Make sure the full link was copied exactly right.</p>
        <Link
          href='/'
          className='button is-primary has-text-weight-bold mt-5 mb-6'
        >
          Home
        </Link>
      </div>
    </>
  )
}
