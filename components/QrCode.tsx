import { ReactElement } from 'react'
import QRCode from 'react-qr-code'

interface Props {
  url: string
  bottomText: string
  onClick: () => unknown
}

const QrCode = ({ url, bottomText, onClick }: Props): ReactElement => {
  return (
    <div className='modal is-active' onClick={onClick}>
      <div className='modal-background' />
      <div className='modal-content p-5'>
        <div>
          <div className='is-flex is-justify-content-center is-relative'>
            <QRCode
              value={url}
              fgColor='white'
              bgColor='transparent'
              level='Q'
            />
            <div className='qr-overlay' />
          </div>
          <h1 className='has-text-centered has-text-white'>{bottomText}</h1>
        </div>
      </div>
      <button className='modal-close is-large' aria-label='close' />
    </div>
  )
}

export default QrCode
