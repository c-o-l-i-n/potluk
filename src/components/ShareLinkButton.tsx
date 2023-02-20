import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import React, { ReactElement } from 'react'
import BottomButton from './BottomButton'
import SharingService from '../services/sharing'

interface Props {
  potlukName: string
}

export default function ShareListButton ({ potlukName }: Props): ReactElement {
  return (
    <BottomButton
      text='Share Link'
      icon={faArrowUpRightFromSquare}
      onClick={() => { SharingService.shareLink(potlukName, window.location.href) }}
    />
  )
}
