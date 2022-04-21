import { FunctionComponent } from 'react'
import Link from 'next/link'

const Navbar: FunctionComponent = () => {
	return (
		<nav
			className='navbar is-primary'
			role='navigation'
			aria-label='main navigation'
		>
			<Link href='/'>
				<a>
					<div className='navbar-brand'>
						<span className='navbar-item is-size-3 has-text-weight-bold m-3'>
							POTLUK
						</span>
					</div>
				</a>
			</Link>
		</nav>
	)
}

export default Navbar
