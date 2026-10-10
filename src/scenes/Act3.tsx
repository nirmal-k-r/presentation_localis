import { motion } from 'motion/react'
import type { SceneProps } from '../content/scenes'
import { Slide } from '../components/Slide'
import { Code } from '../components/Code'
import { CB, CT, Stat, Tag, Tile, mono } from '../components/ui'
import { ease, useDur } from '../engine/motion'
import { abs } from '../styles/type'

const P = 3

export function S10Gap({ step }: SceneProps) {
  const d = useDur()
  return (
    <Slide part={P} title="Most models can't be split like this" sub="The library I use, mlx-lm, only supports a few model types out of the box.">
      <Tile x={120} y={280} w={700} h={690} pad={40} top>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 36px)', gap: 12 }}>
          {Array.from({ length: 130 }, (_, i) => (
            <motion.div key={i} initial={false} animate={{ background: step >= 1 && i < 14 ? 'var(--cobalt)' : 'var(--card2)' }} transition={{ duration: d(0.4), delay: d(i < 14 ? i * 0.05 : 0) }} style={{ width: 36, height: 36, borderRadius: 8 }} />
          ))}
        </div>
        <CB size={25} mt={22}>Each square is a type of model. The lit ones can be split across machines.</CB>
      </Tile>
      <Tile show={step >= 1} x={840} y={280} w={960} h={280} tone="accent"><Stat value="14 of about 130" label="model types can be split across machines" size={96} /></Tile>
      <Code code={'ValueError: The model does not support pipelining\n            but a pipeline_group was provided'} lang="plain" show={step >= 2} size={26} speed={90} style={abs(840, 580, { width: 960 })} />
      <Tile show={step >= 2} x={840} y={810} w={960} h={160} tone="inset" delay={0.3}><CB size={29} mt={0}>For every other model, it simply stops with this error.</CB></Tile>
    </Slide>
  )
}

const PATCH = `# serve.py: same command line as: python -m mlx_lm server
import mlx_lm.utils, mlx_lm.server

def planned_load(path, group):
    model, tok = lazy_load(path)        # nothing read yet
    stack = find_layer_stack(model)     # the list of layers
    plan = auto_split(group, layer_bytes(stack))
    keep_only(stack, plan[group.rank()])
    return model, tok

mlx_lm.utils.sharded_load = planned_load
mlx_lm.server.sharded_load = planned_load
mlx_lm.server.main()                    # then the normal server`
const NOTES = [
  ['Load lazily', 'Nothing is read from disk until it is needed.'],
  ['Find the layers', 'It finds the model\'s list of layers by itself, so it works for many model types.'],
  ['Keep only this Mac\'s share', 'The other layers are never loaded, so they use no memory.'],
]
export function S11Patch({ step }: SceneProps) {
  return (
    <Slide part={P} title="My fix: a small Python wrapper" sub="I change how mlx-lm loads a model. I don't edit its code.">
      <Code code={PATCH} show file="serve.py (simplified)" size={24} speed={80} delay={0.3} style={abs(120, 280, { width: 1040 })} />
      <div style={abs(120, 905, { fontSize: 25, color: 'var(--muted)' })}>This is monkey-patching: it changes mlx-lm in memory only. Nothing on disk is modified.</div>
      {NOTES.map(([t, b], i) => (
        <Tile key={t} show={step >= i + 1} x={1180} y={280 + i * 230} w={620} h={210} tone={i === 2 ? 'accent' : 'plain'} pad={32}>
          <CT size={34}>{t}</CT>
          <CB size={25}>{b}</CB>
        </Tile>
      ))}
    </Slide>
  )
}

const CAP = [10, 10, 5]
const EVEN = [6.7, 6.7, 6.7]
const PLAN = [8.4, 6.6, 5]
export function S12Planner({ step }: SceneProps) {
  const d = useDur()
  const load = step >= 2 ? PLAN : step >= 1 ? EVEN : [0, 0, 0]
  const bad = (i: number) => step === 1 && EVEN[i] > CAP[i]
  const U = 62
  return (
    <Slide part={P} title="Deciding how many layers each Mac gets" sub="If the Macs have different free memory, an even split can overflow.">
      <Tile x={120} y={280} w={1120} h={520} pad={44}>
        {CAP.map((c, i) => (
          <div key={i} style={{ position: 'relative', height: 150 }}>
            <div style={{ fontSize: 27, position: 'absolute', top: 18, opacity: 0.85 }}>Mac {i + 1} · {c} GB free</div>
            <div style={{ position: 'absolute', left: 300, top: 0, width: c * U, height: 64, borderRadius: 12, background: 'var(--card2)' }} />
            <motion.div initial={false} animate={{ width: load[i] * U, background: bad(i) ? 'var(--neg)' : step >= 2 ? 'var(--ok)' : 'var(--cobalt)' }} transition={{ duration: d(1), ease }} style={{ position: 'absolute', left: 300, top: 0, height: 64, borderRadius: 12 }} />
          </div>
        ))}
      </Tile>
      <Tile show={step === 1} x={1260} y={280} w={540} h={520} tone="neg"><CT size={40}>Even split</CT><CB size={29}>Every Mac gets the same number of layers. The smallest Mac runs out of memory.</CB></Tile>
      <Tile show={step >= 2} x={1260} y={280} w={540} h={520} tone="ok"><CT size={40}>Smarter split</CT><CB size={29}>Try the possible splits and pick the one where the fullest Mac is least full.</CB></Tile>
      <Tile show={step >= 3} x={120} y={820} w={1680} h={150} tone="inset" pad={36}>
        <CB size={30} mt={0}>It copes with Macs of different sizes and layers of different sizes. If a model can't fit at all, it says so clearly.</CB>
        <div style={{ marginTop: 10 }}><Tag size={18}>Illustrative numbers</Tag></div>
      </Tile>
    </Slide>
  )
}

const MODELS = [
  ['Ministral-3 14B', 'Matches a single Mac exactly.'],
  ['gpt-oss-20b', 'Matches exactly. 26–29 tokens per second.'],
  ['Qwen3-Coder 30B', 'Already supported, so I use the standard path.'],
]
export function S13Verify({ step }: SceneProps) {
  return (
    <Slide part={P} title="Checking that the split gives the right answer" sub="Splitting a model must not change what it says.">
      <Tile x={120} y={280} w={820} h={420} tone="accent">
        <div style={{ fontFamily: mono, fontSize: 70, fontWeight: 500, letterSpacing: '-0.04em' }}>max|diff| = 0</div>
        <CB size={29} mt={22}>Same prompt, same settings. The three-Mac answer matches the single-Mac answer exactly.</CB>
      </Tile>
      {MODELS.map(([t, b], i) => (
        <Tile key={t} show={step >= 1} delay={i * 0.2} x={960} y={280 + i * 145} w={840} h={130} pad={30} tone="inset" style={{ flexDirection: 'row', alignItems: 'center', gap: 28 }}>
          <div style={{ fontSize: 34, fontWeight: 650, width: 330, flexShrink: 0 }}>{t}</div>
          <div style={{ fontSize: 26, opacity: 0.8, lineHeight: 1.3 }}>{b}</div>
        </Tile>
      ))}
      <Tile show={step >= 2} x={120} y={720} w={1680} h={240} pad={44}>
        <CT size={44}>More checks</CT>
        <CB size={30} mt={14}>I also test the planner against a brute-force search on 300 random setups, using a Python self-test script that runs on tiny random models.</CB>
      </Tile>
    </Slide>
  )
}
