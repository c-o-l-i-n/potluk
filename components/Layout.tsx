import { NextComponentType } from 'next'
import Navbar from './Navbar'
import Footer from './Footer'
import { FunctionComponent, ReactComponentElement, ReactNode } from 'react'

type Props = {
	children: React.ReactNode
}

const Layout: FunctionComponent<Props> = ({ children }: Props) => {
	return (
		<>
			<Navbar />
			<main>{children}</main>
			<Footer />
		</>
	)
}

export default Layout
