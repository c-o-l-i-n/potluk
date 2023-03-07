import FirebaseService from '../services/firebase'
import { RenderResult, render, waitFor, screen } from '@testing-library/react'
import * as NextRouterModule from 'next/router'
import { NextRouter } from 'next/router'
import { ReactElement } from 'react'
import Main from '../pages/[id]'
import Potluk from '../types/potluk'
import '@testing-library/jest-dom'
import PotlukNotFoundError from '../types/errors/potlukNotFoundError'

jest.mock('../services/firebase')
jest.mock('firebase/app-check')

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

describe('[id] page', () => {
  let id: string
  let username: string
  let router: NextRouter
  let potluk: Potluk
  let component: ReactElement
  let componentRender: RenderResult

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    id = 'PotlukID'
    username = 'Colin'
    potluk = new Potluk('Test Potluk', new Date('2023-05-20'), [], id, new Date('2023-01-01'))
  })

  describe('happy path', () => {
    beforeEach(async () => {
      router = {
        isReady: true,
        asPath: `/${id}`,
        query: {
          id,
          u: username
        },
        replace: () => {}
      } as any

      jest.spyOn(NextRouterModule, 'useRouter').mockReturnValue(router)
      jest.spyOn(FirebaseService, 'getPotlukFromDatabase').mockResolvedValue(potluk)

      component = <Main />
      componentRender = render(component)

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
      })
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should render', () => {
      expect(componentRender).toBeTruthy()
    })

    it('should show potluk page', () => {
      const heading = screen.getByRole('heading')
      expect(heading.textContent).toEqual(potluk.name)
    })
  })

  describe('router not ready', () => {
    beforeEach(() => {
      router = {
        isReady: false
      } as any

      jest.spyOn(NextRouterModule, 'useRouter').mockReturnValue(router)

      component = <Main />
      componentRender = render(component)
    })

    it('should show skeleton page', () => {
      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    })
  })

  describe('potluk id is not string', () => {
    beforeEach(() => {
      router = {
        isReady: true,
        query: {
          id: 1234
        }
      } as any

      jest.spyOn(NextRouterModule, 'useRouter').mockReturnValue(router)

      component = <Main />
      componentRender = render(component)
    })

    it('should show unexpected error page', () => {
      const heading = screen.getByRole('heading')
      expect(heading.textContent).toEqual('Unexpected Error ;(')
    })
  })

  describe('firebase throws unexected error', () => {
    beforeEach(async () => {
      router = {
        isReady: true,
        asPath: `/${id}`,
        query: {
          id,
          u: username
        },
        replace: () => {}
      } as any

      jest.spyOn(NextRouterModule, 'useRouter').mockReturnValue(router)
      jest.spyOn(FirebaseService, 'getPotlukFromDatabase').mockRejectedValue(new Error())

      component = <Main />
      componentRender = render(component)

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
      })
    })

    it('should show unexpected error page', () => {
      const heading = screen.getByRole('heading')
      expect(heading.textContent).toEqual('Unexpected Error ;(')
    })
  })

  describe('potluk does not exist', () => {
    beforeEach(async () => {
      router = {
        isReady: true,
        asPath: `/${id}`,
        query: {
          id,
          u: username
        },
        replace: () => {}
      } as any

      jest.spyOn(NextRouterModule, 'useRouter').mockReturnValue(router)
      jest.spyOn(FirebaseService, 'getPotlukFromDatabase').mockRejectedValue(new PotlukNotFoundError(id))

      component = <Main />
      componentRender = render(component)

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
      })
    })

    it('should show unexpected error page', () => {
      const page = screen.getByTestId('not-found-page')
      expect(page).toBeInTheDocument()
    })
  })
})
