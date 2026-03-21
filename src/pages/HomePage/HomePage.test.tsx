import { describe, expect, it, beforeEach } from 'vitest'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/preact'
import { generateKeyBetween } from 'fractional-indexing'
import { nanoid } from 'nanoid'
import { entriesTable, db } from 'src/services/db'
import { Entry } from 'src/services/types'
import ThemeProvider from 'src/providers/ThemeProvider'
import DialogsProvider from 'src/providers/DialogsProvider'
import SettingsProvider from 'src/providers/SettingsProvider'
import StoreProvider from 'src/providers/StoreProvider'
import HomePage from './HomePage'

const seedDb = async () => {
  let prevOrder: string | null = null
  const entries: Entry[] = []
  for (let i = 0; i < 10; i++) {
    const entry: Entry = {
      id: nanoid(),
      createdAt: Date.now(),
      displayOrder: generateKeyBetween(prevOrder, null),
      type: 'kcalPer100g',
      name: `Article ${i}`,
      kcal: 100,
      total: 100,
      discard: false,
      hide: false
    }
    entries.push(entry)
    prevOrder = entry.displayOrder
  }
  await db.transaction('rw', entriesTable(), async () => {
    await entriesTable().clear()
    await entriesTable().bulkPut(entries)
  })
}

const renderHomePage = () => {
  render(
    <ThemeProvider>
      <DialogsProvider>
        <SettingsProvider>
          <StoreProvider>
            <HomePage />
          </StoreProvider>
        </SettingsProvider>
      </DialogsProvider>
    </ThemeProvider>
  )
}

describe('HomePage', () => {
  beforeEach(async () => {
    await seedDb()
    renderHomePage()
    await screen.findByDisplayValue('Article 0')
  })

  it('deletes all records', async () => {
    // clicks the "delete-all-entries" button and opens the modal confirmation
    const btn = screen.getByRole('button', { name: /delete-all-entries$/ })
    fireEvent.click(btn)
    const modal = await screen.findByRole('dialog')
    expect(modal).toBeInTheDocument()

    // clicks the accept button from the modal confirmation
    const acceptBtn = await screen.findByRole('button', { name: /accept$/ })
    fireEvent.click(acceptBtn)

    // verifies that there are no rows
    await waitFor(() => {
      // after deleting all records, there should be one empty record left
      const rows = screen
        .queryAllByRole('row')
        .filter((row) => row.closest('tbody'))
      expect(rows).toHaveLength(1)

      const row = rows[0]
      expect(within(row).getByRole('textbox')).toHaveValue('')
    })
  })
})
