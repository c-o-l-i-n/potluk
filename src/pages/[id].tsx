import { useRouter } from 'next/router'
import Potluk from '../types/potluk'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { getPotlukFromDatabase } from '../firebase/firebase'
import PotlukView from '../components/PotlukView'
import LoadingSpinner from '../components/LoadingSpinner'
import Head from 'next/head'

export default function Main (): ReactElement {
  const router = useRouter()
  const [potluk, setPotluk] = useState<Potluk>()
  const username = useRef('')

  // set initial username and get potluk from db
  useEffect(() => {
    if (!router.isReady) return

    if (typeof router.query.id !== 'string') {
      console.error('Unexpected error: typeof router.query.id is is not "string"', router)
      return
    }

    if (typeof router.query.u === 'string') {
      username.current = router.query.u
    }

    // remove query string (username) from URL
    const urlHasQueryString = Object.keys(router.query).length > 1
    if (urlHasQueryString) {
      const purePath = router.asPath.substring(0, router.query.id.length + 1)
      void router.replace({ pathname: purePath }, undefined, { shallow: true })
    }

    // get initial potluk from db
    void getPotlukFromDatabase(router.query.id).then(response => {
      console.log('Potluk Parsed from DB:', response)

      setPotluk(response)
    })
  }, [router.isReady])

  if (router.isFallback || !router.isReady || (potluk == null)) {
    return (
      <>
        <Head>
          <title>Potluk</title>
        </Head>
        <LoadingSpinner />
      </>
    )
  }

  return <PotlukView initialPotluk={potluk} initialUsername={username.current} />
}
