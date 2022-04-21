import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import { FunctionComponent } from 'react'
import Layout from '../components/Layout'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
config.autoAddCss = false

const MyApp: FunctionComponent<AppProps> = ({
	Component,
	pageProps,
}: AppProps) => {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	)
}

export default MyApp
