import { faSquare } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import BottomButton from './BottomButton'

export default function SkeletonPage (): ReactElement {
  return (
    <>
      <Head>
        <title>Potluk</title>
      </Head>

      <div id='skeleton' data-testid='skeleton'>
        <h2 className='mb-1'>Name</h2>
        <p className='is-uppercase has-text-weight-bold'>Date</p>

        <div className='is-flex is-flex-direction-row-reverse is-justify-content-space-between is-align-items-center mb-5 w-100'>
          <button type='button' className='button is-grey ml-3 is-align-self-flex-end'>Log In</button>
          <div className='field w-100'>
            <div className='control'>
              <input className='input' />
            </div>
          </div>
        </div>

        <div className='box' />
        <div className='box' />
        <div className='box' />

        <div className='buttons is-flex is-justify-content-center mt-6 mb-0'>
          <BottomButton text='Share List' icon={faSquare} />
          <BottomButton text='Share Link' icon={faSquare} />
          <BottomButton text='QR Code' icon={faSquare} />
        </div>
      </div>
    </>
  )
}
