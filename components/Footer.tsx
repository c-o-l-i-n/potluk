import { FunctionComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

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
				<a href='feedback.html'>Submit Feedback</a>
			</p>
		</footer>
	)
}

export default Footer
