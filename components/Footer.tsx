import { FunctionComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

const Footer: FunctionComponent = () => {
	return (
		<footer className='footer has-text-centered'>
			<p>
				&copy;
				{' ' + new Date().getFullYear() + ' '}
				Colin A. Williams &nbsp;
				<a
					href='https://github.com/c-o-l-i-n/potluk'
					target='_blank'
					rel='noreferrer'
				>
					<FontAwesomeIcon icon={faGithub} />
				</a>
			</p>
			<p>
				<Link href='/feedback'>
					<a>Submit Feedback</a>
				</Link>
			</p>
		</footer>
	)
}

export default Footer
