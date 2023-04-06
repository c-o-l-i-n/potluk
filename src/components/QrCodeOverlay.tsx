import { ReactElement } from 'react'
import QRCode from 'react-qr-code'

interface Props {
  url: string
  bottomText: string
  onClick: () => void
}

export default function QrCodeOverlay ({ url, bottomText, onClick }: Props): ReactElement {
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
              data-testid='qr-code'
            />
            <div className='qr-logo-background'>
              <div className='qr-logo' />
            </div>
          </div>
          <h1 className='has-text-centered has-text-white'>{bottomText}</h1>
        </div>
      </div>
      <button className='modal-close is-large' aria-label='close' />
    </div>
  )
}
