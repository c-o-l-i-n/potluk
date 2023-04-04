import React, { ReactElement } from 'react'
import { RenderResult, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import PotlukPage from '../components/PotlukPage'
import Potluk from '../types/potluk'
import Category from '../types/category'
import Item from '../types/item'

jest.mock('../services/firebase')
jest.mock('firebase/app-check')

describe('PotlukPage', () => {
  let potlukId: string
  let potlukName: string
  let potlukDate: Date
  let potlukDatePretty: string
  let categories: Category[]
  let potluk: Potluk
  let component: ReactElement
  let componentRender: RenderResult
  let user: UserEvent
  // let offlineGracePeriodMs: number

  beforeEach(() => {
    jest.useFakeTimers()

    potlukId = 'PotlukId'
    potlukName = 'Test Potluk'
    potlukDate = new Date('2023-01-01')
    potlukDatePretty = 'Sunday, January 1, 2023'
    categories = [
      new Category({
        name: 'Appetizers',
        items: {
          itemId00: new Item({
            id: 'itemId00',
            name: 'Cheese Ball',
            createdBy: 'Colin',
            categoryIndex: 0
          }),
          itemId01: new Item({
            id: 'itemId01',
            name: 'Nachos',
            createdBy: 'Hazel',
            categoryIndex: 0
          })
        }
      }),
      new Category({
        name: 'Main Dishes',
        items: {
          itemId10: new Item({
            id: 'itemId10',
            name: 'Pizza',
            createdBy: 'Hazel',
            categoryIndex: 1
          }),
          itemId11: new Item({
            id: 'itemId11',
            name: 'Steak',
            createdBy: 'Colin',
            categoryIndex: 1
          })
        }
      }),
      new Category({
        name: 'Side Dishes'
      })
    ]
    potluk = new Potluk(potlukName, potlukDate, categories, potlukId)
    // offlineGracePeriodMs = 200

    component = <PotlukPage initialPotluk={potluk} initialUsername='' />
    componentRender = render(component)

    user = userEvent.setup({ delay: null })
  })

  afterEach(jest.resetAllMocks)

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(componentRender).toBeTruthy()
  })

  it('should have heading with Potluk name', () => {
    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(potlukName)
  })

  it('should show Potluk date formatted like "DayOfWeek, Month Date, Year"', () => {
    const date = screen.getByText(potlukDatePretty)
    expect(date).toBeInTheDocument()
  })

  it('should have login area', () => {
    const loginField: HTMLInputElement = screen.getByRole('textbox')
    const loginButton = screen.getByRole('button', { name: /Log In/i })

    expect(loginField).toBeInTheDocument()
    expect(loginField.placeholder).toBe('Enter your name to edit')
    expect(loginButton).toBeInTheDocument()
  })

  it('should NOT have a logout button', () => {
    const logoutButton = screen.queryByRole('button', { name: /Log Out/i })
    expect(logoutButton).not.toBeInTheDocument()
  })

  it('should have name of each category', () => {
    categories.forEach(c =>
      expect(screen.getByText(c.name)).toBeInTheDocument()
    )
  })

  it('should have name of each item', () => {
    categories.forEach(c =>
      Object.values(c.items).forEach(i =>
        expect(screen.getByText(i.name)).toBeInTheDocument()
      )
    )
  })

  it('should have bottom buttons', () => {
    const buttons = screen.getAllByRole('button')
    const bottomButtons = ['Share List', 'Share Link', 'QR Code']

    bottomButtons.forEach(bb =>
      expect(buttons.some(b =>
        b.innerText === bb
      ))
    )
  })

  describe('when logging in', () => {
    let username: string
    let loginField: HTMLInputElement

    beforeEach(async () => {
      username = 'Colin'
      loginField = screen.getByRole('textbox')
      const loginButton = screen.getByRole('button', { name: /Log In/i })

      await user.type(loginField, username)
      await user.click(loginButton)
    })

    it('should no longer show the login field or login button', () => {
      const loginButton = screen.queryByRole('button', { name: /Log In/i })
      expect(loginField).not.toBeInTheDocument()
      expect(loginButton).not.toBeInTheDocument()
    })

    it('should logout button', () => {
      const logoutButton = screen.getByRole('button', { name: /Log Out/i })
      expect(logoutButton).toBeInTheDocument()
    })
  })
})
