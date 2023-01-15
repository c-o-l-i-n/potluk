import { ReactElement } from 'react'

interface Props {
  children: React.ReactNode
}

const Box = ({ children }: Props): ReactElement => {
  return <div className='box'>{children}</div>
}

export default Box
