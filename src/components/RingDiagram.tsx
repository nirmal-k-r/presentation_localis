import { useEnv } from '../engine/motion'
import { mono } from './ui'

const P: [number, number][] = [[450, 150], [150, 490], [750, 490]]
const LINKS: [number, number][] = [[0, 1], [1, 2], [2, 0]]

export interface RingProps {
  labels?: string[]
  sub?: string[]
  /** 0..1 memory fill per node */
  mem?: number[]
  memColor?: string[]
  /** none: still, ring: token packets circle A->B->C, storm: frantic broadcast on every link */
  flow?: 'none' | 'ring' | 'storm'
  /** index of a node shown dead (red, dimmed) */
  dead?: number
  /** hide the link with this index (0 A-B, 1 B-C, 2 C-A) */
  cut?: number
  /** 0..1 tint towards red */
  heat?: number
  linksVisible?: boolean
}

function Packet({ pts, dur, color, delay = 0, r = 11 }: { pts: [number, number][]; dur: number; color: string; delay?: number; r?: number }) {
  const { mode, reduced } = useEnv()
  if (mode === 'print' || reduced) return <circle cx={(pts[0][0] + pts[1][0]) / 2} cy={(pts[0][1] + pts[1][1]) / 2} r={r} fill={color} stroke="var(--card)" strokeWidth={4} />
  const common = { dur: `${dur}s`, begin: `${delay}s`, repeatCount: 'indefinite' }
  return (
    <circle r={r} fill={color} stroke="var(--card)" strokeWidth={4} cx={pts[0][0]} cy={pts[0][1]}>
      <animate attributeName="cx" values={pts.map((p) => p[0]).join(';')} {...common} />
      <animate attributeName="cy" values={pts.map((p) => p[1]).join(';')} {...common} />
    </circle>
  )
}

export function RingDiagram({ labels = ['Mac mini 1', 'Mac mini 2', 'Mac mini 3'], sub, mem, memColor, flow = 'none', dead, cut, heat = 0, linksVisible = true }: RingProps) {
  const hot = `color-mix(in srgb, var(--neg) ${Math.round(heat * 100)}%, var(--card2))`
  return (
    <svg viewBox="0 52 900 540" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {linksVisible &&
        LINKS.map(([a, b], i) =>
          cut === i ? null : (
            <line key={i} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} stroke={flow === 'storm' ? 'var(--neg)' : 'var(--muted)'} strokeWidth={4} strokeLinecap="round" opacity={flow === 'storm' ? 0.6 : 0.45} />
          ),
        )}
      {flow === 'ring' && cut === undefined &&
        [0, 1, 2].map((k) => {
          return <Packet key={k} pts={[P[k % 3], P[(k + 1) % 3], P[(k + 2) % 3], P[k % 3]]} dur={3.6} color="var(--cobalt)" />
        })}
      {flow === 'ring' && cut !== undefined && (() => {
        // one link is cut: traffic goes back and forth along the remaining two links
        const [a, z] = LINKS[cut]
        const order = [z, (z + 1) % 3, (z + 2) % 3]
        if (order[2] !== a) order.reverse()
        const path = [order[0], order[1], order[2], order[1], order[0]].map((n) => P[n])
        return [0, 1].map((k) => <Packet key={k} pts={path} dur={3.2} delay={k * 1.6} color="var(--cobalt)" />)
      })()}
      {flow === 'storm' &&
        LINKS.flatMap(([a, b], i) =>
          cut === i ? [] : [0, 1, 2].map((k) => <Packet key={`${i}-${k}`} pts={k % 2 ? [P[a], P[b], P[a]] : [P[b], P[a], P[b]]} dur={0.9 + k * 0.15} delay={k * 0.2} color="var(--neg)" r={9} />),
        )}
      {P.map(([x, y], i) => {
        const isDead = dead === i
        return (
          <g key={i} opacity={isDead ? 0.55 : 1}>
            <rect x={x - 140} y={y - 80} width={280} height={160} rx={26} fill={isDead ? 'color-mix(in srgb, var(--neg) 14%, var(--card2))' : heat > 0 ? hot : 'var(--card2)'} stroke={isDead || heat > 0.3 ? 'var(--neg)' : 'var(--line)'} strokeWidth={2.5} />
            <text x={x} y={y - 14} textAnchor="middle" fontSize={34} fontWeight={650} fill={heat > 0.3 ? '#fff' : 'var(--ink)'}>{labels[i]}</text>
            {sub?.[i] && <text x={x} y={y + 24} textAnchor="middle" fontSize={heat > 0.3 ? 36 : 23} fontWeight={heat > 0.3 ? 600 : 400} fontFamily={mono} fill={heat > 0.3 ? '#fff' : 'var(--muted)'}>{sub[i]}</text>}
            {mem && (
              <g>
                <rect x={x - 100} y={y + 48} width={200} height={12} rx={6} fill="var(--line)" />
                <rect x={x - 100} y={y + 48} width={200 * Math.min(1, mem[i])} height={12} rx={6} fill={memColor?.[i] ?? 'var(--cobalt)'} style={{ transition: 'width .8s ease, fill .6s ease' }} />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
