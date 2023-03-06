import { ReactElement } from 'react'
import { RenderResult, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages'

describe('Home Page', () => {
  let component: ReactElement
  let componentRender: RenderResult

  beforeEach(() => {
    component = <Home />
    componentRender = render(component)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(componentRender).toBeTruthy()
  })

  it('should have "create new potluk" link', () => {
    const createNewPotlukLink = screen.queryByText('Create New Potluk')
    expect(createNewPotlukLink).toBeInTheDocument()
  })

  it('should have a "create new potluk" link that goes to the /new page', async () => {
    const createNewPotlukLink = screen.getByRole('link')
    expect(createNewPotlukLink).toHaveTextContent('Create New Potluk')
    expect(createNewPotlukLink).toHaveAttribute('href', '/new')
  })
})
