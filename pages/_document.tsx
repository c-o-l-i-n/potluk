import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link rel='icon' href='/favicon.ico' />

					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.eot'
						as='font'
						type='font/eot'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.svg'
						as='font'
						type='font/svg'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.ttf'
						as='font'
						type='font/ttf'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.woff'
						as='font'
						type='font/woff'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-700.woff2'
						as='font'
						type='font/woff2'
						crossOrigin='anonymous'
					/>

					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.eot'
						as='font'
						type='font/eot'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.svg'
						as='font'
						type='font/svg'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.ttf'
						as='font'
						type='font/ttf'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.woff'
						as='font'
						type='font/woff'
						crossOrigin='anonymous'
					/>
					<link
						rel='preload'
						href='/fonts/montserrat-v24-latin-regular.woff2'
						as='font'
						type='font/woff2'
						crossOrigin='anonymous'
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
