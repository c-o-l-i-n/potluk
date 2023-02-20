import type { AppProps } from 'next/app'
import { config } from '@fortawesome/fontawesome-svg-core'
import { ReactElement } from 'react'
import Layout from '../components/Layout'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import { Montserrat } from '@next/font/google'
config.autoAddCss = false

const font = Montserrat({
  subsets: ['latin'],
  variable: '--app-font'
})

export default function MyApp ({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <style jsx global>{`
        :root {
          --app-font: ${font.style.fontFamily};
        }
      `}
      </style>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
