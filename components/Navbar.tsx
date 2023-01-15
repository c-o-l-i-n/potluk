import { FunctionComponent } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar: FunctionComponent = () => {
  return (
    <nav
      className='navbar is-primary'
      role='navigation'
      aria-label='main navigation'
    >
      <Link href='/'>
        <div className='navbar-brand ml-5'>
          <div className='navbar-item px-0'>
            <Image
              src='/images/logo.svg'
              alt='Logo'
              width={36}
              height={36}
            />
          </div>
          <span className='navbar-item is-size-3 has-text-weight-bold m-1'>
            POTLUK
          </span>
        </div>
      </Link>
    </nav>
  )
}

export default Navbar
