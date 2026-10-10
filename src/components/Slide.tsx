import type { ReactNode } from 'react'
import { T, abs } from '../styles/type'
import { Reveal } from './Reveal'

/** The seven parts of the talk. The progress bar on every slide shows where we are. */
export const PARTS = ['Why I started', 'The script', 'Three Macs, one model', 'The Python engine', 'The platform', 'Agents', 'Day to day']

export function Slide({ part, label, title, sub, children }: { part: number; label?: string; title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  const text = label ?? (part >= 0 && part < PARTS.length ? `${part + 1} of ${PARTS.length} · ${PARTS[part]}` : '')
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Reveal show style={abs(120, 56, { display: 'flex', alignItems: 'center', gap: 8 })}>
        {PARTS.map((p, i) => (
          <div key={p} style={{ width: 44, height: 6, borderRadius: 3, background: part >= PARTS.length || i === part ? 'var(--cobalt)' : i < part ? 'color-mix(in srgb, var(--cobalt) 45%, var(--line))' : 'var(--line)' }} />
        ))}
        <span style={{ marginLeft: 14, fontSize: 21, color: 'var(--muted)', fontWeight: 500 }}>{text}</span>
      </Reveal>
      <Reveal show delay={0.1} style={abs(120, 94, { ...T.h1s, width: 1680 })}>{title}</Reveal>
      {sub && <Reveal show delay={0.2} style={abs(120, 180, { fontSize: 29, color: 'var(--muted)', width: 1680, lineHeight: 1.3 })}>{sub}</Reveal>}
      {children}
    </div>
  )
}
