import { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { render, RenderResult } from '@testing-library/react'
import PotlukApp from '../pages/_app'
import { NextComponentType, NextPageContext } from 'next'
import { Router } from 'next/router'

describe('PotlukApp', () => {
  interface PageProps { prop: string }
  let pageProps: PageProps
  let innerComponent: NextComponentType<NextPageContext, any, any>
  let router: Router
  let component: ReactElement
  let componentRender: RenderResult

  beforeEach(() => {
    pageProps = { prop: 'Hello World' }
    innerComponent = (props: PageProps) => <p>{props.prop}</p>
    router = {} as any
    component = <PotlukApp pageProps={pageProps} Component={innerComponent} router={router} />
    componentRender = render(component)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(componentRender).toBeTruthy()
  })
})
