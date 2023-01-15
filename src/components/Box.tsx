import { ReactElement } from 'react'

interface Props {
  children: React.ReactNode
}

export default function Box ({ children }: Props): ReactElement {
  return <div className='box'>{children}</div>
}
