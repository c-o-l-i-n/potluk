import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import React, { ReactElement, useState } from 'react'
import BottomButton from './BottomButton'
import QrCodeOverlay from './QrCodeOverlay'

interface Props {
  potlukName: string
}

export default function QrCodeButton ({ potlukName }: Props): ReactElement {
  const [showingQrCode, setShowingQrCode] = useState(false)

  return (
    <>
      {
        showingQrCode &&
          <QrCodeOverlay
            url={window.location.href}
            bottomText={potlukName}
            onClick={() => setShowingQrCode(false)}
          />
      }

      <BottomButton
        text='QR Code'
        icon={faQrcode}
        onClick={() => setShowingQrCode(true)}
      />
    </>
  )
}
