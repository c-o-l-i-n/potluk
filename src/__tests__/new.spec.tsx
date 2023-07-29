import { render, RenderResult, screen } from '@testing-library/react'
import router from 'next/router'
import { ReactElement } from 'react'
import New from '../pages/new'
import '@testing-library/jest-dom'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import userEvent from '@testing-library/user-event'
import Potluk from '../types/potluk'
import Category from '../types/category'
import UniqueID from '../types/uniqueId'
import FirebaseService from '../services/firebase'

jest.mock('../services/firebase')
jest.mock('firebase/app-check')
jest.mock('next/router', () => ({ push: jest.fn() }))

describe('New Page', () => {
  let dateString: string
  let now: Date
  let component: ReactElement
  let componentRender: RenderResult
  let defaultCategories: string[]
  let user: UserEvent

  const maxCategoriesAllowed = 8

  beforeEach(() => {
    dateString = '2023-01-01'
    now = new Date(dateString + 'T00:00:00.000')
    jest.useFakeTimers().setSystemTime(now)

    component = <New />
    componentRender = render(component)
    user = userEvent.setup({ delay: null })

    defaultCategories = [
      'Appetizers',
      'Main Dishes',
      'Side Dishes',
      'Desserts',
      'Drinks'
    ]
  })

  afterEach(jest.clearAllMocks)

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(componentRender).toBeTruthy()
  })

  it('should have blank "Event Name" field', () => {
    const eventNameField: HTMLInputElement = screen.getByLabelText('Event Name')
    expect(eventNameField).toBeInTheDocument()
    expect(eventNameField.type).toEqual('text')
    expect(eventNameField.value).toEqual('')
  })

  it('should have "Event Date" field that defaults to today\'s date', () => {
    const eventDateField: HTMLInputElement = screen.getByLabelText('Event Date')
    expect(eventDateField).toBeInTheDocument()
    expect(eventDateField.type).toEqual('date')
    expect(eventDateField.value).toEqual(dateString)
  })

  it('should have blank "Your Name (Optional)" field', () => {
    const yourNameField: HTMLInputElement = screen.getByLabelText('Your Name (Optional)')
    expect(yourNameField).toBeInTheDocument()
    expect(yourNameField.type).toEqual('text')
    expect(yourNameField.value).toEqual('')
  })

  it('should have "Create" button', () => {
    const createButton: HTMLButtonElement = screen.getByRole('button', {
      name: 'Create'
    })
    expect(createButton).toBeInTheDocument()
  })

  it('should start with default categories', () => {
    const categoryInputs: HTMLInputElement[] = screen.getAllByPlaceholderText('Category')

    expect(categoryInputs.length).toBe(defaultCategories.length)
    defaultCategories.forEach((c, i) => expect(categoryInputs[i].value).toEqual(c))
  })

  it('should delete a category on delete button click', async () => {
    const categoryToDelete = 'Side Dishes'
    const categoriesAfterDeletion: string[] = defaultCategories.filter(c => c !== categoryToDelete)

    const deleteButton = screen.getAllByRole('button', { name: 'delete' })[defaultCategories.indexOf(categoryToDelete)]

    await user.click(deleteButton)

    const categoryInputs: HTMLInputElement[] = screen.getAllByPlaceholderText('Category')

    expect(categoryInputs.length).toBe(categoriesAfterDeletion.length)
    categoriesAfterDeletion.forEach((c, i) => expect(categoryInputs[i].value).toEqual(c))
  })

  it('should add a category on add button click', async () => {
    const categoriesAfterAddition = [...defaultCategories, '']
    const addButton = screen.getByRole('button', { name: 'add' })

    await user.click(addButton)

    const categoryInputs: HTMLInputElement[] = screen.getAllByPlaceholderText('Category')

    expect(categoryInputs.length).toBe(categoriesAfterAddition.length)
    categoriesAfterAddition.forEach((c, i) => expect(categoryInputs[i].value).toEqual(c))
  })

  it('should only allow up to maximum categories', async () => {
    const addButton = screen.getByRole('button', { name: 'add' })

    for (let i = 0; i < maxCategoriesAllowed + 5; i++) {
      await user.click(addButton)
    }

    const categoryInputs: HTMLInputElement[] = screen.getAllByPlaceholderText('Category')

    expect(categoryInputs.length).toBe(maxCategoriesAllowed)
  })

  describe('"Create" button', () => {
    let createButton: HTMLButtonElement

    beforeEach(async () => {
      createButton = screen.getByRole('button', { name: 'Create' })

      // set up all requirements for "Create" button to be enabled
      const eventNameField: HTMLInputElement = screen.getByLabelText('Event Name')
      await user.type(eventNameField, 'My Event')
    })

    it('should be enabled when all requirements are met', () => {
      expect(createButton).not.toBeDisabled()
    })

    it('should be disabled when event name is blank', async () => {
      const eventNameField: HTMLInputElement = screen.getByLabelText('Event Name')

      await user.clear(eventNameField)
      await user.tab()

      expect(createButton).toBeDisabled()
    })

    it('should be disabled when date is blank', async () => {
      const eventDateField: HTMLInputElement = screen.getByLabelText('Event Date')

      await user.clear(eventDateField)
      await user.tab()

      expect(createButton).toBeDisabled()
    })

    it('should be disabled when all categories are deleted', async () => {
      const deleteButtons: HTMLButtonElement[] = screen.getAllByRole('button', { name: 'delete' })

      for (const deleteButton of deleteButtons) {
        await user.click(deleteButton)
      }

      expect(createButton).toBeDisabled()
    })

    it('should be disabled when every category is blank', async () => {
      const categoryInputs: HTMLInputElement[] = screen.getAllByPlaceholderText('Category')

      for (const categoryInput of categoryInputs) {
        await user.clear(categoryInput)
      }
      await user.tab()

      expect(createButton).toBeDisabled()
    })
  })

  describe('createPotluk', () => {
    let potlukId: string
    let usernameEncoded: string
    let expectedPotluk: Potluk
    let createPotlukInDatabaseSpy: jest.SpyInstance

    const setupTests = async (firebaseOperationShouldSucceed = true): Promise<void> => {
      const eventName = "Hazel's First Birthday"
      const eventDateString = '2023-05-20'
      const username = 'Hazel BoBazel'

      potlukId = 'PotlukID'
      usernameEncoded = encodeURIComponent(username)

      const categoryIndexToDelete = 0
      const categoryIndexToChange = 2
      const newNameForCategory = 'Cat Food'
      const newCategory = 'Cat Treats'

      const categoriesAfterEdits = [
        new Category({ name: defaultCategories[1] }),
        new Category({ name: newNameForCategory }),
        new Category({ name: defaultCategories[3] }),
        new Category({ name: defaultCategories[4] }),
        new Category({ name: newCategory })
      ]

      jest.spyOn(UniqueID, 'generateUniqueId').mockReturnValue(potlukId)

      if (firebaseOperationShouldSucceed) {
        createPotlukInDatabaseSpy = jest.spyOn(FirebaseService, 'createPotlukInDatabase').mockResolvedValue()
      } else {
        createPotlukInDatabaseSpy = jest.spyOn(FirebaseService, 'createPotlukInDatabase').mockRejectedValue('error')
      }

      expectedPotluk = new Potluk(eventName, new Date(eventDateString + 'T00:00:00.000'), categoriesAfterEdits, potlukId, now)

      const eventNameField: HTMLInputElement = screen.getByLabelText('Event Name')
      const eventDateField: HTMLInputElement = screen.getByLabelText('Event Date')
      const yourNameField: HTMLInputElement = screen.getByLabelText('Your Name (Optional)')
      const categoryInputToChange = screen.getAllByPlaceholderText('Category')[categoryIndexToChange]
      const deleteButton = screen.getAllByRole('button', { name: 'delete' })[categoryIndexToDelete]
      const addButton = screen.getAllByRole('button', { name: 'add' })[categoryIndexToDelete]
      const createButton = screen.getByRole('button', { name: 'Create' })

      // set event name
      await user.type(eventNameField, eventName)

      // set event date
      await user.clear(eventDateField)
      await user.type(eventDateField, eventDateString)

      // set your name
      await user.type(yourNameField, username)

      // change existing category name
      await user.clear(categoryInputToChange)
      await user.type(categoryInputToChange, newNameForCategory)

      // delete catgory
      await user.click(deleteButton)

      // add category
      await user.click(addButton)
      const newCategoryInput = screen.getAllByPlaceholderText('Category').at(-1) as HTMLInputElement
      await user.type(newCategoryInput, newCategory)
      await user.tab()

      // create
      await user.click(createButton)
    }

    describe('success', () => {
      beforeEach(setupTests)

      it('should create potluk using data entered by user', () => {
        expect(createPotlukInDatabaseSpy).toBeCalledTimes(1)
        expect(createPotlukInDatabaseSpy.mock.calls[0][0]).toEqual(expectedPotluk)
      })

      it('should navigate to main page and pass username as url param', () => {
        expect(router.push).toHaveBeenCalledTimes(1)
        expect(router.push).toHaveBeenCalledWith(`/${potlukId}?u=${usernameEncoded}`)
      })
    })

    describe('fail', () => {
      beforeEach(async () => await setupTests(false))

      it('should attempt to create potluk using data entered by user', () => {
        expect(createPotlukInDatabaseSpy).toBeCalledTimes(1)
        expect(createPotlukInDatabaseSpy.mock.calls[0][0]).toEqual(expectedPotluk)
      })

      it('should NOT navigate', () => {
        expect(router.push).not.toHaveBeenCalled()
      })
    })
  })
})
