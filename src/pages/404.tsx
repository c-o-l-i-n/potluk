import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * This page is a hack to achieve the "illusion" of dynamic routing in a static
 * site hosted on Github Pages.
 *
 * Since Potluk IDs are not in the list of pre-built static routes, Github
 * Pages shows the 404.html page when a user navigates to a Potluk page,
 * which loads this component.
 *
 * This component then pushes the user to the normal Potluk page using the
 * Next.js router. It works becuase Next.js router.push() uses an all-JS SPA
 * approach to change pages rather than making a new HTTP request.
 */
export default function ForwardToPotluk (): void {
  const router = useRouter()

  useEffect(() => {
    void router.replace(router.asPath.split('/')[1])
  }, [])
}
