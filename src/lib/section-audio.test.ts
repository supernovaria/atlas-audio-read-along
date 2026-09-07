import { describe, it, expect } from "vitest"
import { resolveSectionAudio } from "./section-audio"

const CDN = "https://atlas.foreviewusercontent.com/audio/atlas-ch1-s1-abc.mp3"
const staged = () => true
const notStaged = () => false

describe("resolveSectionAudio", () => {
  // Locally staged audio is constant bitrate, so a seek lands where the word
  // timings say it will. Preferring the published file instead would make
  // clicking a word jump to roughly, not exactly, the right place.
  it("prefers the staged local file over the published one", () => {
    const audio = resolveSectionAudio(1, 1, CDN, staged)
    expect(audio).toEqual({
      audioUrl: "/audio/ch1/ch1-s1.mp3",
      wordsUrl: "/audio/ch1/ch1-s1.words.json",
    })
  })

  // A reviewer who clones the branch has the committed timings but not the
  // gitignored MP3s. Falling back to the published narration means the
  // read-along works for them without staging anything first.
  it("falls back to the published audio and keeps the word timings", () => {
    const audio = resolveSectionAudio(1, 1, CDN, notStaged)
    expect(audio).toEqual({ audioUrl: CDN, wordsUrl: "/audio/ch1/ch1-s1.words.json" })
  })

  // A contributor build has neither file. Returning audio anyway would render
  // a player that loads a 404 -- worse than the no-player state the rest of
  // the site already shows without credentials.
  it("reports no audio when neither source exists", () => {
    expect(resolveSectionAudio(1, 1, undefined, notStaged)).toBeNull()
  })

  // Only chapter 1 has timings. Every other section must still play its
  // published audio, just without a read-along.
  it("plays published audio without timings for chapters that have none", () => {
    const audio = resolveSectionAudio(4, 2, CDN, notStaged)
    expect(audio).toEqual({ audioUrl: CDN, wordsUrl: null })
  })

  // Chapter 1 stops at section 11; a section past the end must not be treated
  // as having audio just because its chapter does.
  it("reports no audio for a chapter 1 section with no timings and no published file", () => {
    expect(resolveSectionAudio(1, 99, undefined, staged)).toBeNull()
  })
})
