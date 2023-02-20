import { ReactElement, useState } from 'react'
import CreateButton from '../components/CreateButton'
import Category from '../types/category'
import InputField from '../components/InputField'
import Potluk from '../types/potluk'
import router from 'next/router'
import CategoryRow from '../components/CategoryRow'
import AddButton from '../components/AddButton'
import BoxHeader from '../components/BoxHeader'
import Box from '../components/Box'
import Head from 'next/head'
import FirebaseService from '../services/firebase'
import { Toaster } from 'react-hot-toast'

const MAX_CATEGORIES = 8
const MAX_TITLE_LENGTH = 60

export default function New (): ReactElement {
  // default date is today in the format yyyy-mm-dd
  const [eventDateString, setEventDateString] = useState<string>(Potluk.formatEventDate)
  const [eventName, setEventName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>(() => [
    new Category({ name: 'Appetizers', key: '0' }),
    new Category({ name: 'Main Dishes', key: '1' }),
    new Category({ name: 'Side Dishes', key: '2' }),
    new Category({ name: 'Desserts', key: '3' }),
    new Category({ name: 'Drinks', key: '4' })
  ])
  const [isLoading, setIsLoading] = useState(false)

  const createButtonDisabled =
    eventName.trim() === '' ||
    eventDateString === '' ||
    categories.length === 0 ||
    categories.length > MAX_CATEGORIES ||
    !categories.every((c) => c.name !== '')

  const addCategory = (): void => {
    const category = new Category()
    setCategories([...categories, category])
  }

  const deleteCategory = (categoryIndex: number): void => {
    categories.splice(categoryIndex, 1)
    setCategories([...categories])
  }

  const createPotluk = async (): Promise<void> => {
    setIsLoading(true)

    const potluk = new Potluk(eventName, new Date(eventDateString + 'T00:00:00.000'), categories)

    try {
      await FirebaseService.createPotlukInDatabase(potluk)
    } catch (err) {
      setIsLoading(false)
      return
    }

    void router.push(`/${potluk.id}?u=${username}`)
  }

  return (
    <>
      <Head>
        <title>Create New Potluk</title>
      </Head>

      <InputField
        type='text'
        label='Event Name'
        placeholder='House Warming Party'
        onChange={setEventName}
        disabled={isLoading}
        maxLength={MAX_TITLE_LENGTH}
      />
      <InputField
        type='date'
        label='Event Date'
        onChange={setEventDateString}
        disabled={isLoading}
        defaultValue={eventDateString}
      />
      <InputField
        type='text'
        label='Your Name (Optional)'
        placeholder='Colin'
        onChange={setUsername}
        disabled={isLoading}
      />

      <br />

      <Box>
        <BoxHeader title='Categories' subtitle='The different courses or types of food' />

        {categories.map((category, index) => (
          <CategoryRow
            key={category.getKey()}
            category={category}
            onDelete={() => deleteCategory(index)}
            onChange={(name) => {
              category.name = name
              setCategories([...categories])
            }}
            disabled={isLoading}
          />
        ))}

        {
          categories.length < MAX_CATEGORIES
            ? <AddButton onClick={addCategory} disabled={isLoading} />
            : <></>
        }
      </Box>

      <div className='is-flex is-justify-content-center mb-3'>
        <CreateButton
          onClick={createPotluk}
          isLoading={isLoading}
          disabled={createButtonDisabled}
        />
      </div>

      <Toaster />
    </>
  )
}
