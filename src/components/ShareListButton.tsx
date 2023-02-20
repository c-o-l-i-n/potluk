import { faList } from '@fortawesome/free-solid-svg-icons'
import React, { ReactElement } from 'react'
import Potluk from '../types/potluk'
import BottomButton from './BottomButton'
import SharingService from '../services/sharing'

interface Props {
  potluk: Potluk
}

export default function ShareListButton ({ potluk }: Props): ReactElement {
  return (
    <BottomButton
      text='Share List'
      icon={faList}
      onClick={() => { SharingService.shareText(potluk.toListString()) }}
    />
  )
}
