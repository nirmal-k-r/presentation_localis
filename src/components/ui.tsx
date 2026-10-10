import type { CSSProperties, ReactNode } from 'react'
import { abs } from '../styles/type'
import { Reveal } from './Reveal'

export const mono = "'DM Mono', ui-monospace, monospace"

export type Tone = 'plain' | 'inset' | 'accent' | 'neg' | 'ok'
const TONE: Record<Tone, { bg: string; fg: string }> = {
  plain: { bg: 'var(--card)', fg: 'var(--ink)' },
  inset: { bg: 'var(--card2)', fg: 'var(--ink)' },
  accent: { bg: 'var(--cobalt)', fg: 'var(--on-accent)' },
  neg: { bg: 'color-mix(in srgb, var(--neg) 17%, var(--card))', fg: 'var(--ink)' },
  ok: { bg: 'color-mix(in srgb, var(--ok) 17%, var(--card))', fg: 'var(--ink)' },
}

/** A positioned, flat-filled card. One fill, no border, no shadow. */
export function Tile({ show = true, x, y, w, h, delay, tone = 'plain', pad = 36, top = false, children, style }: {
  show?: boolean; x: number; y: number; w: number; h: number; delay?: number; tone?: Tone; pad?: number; top?: boolean; children?: ReactNode; style?: CSSProperties
}) {
  const t = TONE[tone]
  return (
    <Reveal show={show} delay={delay} y={24} style={abs(x, y, { width: w, height: h })}>
      <div style={{ height: '100%', boxSizing: 'border-box', background: t.bg, color: t.fg, borderRadius: 26, padding: pad, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: top ? 'flex-start' : 'center', ...style }}>{children}</div>
    </Reveal>
  )
}

/** Card heading and body; both inherit the card's text colour. */
export function CT({ children, size = 38 }: { children: ReactNode; size?: number }) {
  return <div style={{ fontSize: size, fontWeight: 650, letterSpacing: '-0.02em', lineHeight: 1.12 }}>{children}</div>
}
export function CB({ children, size = 27, mt = 12 }: { children: ReactNode; size?: number; mt?: number }) {
  return <div style={{ fontSize: size, lineHeight: 1.4, marginTop: mt, opacity: 0.78 }}>{children}</div>
}

/** Small mono text label. */
export function Tag({ children, color = 'var(--muted)', size = 20 }: { children: ReactNode; color?: string; size?: number }) {
  return <span style={{ fontFamily: mono, fontSize: size, color }}>{children}</span>
}

export function Stat({ value, label, size = 110, color }: { value: ReactNode; label: ReactNode; size?: number; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: size, fontWeight: 650, letterSpacing: '-0.045em', lineHeight: 1, color }}>{value}</div>
      <div style={{ fontSize: 28, marginTop: 14, lineHeight: 1.3, opacity: 0.78 }}>{label}</div>
    </div>
  )
}
