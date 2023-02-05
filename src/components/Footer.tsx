import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import { ReactElement } from 'react'

export default function Footer (): ReactElement {
  return (
    <footer className='footer has-text-centered'>
      <p>
        &copy;
        {` ${new Date().getFullYear()} `}
        Colin A. Williams &nbsp;
        <Link
          href='https://github.com/c-o-l-i-n/potluk'
          target='_blank'
          rel='noreferrer'
        >
          <FontAwesomeIcon icon={faGithub} />
        </Link>
      </p>
      <p className='mt-1'>
        <Link href='/feedback'>
          Submit Feedback
        </Link>
      </p>
      <p className='mt-1'>
        <Link
          href='https://www.buymeacoffee.com/colinw'
          target='_blank'
          rel='noreferrer'
        >
          ☕️ Buy Me a Coffee
        </Link>
      </p>
    </footer>
  )
}
