import React, { useEffect, useRef, useState } from 'react'

export function useInView(once = true) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          if (once) io.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  return { ref, visible }
}

export function Reveal({ children, delay = 0, className = '' }) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  )
}

export function Counter({ to, suffix = '', prefix = '', decimals = 0 }) {
  const { ref, visible } = useInView()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!visible || to == null) return
    const duration = 1400
    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setN(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, to])

  return (
    <span ref={ref}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  )
}
