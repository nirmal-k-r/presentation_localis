import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { SceneProps } from '../content/scenes'
import { Slide } from '../components/Slide'
import { Reveal } from '../components/Reveal'
import { Code } from '../components/Code'
import { RingDiagram } from '../components/RingDiagram'
import { Brands } from '../components/Brands'
import { CB, CT, Stat, Tag, Tile, mono } from '../components/ui'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'

const dim = (on: boolean): CSSProperties => ({ opacity: on ? 0.3 : 1, transition: 'opacity .6s ease' })
const tint = (on: boolean): CSSProperties => ({ color: on ? 'var(--cobalt)' : 'var(--ink)', transition: 'color .6s ease' })

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 22, opacity: 0.65, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 8 }}>{value}</div>
    </div>
  )
}

export function S01Title({ step }: SceneProps) {
  const hl = step >= 1
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Brands x={120} y={64} />
      <Reveal show delay={0.15} y={26} style={abs(120, 190, { fontSize: 100, lineHeight: 1.06, fontWeight: 700, letterSpacing: '-0.045em', width: 1700 })}>
        <span style={dim(hl)}>From a simple </span>
        <span style={tint(hl)}>Python script</span>
        <span style={dim(hl)}> to building</span>
        <br />
        <span style={dim(hl)}>my own </span>
        <span style={tint(hl)}>distributed AI stack</span>
      </Reveal>
      <Tile show delay={0.7} x={120} y={500} w={520} h={440} pad={48} tone="inset" style={{ gap: 44 }}>
        <Meta label="Presenter" value="Nirmal Rampersand" />
        <Meta label="Date" value="10 October 2026" />
      </Tile>
      <Tile show delay={0.85} x={660} y={500} w={520} h={440} pad={48} style={{ gap: 44 }}>
        <Meta label="Presented at" value="PyMUG" />
        <Meta label="Location" value="Coder Faculty" />
      </Tile>
      <Tile show delay={1.0} x={1200} y={500} w={600} h={440} pad={28}>
        <RingDiagram flow="ring" mem={[0.5, 0.5, 0.5]} sub={['layers 1–16', 'layers 17–32', 'layers 33–48']} />
      </Tile>
    </div>
  )
}

export function S02WhyLocal({ step }: SceneProps) {
  return (
    <Slide part={0} title="Why run AI at home?" sub="I had four reasons.">
      <Tile show={step >= 0} x={120} y={280} w={820} h={680} pad={48}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: '-0.035em' }}>Privacy</div>
        <div style={{ fontSize: 36, lineHeight: 1.4, marginTop: 26, opacity: 0.8 }}>My data stays on my own machines. No prompt and no file goes to someone else's server.</div>
      </Tile>
      <Tile show={step >= 1} x={960} y={280} w={840} h={210} tone="inset"><CT size={42}>Cost</CT><CB>No bill for every question. Once I own the hardware, it only costs electricity.</CB></Tile>
      <Tile show={step >= 2} x={960} y={510} w={840} h={210} tone="inset"><CT size={42}>Control</CT><CB>I choose the model and I choose when it runs.</CB></Tile>
      <Tile show={step >= 3} x={960} y={740} w={840} h={220} tone="accent"><CT size={42}>Learning</CT><CB>Running it myself is the best way to understand how it really works.</CB></Tile>
    </Slide>
  )
}

const HELLO = `from mlx_lm import load, generate

model, tokenizer = load("mlx-community/Qwen3-4B-4bit")
reply = generate(model, tokenizer,
                 prompt="Hello from my Mac mini!",
                 max_tokens=60)
print(reply)`
export function S03Day0({ step }: SceneProps) {
  return (
    <Slide part={1} title="It started with one Python script" sub="A few lines of Python and one Mac mini.">
      <Code code={HELLO} show file="hello.py" size={30} speed={70} delay={0.5} style={abs(120, 280, { width: 1060 })} />
      <Tile show={step >= 1} x={1200} y={280} w={600} h={260} tone="inset" style={{ fontFamily: mono, fontSize: 26, lineHeight: 1.5 }}>
        <div style={{ color: 'var(--muted)' }}>$ python hello.py</div>
        <div style={{ marginTop: 14 }}>Hello! Great to meet you. How can I help today?</div>
      </Tile>
      <Tile show={step >= 1} x={1200} y={560} w={600} h={190} delay={0.15}>
        <Tag>what ran</Tag>
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 10, lineHeight: 1.3 }}>Qwen3 4B, 4-bit, on one Mac mini with 16 GB</div>
      </Tile>
      <Reveal show={step >= 2} delay={0.1} style={abs(120, 800, { ...T.h1s, width: 1500 })}>
        It worked. <span style={{ color: 'var(--cobalt)' }}>So I tried a bigger model.</span>
      </Reveal>
    </Slide>
  )
}

export function S04Wall({ step }: SceneProps) {
  const d = useDur()
  const full = step >= 1
  return (
    <Slide part={1} title="The bigger model didn't fit" sub="A small Mac runs out of memory quickly.">
      <Tile x={120} y={280} w={1680} h={330} pad={44}>
        <div style={{ fontSize: 28, opacity: 0.78 }}>One Mac mini · 16 GB of memory</div>
        <div style={{ position: 'relative', marginTop: 30, height: 110 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 110, borderRadius: 14, background: 'var(--card2)' }} />
          <motion.div initial={false} animate={{ width: full ? 1320 : 0 }} transition={{ duration: d(1.4), ease }} style={{ position: 'absolute', left: 0, top: 0, height: 110, borderRadius: 14, background: 'var(--neg)' }} />
          <div style={{ position: 'absolute', left: 1200, top: -14, height: 138, borderLeft: '3px dashed var(--ink)' }} />
          <div style={{ position: 'absolute', left: 1218, top: -6, fontFamily: mono, fontSize: 22 }}>16 GB limit</div>
          <Reveal show={full} delay={0.9} style={{ position: 'absolute', left: 30, top: 30, fontSize: 34, fontWeight: 650, color: '#0b0d12' }}>Qwen3-Coder 30B</Reveal>
        </div>
        <Reveal show={full} delay={1.1} style={{ marginTop: 28, fontSize: 30, color: 'var(--neg)' }}>The model alone is 16.0 GB, and macOS and the model's working memory need room too.</Reveal>
      </Tile>
      <Tile show={step >= 2} x={120} y={630} w={820} h={330} tone="inset"><Stat value="16.0 GB" label="size of Qwen3-Coder 30B (4-bit)" /></Tile>
      <Tile show={step >= 2} x={960} y={630} w={840} h={330} tone="accent" delay={0.15}>
        <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>So I added more Macs.</div>
        <CB size={30} mt={18}>Three of them, linked together, sharing one model.</CB>
      </Tile>
    </Slide>
  )
}

const ROAD = [
  { t: 'Script', d: 'One Python script on one Mac.', g: 'Python' },
  { t: 'Ring', d: 'Three Macs share one big model.', g: 'Python (mlx-lm)' },
  { t: 'Engine', d: 'My own Python code, so any model can be split.', g: 'Python' },
  { t: 'Platform', d: 'A control plane, a small agent per Mac and one API.', g: 'TypeScript, Go, Python' },
  { t: 'Agents', d: 'A harness so small models can finish long jobs.', g: 'TypeScript' },
  { t: 'Day to day', d: 'Automations, updates and a web app.', g: 'Python SDK, TypeScript' },
]
export function S05Roadmap({ step }: SceneProps) {
  return (
    <Slide part={-1} label="Overview" title="How it grew: six steps" sub="Each step fixed a problem the one before it left. Python runs the model all the way through.">
      {ROAD.map((r, i) => (
        <Tile key={r.t} show={step >= i} x={120 + i * 284} y={960 - (290 + i * 50)} w={264} h={290 + i * 50} top tone={i === 0 ? 'accent' : 'plain'} pad={28}>
          <div style={{ fontSize: 22, fontWeight: 600, opacity: 0.6 }}>Step {i + 1}</div>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 6 }}>{r.t}</div>
          <CB size={24} mt={10}>{r.d}</CB>
          <div style={{ marginTop: 16 }}><Tag color={i === 0 ? 'var(--on-accent)' : 'var(--muted)'} size={18}>{r.g}</Tag></div>
        </Tile>
      ))}
    </Slide>
  )
}
