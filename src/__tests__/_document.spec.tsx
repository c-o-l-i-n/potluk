import { JSXElementConstructor, ReactElement, ReactFragment } from 'react'
import '@testing-library/jest-dom'
import { render, RenderResult } from '@testing-library/react'
import PotlukDocument from '../pages/_document'
import { HtmlProps } from 'next/dist/shared/lib/html-context'
import { RenderPageResult } from 'next/dist/shared/lib/utils'

jest.mock('next/document')

describe('PotlukDocument', () => {
  let document: PotlukDocument
  let documentRender: RenderResult
  let props: (RenderPageResult & {
    styles?: JSX.Element | Array<ReactElement<any, string | JSXElementConstructor<any>>> | ReactFragment | undefined
  } & HtmlProps)

  beforeEach(() => {
    props = {} as any
    document = new PotlukDocument(props)
    documentRender = render(document.render())
  })

  it('should create', () => {
    expect(document).toBeTruthy()
  })

  it('should render', () => {
    expect(documentRender).toBeTruthy()
  })
})
