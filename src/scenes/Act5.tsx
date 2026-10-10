import type { SceneProps } from '../content/scenes'
import { Slide } from '../components/Slide'
import { Reveal } from '../components/Reveal'
import { Code } from '../components/Code'
import { Shot } from '../components/Shot'
import { CountUp } from '../components/CountUp'
import { CB, CT, Stat, Tag, Tile, mono } from '../components/ui'
import { abs } from '../styles/type'
import agent from '../assets/agent.jpg'

const P = 5

const FAIL = [
  ['Loop', 'It repeats the same step again and again.', 'read_file a.py\nread_file a.py\nread_file a.py'],
  ['Stall', 'One slow step blocks everything else.', 'write_file index.html\n...\n(nothing for minutes)'],
  ['Forget', 'It loses track of the plan halfway through.', 'step 7 of 10\n> what was I doing?'],
]
export function S17Small({ step }: SceneProps) {
  return (
    <Slide part={P} title="Small models struggle with long jobs" sub="A big cloud model can keep a whole project in mind. A small local one can't.">
      {FAIL.map(([t, b, c], i) => (
        <Tile key={t} show={step >= i} x={120 + i * 570} y={280} w={540} h={440} pad={36} top>
          <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: '-0.035em' }}>{t}</div>
          <CB size={27} mt={10}>{b}</CB>
          <div style={{ marginTop: 22, background: 'var(--card2)', borderRadius: 14, padding: '18px 22px', fontFamily: mono, fontSize: 22, lineHeight: 1.5, whiteSpace: 'pre', color: 'var(--ink-2)' }}>{c}</div>
        </Tile>
      ))}
      <Tile show={step >= 3} x={120} y={740} w={1680} h={220} tone="accent" pad={44}>
        <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12 }}>So I wrapped the model in a harness:</div>
        <CB size={32} mt={14}>a program that keeps track of the work, so the model doesn't have to.</CB>
      </Tile>
    </Slide>
  )
}

export function S18Harness({ step }: SceneProps) {
  const show = (i: number) => step >= Math.floor(i / 2)
  return (
    <Slide part={P} title="The harness: a program that supervises the model" sub="It plans, checks and saves, so the model only handles one step at a time.">
      <Tile show={show(0)} x={120} y={280} w={800} h={280} tone="accent"><CT size={40}>A plan saved to disk</CT><CB size={27}>Each job is split into steps. A step only counts as done once it's checked: the file exists, it's long enough, the code runs.</CB></Tile>
      <Tile show={show(1)} x={940} y={280} w={420} h={280} delay={0.1}><CT size={34}>Writing mode</CT><CB size={25}>Long text streams as plain text, not inside a fragile tool call.</CB></Tile>
      <Tile show={show(2)} x={1380} y={280} w={420} h={280} delay={0.1}><CT size={34}>A small window</CT><CB size={25}>The model sees only the last 16k tokens. Old results are shortened. Files stay on disk.</CB></Tile>
      <Tile show={show(3)} x={120} y={580} w={420} h={280}><CT size={34}>Loop detection</CT><CB size={25}>Repeating the same call is refused.</CB></Tile>
      <Tile show={show(4)} x={560} y={580} w={420} h={280} delay={0.1}><CT size={34}>Save points</CT><CB size={25}>Every finished step is a git commit.</CB></Tile>
      <Tile show={show(5)} x={1000} y={580} w={800} h={280} tone="inset" delay={0.1}><CT size={40}>It doesn't give up quietly</CT><CB size={27}>If it gets stuck it restarts with a fresh context. If it still can't finish, it tells me what is left.</CB></Tile>
      <Reveal show={step >= 3} style={abs(120, 890, { fontSize: 38, fontWeight: 600, letterSpacing: '-0.02em', width: 1680, lineHeight: 1.25 })}>
        On a 30B model this finished a 10-chapter story and a 3-file website with nobody watching.
      </Reveal>
    </Slide>
  )
}

export function S19Agent({ step }: SceneProps) {
  const pts = ['You can close the page. The agent keeps going.', 'When it needs a decision, it stops and asks.', "When it's done, it sends a WhatsApp or Telegram message."]
  return (
    <Slide part={P} title="What it looks like" sub="I give it a job and it works in the background.">
      <Shot src={agent} show style={abs(120, 280, { width: 1240 })} alt="Agent mode" />
      {pts.map((p, i) => (
        <Tile key={p} show={step >= i} x={1380} y={280 + i * 215} w={420} h={195} pad={30} tone={i === 0 ? 'accent' : 'plain'}>
          <div style={{ fontSize: 29, fontWeight: 600, lineHeight: 1.3 }}>{p}</div>
        </Tile>
      ))}
    </Slide>
  )
}

const FN = `<function=write_file>
<parameter=path>index.html</parameter>
<parameter=content>...</parameter>
</function>`
export function S20TextTools({ step }: SceneProps) {
  return (
    <Slide part={P} title="Making progress visible" sub="Normally you can't see a tool call until it has finished.">
      <Tile x={120} y={280} w={780} h={330} tone="neg"><CT size={40}>The problem</CT><CB size={28}>While the model writes a tool call, nothing shows. If it loops I can't tell, and the other Macs wait.</CB></Tile>
      <Code code={FN} lang="xml" show={step >= 1} file="text-mode call" size={26} speed={60} style={abs(920, 280, { width: 880 })} />
      <Tile show={step >= 1} x={120} y={630} w={780} h={330} delay={0.4}><CT size={40}>My fix</CT><CB size={28}>Let the model write the call as normal text, and read it myself. Now I can see progress, spot loops and stop it.</CB></Tile>
      <Tile show={step >= 2} x={920} y={630} w={880} h={330} tone="accent"><Stat value="233 s → 50 s" label="to build a 3-file website" size={92} /></Tile>
    </Slide>
  )
}

export function S21Memory({ step }: SceneProps) {
  return (
    <Slide part={P} title="Where the agent keeps its notes" sub="The model forgets, so the notes live outside it.">
      <Tile show={step >= 1} x={120} y={280} w={820} h={520} tone="accent" pad={44}>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08 }}>Files in the workspace</div>
        <CB size={32} mt={22}>The plan, the progress and the notes. This is the real memory.</CB>
      </Tile>
      <Tile show={step >= 0} x={960} y={280} w={840} h={160} tone="inset"><CT size={34}>The model's window</CT><CB size={25} mt={6}>What it can see right now. Small, and rebuilt at every step.</CB></Tile>
      <Tile show={step >= 2} x={960} y={460} w={840} h={160}><CT size={34}>Chat memory</CT><CB size={25} mt={6}>Facts the agent saves for one conversation only.</CB></Tile>
      <Tile show={step >= 3} x={960} y={640} w={840} h={160}><CT size={34}>Shared memory</CT><CB size={25} mt={6}>Shared across all chats. Off unless you turn it on.</CB></Tile>
      <Tile show={step >= 4} x={120} y={820} w={1680} h={150} tone="neg" pad={36}>
        <CT size={32}>A bug taught me this</CT>
        <CB size={27} mt={6}>A memory from one chat once leaked into an unrelated chat. Now memory is per conversation by default.</CB>
      </Tile>
    </Slide>
  )
}

const SCEN = ['lookup', 'research', 'coding', 'bugfix', 'refactor', 'data', 'web', 'longdoc', 'ask', 'resume', 'notools', 'looptrap']
const FAILED = new Set(['research', 'longdoc', 'looptrap'])
export function S22Evals({ step }: SceneProps) {
  return (
    <Slide part={P} title="A test suite for the agent" sub="12 small jobs, run on the smallest model I have (4B).">
      <Tile x={120} y={280} w={620} h={690} tone="accent" pad={44}>
        <div style={{ fontSize: 200, fontWeight: 700, letterSpacing: '-0.06em', lineHeight: 1 }}>
          <CountUp to={9} final="9" show dur={1.2} />
          <span style={{ opacity: 0.55, fontSize: 110 }}>/12</span>
        </div>
        <CB size={32} mt={20}>jobs pass</CB>
        <Reveal show={step >= 2} style={{ marginTop: 40, fontSize: 30, lineHeight: 1.35, fontWeight: 600 }}>Every failure showed me what to fix in the harness.</Reveal>
      </Tile>
      <Tile x={760} y={280} w={1040} h={690} pad={44}>
        <div style={{ columnCount: 2, columnGap: 60 }}>
          {SCEN.map((s) => {
            const bad = FAILED.has(s) && step >= 1
            return (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--line)', breakInside: 'avoid' }}>
                <span style={{ fontFamily: mono, fontSize: 28, color: bad ? 'var(--neg)' : 'var(--ink)' }}>{s}</span>
                <Tag color={bad ? 'var(--neg)' : 'var(--ok)'} size={22}>{bad ? 'fail' : 'pass'}</Tag>
              </div>
            )
          })}
        </div>
      </Tile>
    </Slide>
  )
}
