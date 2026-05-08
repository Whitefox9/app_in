import { useEffect } from 'react'

const rippleSelector = [
  '.primary',
  '.secondary-action',
  '.back-button',
  '.text-button',
  '.app-header-back',
  '.group-action',
  '.management-actions button',
  '.quick-actions button',
  '.report-mode-card',
].join(',')

export function useRipple() {
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Element)) return

      const button = target.closest<HTMLButtonElement>(rippleSelector)
      if (!button || button.disabled) return

      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const ripple = document.createElement('span')

      ripple.className = 'button-ripple'
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`

      button.querySelectorAll('.button-ripple').forEach((item) => item.remove())
      button.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])
}
