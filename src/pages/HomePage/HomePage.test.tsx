import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { generateKeyBetween } from 'fractional-indexing'
import { nanoid } from 'nanoid'
import { entriesTable } from 'src/services/db'
import { Entry } from 'src/services/types'
import ThemeProvider from 'src/providers/ThemeProvider'
import DialogsProvider from 'src/providers/DialogsProvider'
import SettingsProvider from 'src/providers/SettingsProvider'
import StoreProvider from 'src/providers/StoreProvider'
import { Row, sectionWithIngredients, collapsedSectionWithIngredients } from './HomePage.mock'
import HomePage from './HomePage'

// mocked libraries
vi.mock('src/libs/mq.ts')
import { useIsMobile, useIsTablet } from 'src/libs/mq'

const saveEntries = async (rows: Row[]) => {
  const entries: Entry[] = []
  let prevOrder: string | null = null
  for (const row of rows) {
    const entry: Entry = {
      id: nanoid(),
      createdAt: Date.now(),
      displayOrder: generateKeyBetween(prevOrder, null),
      type: row.type,
      name: row.name,
      discard: false,
      hide: row.type == 'section' ? false : !!row.hide,
      kcal: row.type == 'section' ? NaN : row.kcal,
      total: row.type == 'section' ? NaN : row.total
    }
    entries.push(entry)
    prevOrder = entry.displayOrder
  }
  await entriesTable().bulkPut(entries)
}

const findRow = async (finder: () => Promise<HTMLElement>) => {
  const elem = await finder()
  const row = elem.closest('tr')
  expect(row).not.toBeNull()
  return row!
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

// clean the database before any test
beforeEach(async () => {
  await entriesTable().clear()
})

// test mobile version only
describe("HomePage ('mobile' only)", () => {
  beforeEach(() => {
    vi.mocked(useIsMobile).mockReturnValue(true)
  })

  it('shows narrow-screen message', async () => {
    renderHomePage()
    await screen.findByText(/narrow-screen$/)
  })
})

// test tablet version only
describe("HomePage ('tablet' only)", () => {
  beforeEach(async () => {
    vi.mocked(useIsMobile).mockReturnValue(false)
    vi.mocked(useIsTablet).mockReturnValue(true)
  })

  it('shows an actions menu when clicking the entry actions button', async () => {
    renderHomePage()

    const user = userEvent.setup()
    expect(screen.queryByRole('menu', { name: /entry-actions$/ })).not.toBeInTheDocument()
    const row = await findRow(() => screen.findByPlaceholderText(/section-name$/))
    const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
    await user.click(menuBtn)
    screen.getByRole('menu', { name: /entry-actions$/ })
  })
})

// test both small and large tablet versions
describe.each([
  { label: 'tablet', isTablet: true },
  { label: 'desktop', isTablet: false }
])('HomePage ($label)', ({ isTablet }) => {
  beforeEach(() => {
    vi.mocked(useIsMobile).mockReturnValue(false)
    vi.mocked(useIsTablet).mockReturnValue(isTablet)
  })

  it('shows a default section onload', async () => {
    renderHomePage()
    await screen.findByPlaceholderText(/section-name$/)
  })

  it('shows a default section when clearing the table', async () => {
    await saveEntries(sectionWithIngredients)
    renderHomePage()

    const user = userEvent.setup()
    await screen.findByDisplayValue('Breakfast')
    const clearBtn = await screen.findByRole('button', { name: /delete-all-entries$/ })
    await user.click(clearBtn)
    const dialog = await screen.findByRole('dialog')
    const acceptBtn = await within(dialog).findByRole('button', { name: /accept$/ })
    await user.click(acceptBtn)
    await waitFor(() => {
      const section = screen.getByPlaceholderText(/section-name$/)
      expect(section).toHaveValue('')
    })
  })

  describe('when deleting a collapsed section', () => {
    beforeEach(async () => {
      await saveEntries(collapsedSectionWithIngredients)
      renderHomePage()
    })

    it('shows a confirmation dialog', async () => {
      const user = userEvent.setup()
      const row = await findRow(() => screen.findByDisplayValue('Breakfast'))
      if (isTablet) {
        const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
        await user.click(menuBtn)
      }
      const removeBtn = within(row).getByRole('button', { name: /remove-entry$/ })
      await user.click(removeBtn)
      await screen.findByRole('dialog')
    })

    it('removes the section and their ingredients when confirming the deletion', async () => {
      const user = userEvent.setup()
      const row = await findRow(() => screen.findByDisplayValue('Breakfast'))
      if (isTablet) {
        const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
        await user.click(menuBtn)
      }
      const removeBtn = within(row).getByRole('button', { name: /remove-entry$/ })
      await user.click(removeBtn)
      const dialog = await screen.findByRole('dialog')
      const acceptBtn = await within(dialog).findByRole('button', { name: /accept$/ })
      await user.click(acceptBtn)
      await waitFor(() => expect(row).not.toBeInTheDocument())
      await expect.poll(() => entriesTable().count()).toBe(0)
    })

    it('keeps the section and their ingredients when cancelling the deletion', async () => {
      const user = userEvent.setup()
      const row = await findRow(() => screen.findByDisplayValue('Breakfast'))
      if (isTablet) {
        const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
        await user.click(menuBtn)
      }
      const removeBtn = within(row).getByRole('button', { name: /remove-entry$/ })
      await user.click(removeBtn)
      const dialog = await screen.findByRole('dialog')
      const cancelBtn = await within(dialog).findByRole('button', { name: /cancel$/ })
      await user.click(cancelBtn)
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(row).toBeInTheDocument()
    })
  })

  it('deletes an expanded section when clicking the delete button', async () => {
    await saveEntries(sectionWithIngredients)
    renderHomePage()

    const user = userEvent.setup()
    const row = await findRow(() => screen.findByDisplayValue('Breakfast'))
    if (isTablet) {
      const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
      await user.click(menuBtn)
    }
    const removeBtn = within(row).getByRole('button', { name: /remove-entry$/ })
    await user.click(removeBtn)
    await waitFor(() => expect(row).not.toBeInTheDocument())
  })

  it('deletes an ingredient when clicking the delete button', async () => {
    await saveEntries(sectionWithIngredients)
    renderHomePage()

    const user = userEvent.setup()
    const row = await findRow(() => screen.findByDisplayValue('Margarine'))
    if (isTablet) {
      const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
      await user.click(menuBtn)
    }
    const removeBtn = within(row).getByRole('button', { name: /remove-entry$/ })
    await user.click(removeBtn)
    await waitFor(() => expect(row).not.toBeInTheDocument())
  })

  it('adds an entry after the current row when clicking the add entry button', async () => {
    await saveEntries(sectionWithIngredients)
    renderHomePage()

    const user = userEvent.setup()
    const row = await findRow(() => screen.findByDisplayValue('Margarine'))
    if (isTablet) {
      const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
      await user.click(menuBtn)
    }
    const addBtn = within(row).getByRole('button', { name: /add-entry$/ })
    await user.click(addBtn)

    await waitFor(() => {
      const items = screen.getAllByPlaceholderText(/entry-name$/) as HTMLInputElement[]
      const item = items.find((item) => item.value == '')
      expect(item).toBeDefined()
      const newRow = item?.closest('tr')
      expect(row.nextElementSibling).toBe(newRow)
    })
  })

  it('adds a section after the current row when clicking the add section button', async () => {
    await saveEntries(sectionWithIngredients)
    renderHomePage()

    const user = userEvent.setup()
    const row = await findRow(() => screen.findByDisplayValue('Margarine'))
    if (isTablet) {
      const menuBtn = within(row).getByRole('button', { name: /entry-actions$/ })
      await user.click(menuBtn)
    }
    const addBtn = within(row).getByRole('button', { name: /add-section$/ })
    await user.click(addBtn)

    await waitFor(() => {
      const items = screen.getAllByPlaceholderText(/section-name$/) as HTMLInputElement[]
      const item = items.find((item) => item.value == '')
      expect(item).toBeDefined()
      const newRow = item?.closest('tr')
      expect(row.nextElementSibling).toBe(newRow)
    })
  })

  it('closes an open section when clicking the toggle section button', async () => {
    await saveEntries(sectionWithIngredients)
    renderHomePage()

    const user = userEvent.setup()
    const row = await findRow(() => screen.findByDisplayValue('Breakfast'))
    const toggleBtn = await within(row).findByRole('button', { name: /toggle-section$/ })
    const items = await screen.findAllByPlaceholderText(/entry-name$/)
    expect(items.length).toBe(sectionWithIngredients.length - 1)
    await user.click(toggleBtn)
    await waitFor(() => {
      const items = screen.queryAllByPlaceholderText(/entry-name$/)
      expect(items.length).toBe(0)
    })
  })

  it('opens a closed section when clicking the toggle section button', async () => {
    await saveEntries(collapsedSectionWithIngredients)
    renderHomePage()

    const user = userEvent.setup()
    const row = await findRow(() => screen.findByDisplayValue('Breakfast'))
    const toggleBtn = await within(row).findByRole('button', { name: /toggle-section$/ })
    expect(screen.queryByPlaceholderText(/entry-name$/)).not.toBeInTheDocument()
    await user.click(toggleBtn)
    const items = await screen.findAllByPlaceholderText(/entry-name$/)
    expect(items.length).toBe(collapsedSectionWithIngredients.length - 1)
  })
})
