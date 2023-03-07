import { useRouter } from 'next/router'
import Potluk from '../types/potluk'
import { ReactElement, useEffect, useRef, useState } from 'react'
import FirebaseService from '../services/firebase'
import PotlukPage from '../components/PotlukPage'
import NotFound from '../components/NotFound'
import PotlukNotFoundError from '../types/errors/potlukNotFoundError'
import UnexpectedError from '../components/UnexpectedError'
import SkeletonPage from '../components/SkeletonPage'

export default function Main (): ReactElement {
  const router = useRouter()
  const [potluk, setPotluk] = useState<Potluk>()
  const [notFound, setNotFound] = useState(false)
  const [unexpectedErrorOccurred, setUnexpectedErrorOccurred] = useState(false)
  const username = useRef('')

  // set initial username and get potluk from db
  useEffect(() => {
    // assert router is ready
    if (!router.isReady) return

    // assert Potluk ID is a string
    if (typeof router.query.id !== 'string') {
      console.error('Unexpected error: typeof router.query.id is is not "string"', router)
      setUnexpectedErrorOccurred(true)
      return
    }

    // get username from query string
    if (typeof router.query.u === 'string') {
      username.current = router.query.u
    }

    // remove query string (username) from URL
    const urlHasQueryString = Object.keys(router.query).length > 1
    if (urlHasQueryString) {
      const purePath = router.asPath.substring(0, router.query.id.length + 1)
      void router.replace({ pathname: purePath }, undefined, { shallow: true })
    }

    // get initial Potluk from db
    void FirebaseService.getPotlukFromDatabase(router.query.id)
      .then(response => {
        console.log('Potluk Parsed from DB:', response)
        setPotluk(response)
      })
      .catch((err) => {
        if (err instanceof PotlukNotFoundError) {
          setNotFound(true)
        } else {
          console.error('Unexpected error:', err)
          setUnexpectedErrorOccurred(true)
        }
      })
  }, [router.isReady])

  if (unexpectedErrorOccurred) {
    return <UnexpectedError />
  }

  if (notFound) {
    return <NotFound potlukId={router.query.id as string} />
  }

  if (potluk === undefined) {
    return <SkeletonPage />
  }

  return <PotlukPage initialPotluk={potluk} initialUsername={username.current} />
}
