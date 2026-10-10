import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { Slide } from '../components/Slide'
import { Reveal } from '../components/Reveal'
import { Code } from '../components/Code'
import { Shot } from '../components/Shot'
import { Brands } from '../components/Brands'
import { Qr } from '../components/Qr'
import { CB, CT, Tile, mono } from '../components/ui'
import { ease, useDur } from '../engine/motion'
import { T, abs } from '../styles/type'
import home from '../assets/home.jpg'
import agent from '../assets/agent.jpg'
import tasks from '../assets/tasks.jpg'
import drive from '../assets/drive.jpg'
import terminal from '../assets/terminal.jpg'
import rings from '../assets/rings.jpg'
import deployments from '../assets/deployments.jpg'
import models from '../assets/models.jpg'
import benchmarks from '../assets/benchmarks.jpg'
import gateway from '../assets/gateway.jpg'
import logs from '../assets/logs.jpg'

const P = 6
const WRAP = 7

const AUTO = `import localis

# runs on a schedule, on the server
text = localis.llm.chat("Summarise today's alerts",
                        system="Be brief")
localis.kv.set("last_summary", text)
localis.channels.send("whatsapp", "me", text)`
const OPS = [
  ['Cools itself down', 'Turns the model off when it is idle, too hot, or at night. The next request wakes it up.'],
  ['Backs itself up', 'A daily copy of the database. The last 7 are kept.'],
  ['Tells me when something is wrong', 'A WhatsApp or Telegram message when a Mac goes offline or the agent finishes.'],
]
export function S23Ops({ step }: SceneProps) {
  return (
    <Slide part={P} title="Running it day to day" sub="The cluster handles the routine jobs by itself.">
      <Code code={AUTO} show file="automation.py" size={28} speed={70} delay={0.3} style={abs(120, 280, { width: 900 })} />
      <div style={abs(120, 700, { fontSize: 25, color: 'var(--muted)', width: 900, lineHeight: 1.4 })}>Automations are plain Python scripts. The small SDK uses only the standard library.</div>
      {OPS.map(([t, b], i) => (
        <Tile key={t} show={step >= i + 1} x={1040} y={280 + i * 230} w={760} h={210} tone={i === 0 ? 'accent' : 'plain'}>
          <CT size={36}>{t}</CT>
          <CB size={26}>{b}</CB>
        </Tile>
      ))}
    </Slide>
  )
}

export function S24Sync({ step }: SceneProps) {
  const d = useDur()
  const bar = (y: number, label: string, rate: string, w: number, c: string, delay: number) => (
    <div style={abs(0, y, { width: 1500 })}>
      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.85 }}>{label} <span style={{ fontFamily: mono, marginLeft: 12 }}>{rate}</span></div>
      <div style={{ width: 1500, height: 56, borderRadius: 12, background: 'var(--card2)', overflow: 'hidden' }}>
        <motion.div initial={false} animate={{ width: step >= 1 ? w : 0 }} transition={{ duration: d(1.2), delay: d(delay), ease }} style={{ height: '100%', background: c }} />
      </div>
    </div>
  )
  return (
    <Slide part={P} title="Updates and copying models" sub="Two chores I wanted to be boring.">
      <Tile x={120} y={280} w={1680} h={190} pad={44} tone="inset">
        <div style={{ fontSize: 28, opacity: 0.7 }}>Updating Localis</div>
        <div style={{ fontSize: 46, fontWeight: 650, letterSpacing: '-0.025em', marginTop: 12 }}>
          Signed release <span style={{ opacity: 0.4 }}>→</span> install <span style={{ opacity: 0.4 }}>→</span> health check <span style={{ opacity: 0.4 }}>→</span> roll back if it fails
        </div>
      </Tile>
      <Tile show={step >= 1} x={120} y={490} w={1680} h={480} pad={44}>
        <CT size={38}>Copying a 16 GB model to another Mac</CT>
        <div style={{ position: 'relative', height: 280, marginTop: 24 }}>
          {bar(0, 'rsync', '~130 MB/s', 150, 'var(--muted)', 0.2)}
          {bar(130, 'tar over ssh, over Thunderbolt', '~1.3 GB/s', 1500, 'var(--cobalt)', 0.5)}
        </div>
        <Reveal show={step >= 2} style={{ fontSize: 36, fontWeight: 650, letterSpacing: '-0.02em' }}>10 times faster, and checked afterwards by file count and total size.</Reveal>
      </Tile>
    </Slide>
  )
}

// every screenshot of the app. r = image height / width, so each one fits the slide.
const TOUR = [
  { src: home, r: 0.569, t: 'Overview', d: 'Live memory, GPU and links' },
  { src: agent, r: 0.47, t: 'Chat and agent', d: 'Talk to a model or give it a job' },
  { src: tasks, r: 0.407, t: 'Tasks', d: 'Jobs running in the background' },
  { src: drive, r: 0.373, t: 'Drive', d: 'Files and agent workspaces' },
  { src: terminal, r: 0.564, t: 'Terminal', d: 'A shell on any Mac' },
  { src: rings, r: 0.6, t: 'Rings', d: 'Which Macs are connected' },
  { src: deployments, r: 0.666, t: 'Deployments', d: 'Which model runs where' },
  { src: models, r: 0.616, t: 'Models', d: 'Search, download, copy' },
  { src: benchmarks, r: 0.342, t: 'Benchmarks', d: 'Speed and quality tests' },
  { src: gateway, r: 0.669, t: 'Gateway', d: 'Connect your tools' },
  { src: logs, r: 0.566, t: 'Logs', d: 'What each model is doing' },
]
export function S25Tour({ step }: SceneProps) {
  return (
    <Slide part={P} title="The Localis app" sub="A web app served by the control plane. It works from any device, with no cloud.">
      <Tile x={120} y={270} w={400} h={720} pad={26} tone="plain">
        {TOUR.map((t, i) => (
          <div key={t.t} style={{ padding: '9px 0', opacity: step === i ? 1 : 0.45, transition: 'opacity .35s ease' }}>
            <div style={{ fontSize: 30, fontWeight: 650, color: step === i ? 'var(--cobalt)' : 'var(--ink)', letterSpacing: '-0.015em' }}>{t.t}</div>
            {step === i && <div style={{ fontSize: 21, opacity: 0.8, marginTop: 2 }}>{t.d}</div>}
          </div>
        ))}
      </Tile>
      {TOUR.map((t, i) => {
        const w = Math.min(1240, 700 / t.r)
        return <Shot key={t.t} src={t.src} show={step === i} alt={t.t} style={abs(560 + (1240 - w) / 2, 280, { width: w })} />
      })}
    </Slide>
  )
}

const SELF = [
  ['Its own copy', 'Works on a separate branch, never on the live system.'],
  ['Tests must pass', 'Unit tests, builds and security tests.'],
  ['Risk check', 'Changes to sensitive files or weakened tests are flagged.'],
  ['I approve', 'With a fresh sign-in. Risky changes need a second approval.'],
  ['Safe rollout', 'If the new version is unhealthy, it rolls back.'],
]
export function S26SelfDev({ step }: SceneProps) {
  return (
    <Slide part={P} title="Next idea: let the agent improve Localis itself" sub="It doesn't run on its own yet. This is the plan and its safety checks.">
      {SELF.map(([t, b], i) => (
        <Tile key={t} show={step >= i} x={120 + i * 340} y={290} w={320} h={400} pad={30} top>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--cobalt)' }}>Step {i + 1}</div>
          <CT size={36}>{t}</CT>
          <CB size={25}>{b}</CB>
        </Tile>
      ))}
      <Tile show={step >= 5} x={120} y={720} w={1680} h={240} tone="accent" pad={48}>
        <div style={{ ...T.h2, fontSize: 52 }}>One rule: the agent can't change its own safety rules.</div>
      </Tile>
    </Slide>
  )
}

const LESS = [
  'Start with a small script. Add something only when it hurts not to.',
  'Check that a clever trick gives the same answer as the simple way.',
  'With small models, put your effort into the code around them.',
  'Hardware surprises you: heat, cables and network loops.',
  'Write tests for your agent early.',
]
export function S27Lessons({ step }: SceneProps) {
  return (
    <Slide part={WRAP} label="Wrap up" title="What I learned" sub="If you're starting something similar:">
      <Tile show={step >= 0} x={120} y={280} w={800} h={680} tone="accent" pad={52}>
        <div style={{ fontSize: 28, fontWeight: 600, opacity: 0.7 }}>1</div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.08, marginTop: 14 }}>{LESS[0]}</div>
      </Tile>
      {LESS.slice(1).map((l, i) => (
        <Tile key={l} show={step >= i + 1} x={940 + (i % 2) * 440} y={280 + Math.floor(i / 2) * 350} w={420} h={330} pad={32} tone={i === 0 ? 'inset' : 'plain'}>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--cobalt)' }}>{i + 2}</div>
          <div style={{ fontSize: 33, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.015em', marginTop: 10 }}>{l}</div>
        </Tile>
      ))}
    </Slide>
  )
}

const NEXT = [
  ['Only valid tool calls', 'Force the model\'s tool calls to always be well formed.', 1000],
  ['A map of the code', 'Give coding agents an overview of a project before they start.', 660],
  ['Check the writing too', 'Today files are checked. I want to check the text as well.', 660],
  ['Several sites', 'Manage Macs in different places from one view.', 1000],
] as const
export function S28Next({ step }: SceneProps) {
  return (
    <Slide part={WRAP} label="Wrap up" title="What I want to build next" sub="Still a lot to do.">
      {NEXT.map(([t, b, w], i) => (
        <Tile key={t} show={step >= i} x={i === 0 ? 120 : i === 1 ? 1140 : i === 2 ? 120 : 800} y={i < 2 ? 280 : 630} w={w} h={330} pad={44} tone={i === 0 ? 'accent' : i === 3 ? 'inset' : 'plain'}>
          <CT size={46}>{t}</CT>
          <CB size={30} mt={16}>{b}</CB>
        </Tile>
      ))}
    </Slide>
  )
}

const LINKEDIN = 'https://www.linkedin.com/in/nirmal-rampersand/'
const EMAIL = 'nirkramp@gmail.com'

export function S29Thanks({ step }: SceneProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Brands x={120} y={64} />
      <Reveal show y={30} dur={0.8} style={abs(120, 180, { fontSize: 150, fontWeight: 700, letterSpacing: '-0.045em', lineHeight: 1 })}>Thank you</Reveal>
      <Reveal show={step >= 1} delay={0.1} style={abs(120, 350, { fontSize: 96, fontWeight: 600, letterSpacing: '-0.035em', color: 'var(--cobalt)', lineHeight: 1 })}>Questions?</Reveal>
      <Tile show={step >= 1} delay={0.3} x={120} y={500} w={760} h={440} pad={48} tone="inset" style={{ gap: 44 }}>
        <div><div style={{ fontSize: 22, opacity: 0.65, fontWeight: 500 }}>Presenter</div><div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', marginTop: 8 }}>Nirmal Rampersand</div></div>
        <div><div style={{ fontSize: 22, opacity: 0.65, fontWeight: 500 }}>Email</div><div style={{ fontFamily: mono, fontSize: 32, marginTop: 12, color: 'var(--cobalt)' }}>{EMAIL}</div></div>
      </Tile>
      <Tile show={step >= 1} delay={0.45} x={900} y={500} w={900} h={440} pad={50} style={{ flexDirection: 'row', alignItems: 'center', gap: 50 }}>
        <div style={{ flexShrink: 0 }}><Qr text={LINKEDIN} size={340} label="QR code linking to Nirmal Rampersand on LinkedIn" /></div>
        <div>
          <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.12 }}>Scan to connect on LinkedIn</div>
          <div style={{ fontFamily: mono, fontSize: 21, marginTop: 18, opacity: 0.7, lineHeight: 1.4 }}>linkedin.com/in/<br />nirmal-rampersand</div>
        </div>
      </Tile>
    </div>
  )
}
