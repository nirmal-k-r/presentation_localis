import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { Slide } from '../components/Slide'
import { Code } from '../components/Code'
import { RingDiagram } from '../components/RingDiagram'
import { CB, CT, Tag, Tile, mono } from '../components/ui'
import { ease, useDur } from '../engine/motion'
import { abs } from '../styles/type'

const P = 4

const LAYERS = [
  ['Clients', 'Browser, coding tools, WhatsApp and scripts.', 'any OpenAI-style client'],
  ['Control plane', 'The brain. Starts and stops models, and holds the API, chat and tasks.', 'TypeScript'],
  ['Agent on each Mac', 'A tiny program, about 7 MB. Reports status and starts the model.', 'Go'],
  ['Inference runtime', 'mlx-lm plus my Python wrapper. This is where the model runs.', 'Python'],
]
export function S14Arch({ step }: SceneProps) {
  return (
    <Slide part={P} title="Around the model: a control plane and small agents" sub="Starting models by hand over ssh got old quickly.">
      {LAYERS.map(([t, b, g], i) => (
        <Tile key={t} show={step >= i} x={120} y={280 + i * 175} w={1100} h={155} tone={i === 3 ? 'accent' : 'plain'} pad={32} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <CT size={36}>{t}</CT>
            <CB size={25} mt={8}>{b}</CB>
          </div>
          <Tag color={i === 3 ? 'var(--on-accent)' : 'var(--muted)'} size={21}>{g}</Tag>
        </Tile>
      ))}
      <Tile show={step >= 4} x={1240} y={280} w={560} h={680} tone="inset" pad={44}>
        <div style={{ fontSize: 54, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Python runs the model.</div>
        <CB size={30} mt={26}>Everything around it uses whatever was quickest to build and easiest to ship.</CB>
      </Tile>
    </Slide>
  )
}

export function S15Reconcile({ step }: SceneProps) {
  const rows: [boolean, string, string, 'plain' | 'neg' | 'ok'][] = [
    [true, 'I say what should run', 'Localis checks every 2 seconds that it really is running.', 'plain'],
    [step >= 1, 'A process dies', 'One Mac stops, so the whole group is stopped. A half-running model is useless.', 'neg'],
    [step >= 2, 'Wait, then retry', 'First 5 seconds, then longer, up to 5 minutes. If it keeps crashing, it stops retrying.', 'plain'],
    [step >= 3, 'Back to normal', 'The model is running again.', 'ok'],
  ]
  return (
    <Slide part={P} title="Keeping it running" sub="I say what should be running. A loop makes it true.">
      <Tile x={120} y={280} w={780} h={690} pad={24}>
        <RingDiagram
          flow={step === 1 || step === 2 ? 'none' : 'ring'}
          dead={step === 1 || step === 2 ? 1 : undefined}
          sub={step === 1 ? ['serving', 'crashed', 'serving'] : step === 2 ? ['stopped', 'crashed', 'stopped'] : step === 3 ? ['restarted', 'restarted', 'restarted'] : ['serving', 'serving', 'serving']}
        />
      </Tile>
      {rows.map(([show, t, b, tone], i) => (
        <Tile key={t} show={show} x={920} y={280 + i * 180} w={880} h={162} tone={tone} pad={32}>
          <CT size={36}>{t}</CT>
          <CB size={26} mt={8}>{b}</CB>
        </Tile>
      ))}
    </Slide>
  )
}

const CALL = `from openai import OpenAI

client = OpenAI(base_url="https://my-cluster/v1", api_key="lk_...")
reply = client.chat.completions.create(
    model="local/qwen-3-coder",
    messages=[{"role": "user", "content": "Refactor this"}],
)`
const QUEUE = ['Interactive chat', 'WhatsApp and other channels', 'Agent tasks', 'Automations', 'Benchmarks']
export function S16Gateway({ step }: SceneProps) {
  const d = useDur()
  return (
    <Slide part={P} title="One address for every tool" sub="Anything that speaks the OpenAI API can use my Macs.">
      <Code code={CALL} show file="client.py" size={24} speed={75} delay={0.3} style={abs(120, 280, { width: 1100 })} />
      <div style={abs(120, 690, { fontFamily: mono, fontSize: 18, color: 'var(--muted)' })}>The address and key are placeholders.</div>
      <Tile show={step >= 2} x={120} y={730} w={1100} h={240} tone="inset">
        <CT size={36}>Works with the tools I already use</CT>
        <CB size={27}>OpenCode, Claude Code and Aider. Each tool gets its own key, and I can see who is connected.</CB>
      </Tile>
      <Tile x={1240} y={280} w={560} h={690} pad={36}>
        <CT size={36}>Who goes first when it's busy</CT>
        <div style={{ marginTop: 26 }}>
          {QUEUE.map((q, i) => (
            <motion.div key={q} initial={false} animate={{ opacity: step >= 1 ? 1 : 0, x: step >= 1 ? 0 : 20 }} transition={{ duration: d(0.45), delay: d(step >= 1 ? 0.1 + i * 0.12 : 0), ease }} style={{ display: 'flex', gap: 20, alignItems: 'baseline', padding: '20px 0', borderBottom: i === 4 ? 'none' : '1px solid var(--line)' }}>
              <span style={{ fontFamily: mono, fontSize: 26, color: 'var(--cobalt)', width: 28 }}>{i + 1}</span>
              <span style={{ fontSize: 28 }}>{q}</span>
            </motion.div>
          ))}
        </div>
      </Tile>
    </Slide>
  )
}
