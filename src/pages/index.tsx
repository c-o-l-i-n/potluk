import Head from 'next/head'
import Link from 'next/link'
import { ReactElement } from 'react'
import Image from 'next/image'

export default function Home (): ReactElement {
  return (
    <>
      <Head>
        <title>Potluk</title>
      </Head>

      <main
        className='
          is-flex
          is-flex-direction-column
          is-align-items-center
          is-justify-content-space-between
          p-2'
      >

        <div className='is-flex is-align-items-center landing-page'>
          <Image
            src='/images/screenshot.webp'
            alt=''
            width={400}
            height={100}
            priority
            className='widescreen'
          />

          <div className='is-flex is-flex-direction-column is-align-items-center mb-6 max-width-500'>
            <h1 className='is-size-2-widescreen is-size-3'>Coordinate who brings what to your potluck with a simple sharable link</h1>

            <Link href='/new' className='button is-primary is-inline-block is-size-4 is-large has-text-weight-bold my-5'>
              Create New Potluk
            </Link>

            <Image
              src='/images/screenshot.webp'
              alt=''
              width={400}
              height={100}
              priority
              className='not-widescreen my-5'
            />

            <ol className='is-size-5 '>
              <li>Create a Potluk for your event</li>
              <li>Share the link with friends</li>
              <li>Choose what you bring</li>
            </ol>
          </div>
        </div>
      </main>
    </>
  )
}
