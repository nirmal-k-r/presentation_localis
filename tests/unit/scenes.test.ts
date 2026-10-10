import { describe, expect, it } from 'vitest'
import { mainScenes } from '../../src/content/scenes'
import { notes } from '../../src/content/notes'

describe('scene registry', () => {
  it('has unique kebab-case ids and valid step counts', () => {
    const ids = mainScenes.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const s of mainScenes) {
      expect(s.id).toMatch(/^[a-z]+(-[a-z]+)*$/)
      expect(s.steps).toBeGreaterThan(0)
      expect(s.printStep ?? s.steps - 1).toBeLessThan(s.steps)
      expect(s.autoMs?.length ?? 0).toBe(s.steps - 1)
    }
  })
  it('fits a 30 to 45 minute talk', () => {
    const secs = mainScenes.reduce((t, s) => t + s.targetSeconds, 0)
    expect(secs).toBeGreaterThanOrEqual(30 * 60)
    expect(secs).toBeLessThanOrEqual(45 * 60)
  })
  it('every scene has a speaker note', () => {
    expect(mainScenes.filter((s) => !notes[s.id]).map((s) => s.id)).toEqual([])
  })
})
