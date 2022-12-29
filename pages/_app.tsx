import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import { ReactElement } from 'react'
import Layout from '../components/Layout'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/fonts.scss'
import '../styles/globals.scss'
config.autoAddCss = false

const MyApp = ({
  Component,
  pageProps
}: AppProps): ReactElement => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
