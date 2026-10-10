import type { CSSProperties } from 'react'
import { Reveal } from './Reveal'

/** A screenshot with rounded corners and a hairline outline. Position and width come from `style`. */
export function Shot({ src, show, style, delay = 0, alt = '' }: { src: string; show: boolean; style?: CSSProperties; delay?: number; alt?: string }) {
  return (
    <Reveal show={show} delay={delay} y={24} style={style}>
      <img src={src} alt={alt} style={{ display: 'block', width: '100%', borderRadius: 16, boxShadow: '0 0 0 1px rgba(128, 138, 160, 0.28)' }} />
    </Reveal>
  )
}
