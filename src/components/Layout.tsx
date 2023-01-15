import Navbar from './Navbar'
import Footer from './Footer'
import { ReactElement } from 'react'

interface Props {
  children: React.ReactNode
}

export default function Layout ({ children }: Props): ReactElement {
  return (
    <>
      <Navbar />
      <main>
        <div className='container'>{children}</div>
      </main>
      <Footer />
    </>
  )
}
