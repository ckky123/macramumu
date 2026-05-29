import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled and shows spinner when isLoading', () => {
    render(<Button isLoading>Click</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Click</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('renders left icon', () => {
    render(<Button leftIcon={<span data-testid="icon" />}>Click</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders right icon', () => {
    render(<Button rightIcon={<span data-testid="icon" />}>Click</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('does not render right icon when loading', () => {
    render(<Button isLoading rightIcon={<span data-testid="icon" />}>Click</Button>)
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })
})
