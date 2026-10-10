import { abs } from '../styles/type'
import { Reveal } from './Reveal'
import pymug from '../assets/logo-pymug.png'
import cf from '../assets/logo-cf.png'

function Lockup({ src, name, round }: { src: string; name: string; round?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <img src={src} alt="" style={{ width: 64, height: 64, borderRadius: round ? 32 : 16, display: 'block' }} />
      <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em' }}>{name}</div>
    </div>
  )
}

/** The two logos: the user group and the venue sponsor. */
export function Brands({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <Reveal show delay={delay} style={abs(x, y, { display: 'flex', alignItems: 'center', gap: 36 })}>
      <Lockup src={pymug} name="PyMUG" />
      <div style={{ width: 2, height: 44, background: 'var(--line)' }} />
      <Lockup src={cf} name="CoderFaculty" />
    </Reveal>
  )
}
