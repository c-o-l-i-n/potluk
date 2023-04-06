import React, { ReactElement } from 'react'
import { RenderResult, act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup'
import PotlukPage from '../components/PotlukPage'
import Potluk from '../types/potluk'
import Category from '../types/category'
import Item from '../types/item'
import ItemEvent, { ItemEventListener, ItemEventType } from '../types/itemEvent'
import FirebaseService from '../services/firebase'
import SharingService from '../services/sharing'

jest.mock('../services/sharing')
jest.mock('../services/firebase', () => ({
  subscribeToUpdates: mockSubscribeToUpdates,
  addItemToDatabase: (potlukId: string, item: Item) => triggerAddBlankEvent(potlukId, item),
  deleteItemFromDatabase: jest.fn()
}))

let triggerAddEvent: () => void
let triggerChangeEvent: () => void
let triggerDeleteEvent: () => void
let triggerConnectEvent: () => void
let triggerDisconnectEvent: () => void
let triggerAddBlankEvent: (potlukId: string, item: Item) => void

const mockAddEvent: ItemEvent = {
  type: ItemEventType.ADD,
  categoryIndex: 0,
  itemId: 'newItem',
  itemDatabaseEntry: {
    n: 'New Item',
    c: 'Molly',
    b: null
  }
}

const mockChangeEvent: ItemEvent = {
  type: ItemEventType.CHANGE,
  categoryIndex: 0,
  itemId: 'newItem',
  itemDatabaseEntry: {
    n: 'Changed Item',
    c: 'Molly',
    b: null
  }
}

const mockDeleteEvent: ItemEvent = {
  type: ItemEventType.DELETE,
  categoryIndex: 0,
  itemId: 'newItem',
  itemDatabaseEntry: {
    n: 'Changed Item',
    c: 'Molly',
    b: null
  }
}

const mockAddBlankEvent = (username: string): ItemEvent => ({
  type: ItemEventType.ADD,
  categoryIndex: 0,
  itemId: 'newBlankItem',
  itemDatabaseEntry: {
    n: '',
    c: username,
    b: null
  }
})

function mockSubscribeToUpdates (
  potlukId: string,
  numberOfCategories: number,
  onAdd: ItemEventListener = console.log,
  onChange: ItemEventListener = console.log,
  onDelete: ItemEventListener = console.log,
  onConnectedStatusChange: (connected: boolean) => unknown
): () => void {
  triggerAddEvent = () => onAdd(mockAddEvent)
  triggerChangeEvent = () => onChange(mockChangeEvent)
  triggerDeleteEvent = () => onDelete(mockDeleteEvent)
  triggerConnectEvent = () => onConnectedStatusChange(true)
  triggerDisconnectEvent = () => onConnectedStatusChange(false)

  triggerAddBlankEvent = (potlukId: string, item: Item) => onAdd(mockAddBlankEvent(item.createdBy))

  return () => { }
}

describe('PotlukPage', () => {
  let potlukId: string
  let potlukName: string
  let potlukDate: Date
  let potlukDatePretty: string
  let categories: Category[]
  let potluk: Potluk
  let domain: string
  let href: string
  let component: ReactElement
  let componentRender: RenderResult
  let user: UserEvent

  beforeEach(() => {
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

    domain = 'potl.uk'
    href = `https://${domain}/${potlukId}`
    // @ts-expect-error
    delete window.location
    // @ts-expect-error
    window.location = { href }

    component = <PotlukPage initialPotluk={potluk} initialUsername='' />
    componentRender = render(component)

    user = userEvent.setup({ delay: null })

    // silence expected console.logs
    jest.spyOn(console, 'log').mockImplementation()
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
    const loginButton = screen.getByRole('button', { name: 'Log In' })

    expect(loginField).toBeInTheDocument()
    expect(loginField.placeholder).toBe('Enter your name to edit')
    expect(loginButton).toBeInTheDocument()
  })

  it('should NOT have a logout button', () => {
    const logoutButton = screen.queryByRole('button', { name: 'Log Out' })
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

  it('should share list', async () => {
    const shareListButton = screen.getByRole('button', { name: 'Share List' })
    jest.spyOn(SharingService, 'shareLink')
    const expectedList = `👉 ${potlukName}
🗓 ${potlukDatePretty}
🔗 ${domain}/${potlukId}

APPETIZERS
🔲 Cheese Ball (Up for grabs)
🔲 Nachos (Up for grabs)

MAIN DISHES
🔲 Pizza (Up for grabs)
🔲 Steak (Up for grabs)

SIDE DISHES
(nothing yet)
`

    await user.click(shareListButton)

    expect(SharingService.shareText).toHaveBeenCalledTimes(1)
    expect(SharingService.shareText).toHaveBeenCalledWith(expectedList)
  })

  it('should share link', async () => {
    const shareLinkButton = screen.getByRole('button', { name: 'Share Link' })
    jest.spyOn(SharingService, 'shareLink')

    await user.click(shareLinkButton)

    expect(SharingService.shareLink).toHaveBeenCalledTimes(1)
    expect(SharingService.shareLink).toHaveBeenCalledWith(potlukName, href)
  })

  describe('QR code', () => {
    beforeEach(async () => {
      const qrCodeButton = screen.getByRole('button', { name: 'QR Code' })
      await user.click(qrCodeButton)
    })

    it('should show QR code', () => {
      const qrCode = screen.getByTestId('qr-code')
      expect(qrCode).toBeInTheDocument()
    })

    it('should NOT show QR code after closing QR code overlay', async () => {
      const closeButton = screen.getByRole('button', { name: 'close' })
      const qrCode = screen.queryByTestId('qr-code')

      await user.click(closeButton)

      expect(qrCode).not.toBeInTheDocument()
    })
  })

  describe('firebase events', () => {
    describe('after disconnect', () => {
      let offlineGracePeriodMs: number

      beforeAll(() => jest.useFakeTimers())

      beforeEach(() => {
        offlineGracePeriodMs = 200

        window.matchMedia = (() => { }) as any
        jest.spyOn(window, 'matchMedia').mockImplementation()

        // always connects on startup
        act(triggerConnectEvent)

        // disconnect for tests
        act(triggerDisconnectEvent)
      })

      afterEach(() => {
        act(jest.runAllTimers)
      })

      it('should NOT show disconnected toast right away', () => {
        const disconnectedToast = screen.queryByText("You're offline")
        expect(disconnectedToast).not.toBeInTheDocument()
      })

      describe('after reconnect within grace period', () => {
        beforeEach(() => {
          act(() => {
            jest.advanceTimersByTime(100)
            triggerConnectEvent()
            jest.advanceTimersByTime(1000)
          })
        })

        it('should NOT show reconnected toast', () => {
          const reconnected = screen.queryByText("You're back online!")
          expect(reconnected).not.toBeInTheDocument()
        })

        it('should NOT show disconnected toast', () => {
          const disconnectedToast = screen.queryByText("You're offline")
          expect(disconnectedToast).not.toBeInTheDocument()
        })
      })

      describe('after stays disconnected longer than grace period', () => {
        beforeEach(() => {
          act(() => jest.advanceTimersByTime(offlineGracePeriodMs))
        })

        it('should show disconnected toast', () => {
          const disconnectedToast = screen.getByText("You're offline")
          expect(disconnectedToast).toBeInTheDocument()
        })

        describe('after reconnects', () => {
          beforeEach(() => act(triggerConnectEvent))

          it('should show reconnected toast', () => {
            const reconnected = screen.getByText("You're back online!")
            expect(reconnected).toBeInTheDocument()
          })
        })
      })
    })

    describe('after item added', () => {
      beforeEach(() => {
        act(triggerAddEvent)
      })

      it('should add new item', () => {
        const newItem = screen.getByText(mockAddEvent.itemDatabaseEntry.n)
        expect(newItem).toBeInTheDocument()
      })

      describe('after item changed', () => {
        beforeEach(() => {
          act(triggerChangeEvent)
        })

        it('should change new item', () => {
          const newItem = screen.queryByText(mockAddEvent.itemDatabaseEntry.n)
          const changedItem = screen.getByText(mockChangeEvent.itemDatabaseEntry.n)
          expect(newItem).not.toBeInTheDocument()
          expect(changedItem).toBeInTheDocument()
        })

        describe('after item deleted', () => {
          beforeEach(() => {
            act(triggerDeleteEvent)
          })

          it('should delete new item', () => {
            const deletedItem = screen.queryByText(mockDeleteEvent.itemDatabaseEntry.n)
            expect(deletedItem).not.toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('after logging in', () => {
    let username: string
    let loginField: HTMLInputElement

    beforeEach(async () => {
      username = 'Colin'
      loginField = screen.getByRole('textbox')
      const loginButton = screen.getByRole('button', { name: 'Log In' })

      await user.type(loginField, username)
      await user.click(loginButton)
    })

    it('should no longer show the login field or login button', () => {
      const loginButton = screen.queryByRole('button', { name: 'Log In' })
      expect(loginField).not.toBeInTheDocument()
      expect(loginButton).not.toBeInTheDocument()
    })

    it('should show logout button and username', () => {
      const logoutButton = screen.getByRole('button', { name: 'Log Out' })
      const usernameText = screen.getByText(username)
      expect(logoutButton).toBeInTheDocument()
      expect(usernameText).toBeInTheDocument()
    })

    it('should have inputs for each item created by user', () => {
      const itemsCreatedByUser = categories.map(c =>
        Object.values(c.items).filter(i => i.createdBy === username)
      ).reduce((prev, next) => prev.concat(next))

      itemsCreatedByUser.forEach(i => {
        expect(screen.getByDisplayValue(i.name)).toBeInTheDocument()
        expect(screen.queryByText(i.name)).not.toBeInTheDocument()
      })
    })

    it('should have plain text for each item NOT created by user', () => {
      const itemsNotCreatedByUser = categories.map(c =>
        Object.values(c.items).filter(i => i.createdBy !== username)
      ).reduce((prev, next) => prev.concat(next))

      itemsNotCreatedByUser.forEach(i => {
        expect(screen.queryByDisplayValue(i.name)).not.toBeInTheDocument()
        expect(screen.getByText(i.name)).toBeInTheDocument()
      })
    })

    describe('after adding blank item and logging out', () => {
      beforeEach(async () => {
        jest.spyOn(FirebaseService, 'deleteItemFromDatabase')

        const addButton = screen.getAllByRole('button', { name: 'add' })[0]
        const logoutButton = screen.getByRole('button', { name: 'Log Out' })

        await user.click(addButton)
        await user.click(logoutButton)
      })

      it('should have login area', () => {
        const loginField: HTMLInputElement = screen.getByRole('textbox')
        const loginButton = screen.getByRole('button', { name: 'Log In' })

        expect(loginField).toBeInTheDocument()
        expect(loginField.placeholder).toBe('Enter your name to edit')
        expect(loginButton).toBeInTheDocument()
      })

      it('should NOT have a logout button or username', () => {
        const logoutButton = screen.queryByRole('button', { name: 'Log Out' })
        const usernameText = screen.queryByText(username)
        expect(logoutButton).not.toBeInTheDocument()
        expect(usernameText).not.toBeInTheDocument()
      })

      it('should delete blank item', () => {
        const { itemId, categoryIndex, itemDatabaseEntry } = mockAddBlankEvent(username)

        expect(FirebaseService.deleteItemFromDatabase).toHaveBeenCalledTimes(1)
        expect(FirebaseService.deleteItemFromDatabase).toHaveBeenCalledWith(potlukId, Item.createFromDatabaseEntry(itemId, categoryIndex, itemDatabaseEntry))
      })
    })
  })
})
