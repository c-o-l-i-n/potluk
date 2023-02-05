import Head from 'next/head'
import React, { ReactElement } from 'react'

interface Props {
  potlukId: string
}

export default function NotFound ({ potlukId }: Props): ReactElement {
  return (
    <>
      <Head>
        <title>404 - Potluk Not Found</title>
      </Head>
      <center>
        <h1>404</h1>
        <p>Potluk with ID &quot;{potlukId}&quot; not found.</p>
      </center>
    </>
  )
}
