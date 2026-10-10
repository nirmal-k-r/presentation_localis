import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { Slide } from '../components/Slide'
import { RingDiagram } from '../components/RingDiagram'
import { CB, CT, Stat, Tile, mono } from '../components/ui'
import { ease, useDur } from '../engine/motion'
import { abs } from '../styles/type'

const P = 2

export function S06Cluster({ step }: SceneProps) {
  return (
    <Slide part={P} title="Three Mac minis, linked together" sub="Each one is small, quiet and cheap to run.">
      <Tile x={120} y={280} w={1000} h={690} pad={24}>
        <RingDiagram linksVisible={step >= 1} flow={step >= 1 ? 'ring' : 'none'} mem={step >= 1 ? [0.2, 0.2, 0.2] : undefined} />
      </Tile>
      <Tile show={step >= 2} x={1140} y={280} w={660} h={330} tone="accent"><Stat value="48 GB" label="of memory in total (3 × 16 GB)" /></Tile>
      <Tile show={step >= 2} x={1140} y={630} w={660} h={340} delay={0.15} tone="inset">
        <CT size={42}>Thunderbolt</CT>
        <CB size={29} mt={14}>Every Mac is connected to every other one, so they can pass data to each other quickly.</CB>
      </Tile>
    </Slide>
  )
}

export function S07Pipeline({ step }: SceneProps) {
  const d = useDur()
  const tint = (i: number) => (step >= 1 ? ['var(--cobalt)', 'var(--ok)', 'var(--warn)'][Math.floor(i / 16)] : 'var(--card2)')
  return (
    <Slide part={P} title="How three Macs run one model" sub="A model is a stack of layers. Each Mac holds a third of them.">
      <Tile x={120} y={280} w={1680} h={190} pad={40}>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: 48 }, (_, i) => (
            <motion.div key={i} initial={false} animate={{ background: tint(i) }} transition={{ duration: d(0.5), delay: d(i * 0.015), ease }} style={{ width: 28, height: 62, borderRadius: 5 }} />
          ))}
        </div>
        <div style={{ fontSize: 24, marginTop: 14, opacity: 0.75 }}>The model has 48 layers, one after another.</div>
      </Tile>
      <Tile show={step >= 1} x={120} y={490} w={640} h={230} tone="inset"><CT size={34}>Each Mac loads its own 16 layers</CT><CB size={26}>The rest of the model never touches its memory.</CB></Tile>
      <Tile show={step >= 3} x={120} y={740} w={640} h={230} tone="accent"><CT size={34}>One word at a time</CT><CB size={26}>The data goes through Mac 1, then 2, then 3, and the answer comes out.</CB></Tile>
      <Tile show={step >= 2} x={780} y={490} w={1020} h={480} pad={20}>
        <RingDiagram flow={step >= 2 ? 'ring' : 'none'} mem={[0.4, 0.4, 0.4]} sub={['layers 1–16', 'layers 17–32', 'layers 33–48']} />
      </Tile>
    </Slide>
  )
}

export function S08Capacity({ step }: SceneProps) {
  const d = useDur()
  const bar = (label: string, delay: number, c: string, y: number) => (
    <div style={abs(0, y, { width: 940 })}>
      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.8 }}>{label}</div>
      <div style={{ width: 940, height: 62, borderRadius: 12, background: 'var(--card2)', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: 400 }} transition={{ duration: d(1.1), delay: d(delay), ease }} style={{ height: '100%', background: c }} />
      </div>
    </div>
  )
  return (
    <Slide part={P} title="It runs bigger models, not faster ones" sub="I tested a 14B model on one Mac, then on all three.">
      <Tile x={120} y={280} w={1040} h={420} pad={44}>
        <div style={{ position: 'relative', height: 300 }}>{bar('One Mac mini', 0.2, 'var(--muted)', 0)}{bar('Three Macs together', 0.5, 'var(--cobalt)', 150)}</div>
      </Tile>
      <Tile x={1180} y={280} w={620} h={420} tone="accent">
        <Stat value="11–13" label="tokens per second, the same on both" />
        <div style={{ fontSize: 22, marginTop: 14, opacity: 0.7 }}>A token is about three quarters of a word.</div>
      </Tile>
      <Tile show={step >= 1} x={120} y={720} w={1680} h={240} tone="inset" pad={44}>
        <div style={{ fontSize: 46, fontWeight: 650, letterSpacing: '-0.025em', lineHeight: 1.15 }}>Splitting a model lets it fit in memory.</div>
        <CB size={30} mt={14}>It does not make a single answer arrive sooner. It adds room, and helps when many requests come in at once.</CB>
      </Tile>
    </Slide>
  )
}

export function S09Heat({ step }: SceneProps) {
  const storm = step === 1
  return (
    <Slide part={P} title="A surprise: 88 °C with nothing running" sub="All three Macs got hot while they were idle.">
      <Tile x={120} y={280} w={960} h={690} pad={24}>
        <RingDiagram flow={storm ? 'storm' : 'ring'} heat={storm ? 0.7 : 0} cut={step >= 2 ? 2 : undefined} sub={storm ? ['88 °C', '88 °C', '88 °C'] : ['idle', 'idle', 'idle']} />
      </Tile>
      <Tile show={step >= 1} x={1100} y={280} w={700} h={340} tone="neg">
        <CT size={38}>What happened</CT>
        <CB size={28}>I had joined the three cables into one network. That made a loop, so network messages went round and round forever and kept every Mac busy.</CB>
      </Tile>
      <Tile show={step >= 2} x={1100} y={640} w={700} h={330} tone="ok">
        <CT size={38}>The fix</CT>
        <CB size={28}>Switch off one connection to break the loop, and do it again at every boot.</CB>
      </Tile>
      <div style={abs(140, 1000, { fontFamily: mono, fontSize: 18, color: 'var(--muted)', opacity: storm ? 1 : 0 })}>Illustration of a real incident</div>
    </Slide>
  )
}
