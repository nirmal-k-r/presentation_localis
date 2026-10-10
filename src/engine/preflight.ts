import { mainScenes } from '../content/scenes'
import { notes } from '../content/notes'

/** Verifies everything the show depends on before it is ever shown. Returns human-readable problems. */
export async function runPreflight(): Promise<string[]> {
  const bad: string[] = []
  const need = (ok: boolean, msg: string) => ok || bad.push(msg)
  need(mainScenes.every((s) => !!notes[s.id]), 'Speaker notes missing for a scene')
  try {
    await Promise.all([document.fonts.load('600 24px "Hanken Grotesk Variable"'), document.fonts.load('500 24px "DM Mono"')])
    need(document.fonts.check('600 24px "Hanken Grotesk Variable"') && document.fonts.check('500 24px "DM Mono"'), 'Fonts failed to load')
  } catch {
    bad.push('Font loading API failed')
  }
  return bad
}
