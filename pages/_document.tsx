import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	render() {
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

					{/* Fonts */}
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.eot'
						as='font'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.svg'
						as='font'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.ttf'
						as='font'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.woff'
						as='font'
						type='font/woff'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.woff2'
						as='font'
					/>

					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.eot'
						as='font'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.svg'
						as='font'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.ttf'
						as='font'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.woff'
						as='font'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.woff2'
						as='font'
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
