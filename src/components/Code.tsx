import { animate } from 'motion/react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useEnv } from '../engine/motion'
import { Reveal } from './Reveal'
import { mono } from './ui'

type Lang = 'py' | 'sh' | 'xml' | 'plain'
const C = { text: '#e6e9ef', comment: '#7d8798', string: '#7ee0b0', keyword: '#b9a8ff', number: '#f5c26b', fn: '#8aa2ff', flag: '#f5c26b', tag: '#8aa2ff' }

const RX: Record<Lang, RegExp> = {
  py: /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|\b(import|from|def|return|as|for|in|with|if|else|not|class|lambda|None|True|False)\b|(\b\d[\d_.]*\b)|\b([A-Za-z_]\w*)(?=\()/g,
  sh: /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\s--?[a-z][\w-]*)|(\b\d[\d_.]*\b)|\b(python|mlx_lm|mlx\.launch)\b/g,
  xml: /(<\/?[a-z_]+(?:=[A-Za-z_]+)?>)|("(?:[^"\\\n]|\\.)*")/g,
  plain: /$^/g,
}
// capture group index -> colour, per language
const COLORS: Record<Lang, (string | undefined)[]> = {
  py: [undefined, C.comment, C.string, C.keyword, C.number, C.fn],
  sh: [undefined, C.comment, C.string, C.flag, C.number, C.fn],
  xml: [undefined, C.tag, C.string],
  plain: [undefined],
}

interface Tok { text: string; color: string }
function tokenize(src: string, lang: Lang): Tok[] {
  const out: Tok[] = []
  let last = 0
  for (const m of src.matchAll(RX[lang])) {
    const i = m.index ?? 0
    if (i > last) out.push({ text: src.slice(last, i), color: C.text })
    const g = m.slice(1).findIndex((x) => x !== undefined) + 1
    out.push({ text: m[0], color: COLORS[lang][g] ?? C.text })
    last = i + m[0].length
  }
  if (last < src.length) out.push({ text: src.slice(last), color: C.text })
  return out
}

interface Props {
  code: string
  show: boolean
  lang?: Lang
  size?: number
  file?: string
  /** characters per second */
  speed?: number
  delay?: number
  style?: CSSProperties
}

/** Dark code panel that types itself in when `show` turns true. Layout is reserved up front so nothing jumps. */
export function Code({ code, show, lang = 'py', size = 28, file, speed = 80, delay = 0, style }: Props) {
  const { mode, reduced } = useEnv()
  const instant = mode === 'print' || reduced
  const toks = useMemo(() => tokenize(code, lang), [code, lang])
  const total = code.length
  const [n, setN] = useState(() => (instant && show ? total : 0))
  useEffect(() => {
    if (!show) {
      setN(0)
      return
    }
    if (instant) {
      setN(total)
      return
    }
    const a = animate(0, total, { duration: total / speed, delay, ease: 'linear', onUpdate: (v) => setN(Math.floor(v)) })
    return () => a.stop()
  }, [show, total, instant, speed, delay])
  let pos = 0
  return (
    <Reveal show={show} style={style}>
      <div style={{ background: '#0a0c11', borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(128, 138, 160, 0.22)' }}>
        {file && <div style={{ padding: '16px 32px', fontFamily: mono, fontSize: 18, color: C.comment, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{file}</div>}
        <pre style={{ margin: 0, padding: '26px 36px 30px', fontFamily: mono, fontSize: size, lineHeight: 1.55, color: C.text, whiteSpace: 'pre' }}>
          {toks.map((t, i) => {
            const s = pos
            pos += t.text.length
            const vis = Math.max(0, Math.min(t.text.length, n - s))
            const caret = show && n < total && n >= s && n < s + t.text.length
            return (
              <span key={i}>
                <span style={{ color: t.color, fontStyle: t.color === C.comment ? 'italic' : 'normal' }}>{t.text.slice(0, vis)}</span>
                {caret && <span style={{ display: 'inline-block', width: 0, height: '1.1em', verticalAlign: 'text-bottom', borderLeft: '3px solid #8aa2ff' }} />}
                <span style={{ color: 'transparent' }}>{t.text.slice(vis)}</span>
              </span>
            )
          })}
        </pre>
      </div>
    </Reveal>
  )
}
