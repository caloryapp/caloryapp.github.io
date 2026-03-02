import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/preact'

describe('Vitest setup', () => {
  it('renders a Preact component in jsdom', () => {
    render(<p>Vitest is working</p>)

    const element = screen.getByText('Vitest is working')
    expect(element.textContent).toBe('Vitest is working')
  })
})
