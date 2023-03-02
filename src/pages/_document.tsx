import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ReactElement } from 'react'

class PotlukDocument extends Document {
  render (): ReactElement {
    return (
      <Html>
        <Head>
          {/* Site Icons */}
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/icons/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/icons/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/icons/favicon-16x16.png'
          />
          <link rel='manifest' href='/icons/site.webmanifest' />
          <link
            rel='mask-icon'
            href='/icons/safari-pinned-tab.svg'
            color='#37c54e'
          />
          <link rel='shortcut icon' href='/icons/favicon.ico' />
          <meta name='msapplication-TileColor' content='#37c54e' />
          <meta
            name='msapplication-config'
            content='/icons/browserconfig.xml'
          />
          <meta name='theme-color' content='#37c54e' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default PotlukDocument
