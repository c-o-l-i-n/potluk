import React, { ReactElement } from 'react'
import * as NextRouterModule from 'next/router'
import * as Formspree from '@formspree/react'
import { RenderResult, render, screen, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import Feedback from '../pages/feedback'
import { NextRouter } from 'next/router'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))
jest.mock('@formspree/react')

describe('Feedback Page', () => {
  let useForm: [{ succeeded: boolean, submitting: boolean }, () => void]
  let component: ReactElement
  let componentRender: RenderResult
  let user: UserEvent
  let msItTakesToSubmit: number

  beforeEach(() => {
    jest.useFakeTimers()

    msItTakesToSubmit = 100

    useForm = [
      {
        succeeded: false,
        submitting: false
      },
      () => {
        useForm[0].submitting = true
        setTimeout(() => {
          useForm[0].submitting = false
          useForm[0].succeeded = true
        }, msItTakesToSubmit)
      }
    ]

    jest.spyOn(Formspree, 'useForm').mockReturnValue(useForm as any)

    component = <Feedback />
    componentRender = render(component)

    user = userEvent.setup({ delay: null })
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(componentRender).toBeTruthy()
  })

  it('should have "submit feedback" heading', () => {
    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent('Submit Feedback')
  })

  describe('fields', () => {
    let fields: HTMLElement[]

    beforeEach(() => {
      fields = screen.getAllByRole('textbox')
    })

    it('should have proper "name" field', () => {
      const nameField = fields.find(field => (field as HTMLInputElement).name === 'name') as HTMLInputElement

      expect(nameField).toBeInTheDocument()
      expect(nameField.type).toEqual('text')
      expect(nameField.required).toBe(false)
    })

    it('should have proper "email" field', () => {
      const emailField = fields.find(field => (field as HTMLInputElement).name === 'email') as HTMLInputElement

      expect(emailField).toBeInTheDocument()
      expect(emailField.type).toEqual('email')
      expect(emailField.required).toBe(false)
    })

    it('should have proper "feedback" field', () => {
      const feedbackField = fields.find(field => (field as HTMLTextAreaElement).name === 'feedback') as HTMLTextAreaElement

      expect(feedbackField).toBeInTheDocument()
      expect(feedbackField.required).toBe(true)
    })
  })

  it('should have a "submit" button', () => {
    const submitButton = screen.queryByRole('button') as HTMLButtonElement

    expect(submitButton).toBeInTheDocument()
    expect(submitButton.type).toEqual('submit')
    expect(submitButton.textContent).toEqual('Submit')
  })

  describe('after initiate submit', () => {
    let router: NextRouter

    beforeEach(() => {
      const form = screen.getByRole('form')

      // submit form
      fireEvent.submit(form)

      // rerender
      cleanup()
      componentRender = render(component)
    })

    it('should show a loading animation in the submit button', () => {
      const submitButton = screen.queryByRole('button') as HTMLButtonElement

      expect(submitButton.classList.contains('is-loading')).toBe(true)
    })

    describe('after finshed submit', () => {
      beforeEach(() => {
        jest.advanceTimersByTime(msItTakesToSubmit)

        router = { back: () => {} } as any
        jest.spyOn(router, 'back')
        jest.spyOn(NextRouterModule, 'useRouter').mockReturnValue(router)

        // rerender
        cleanup()
        componentRender = render(component)
      })

      it('should have a "thank you for your feedback!" heading', () => {
        const heading = screen.getByRole('heading')
        expect(heading.textContent).toEqual('Thank you for your feedback!')
      })

      it('should have a "back" button', () => {
        const backButton = screen.getByRole('button')
        expect(backButton.textContent).toEqual('Back')
      })

      it('should go back on "back" button click', async () => {
        const backButton = screen.getByRole('button')

        await user.click(backButton)

        expect(router.back).toBeCalledTimes(1)
      })
    })
  })
})
