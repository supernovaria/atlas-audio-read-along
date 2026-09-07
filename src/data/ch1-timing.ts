/**
 * Chapter 1's audio: the local files the read-along prefers, and the
 * published file each one was made from.
 *
 * `publishedUrl` is pinned rather than derived. The site builds that URL from
 * a hash of the narration text, which only a build with credentials resolves,
 * so without it a contributor clone would have word timings and nothing to
 * play. Pinning the URL lets any clone hear the same narration these timings
 * were measured against.
 *
 * All three fields describe one recording. A TTS re-render invalidates the
 * whole file at once: `pipeline.py --check-remote` in `atlas-podcast` reports
 * when the published audio has moved, and regenerating the timings is the
 * same operation as refreshing these URLs.
 */
export type SectionTiming = {
  audioUrl: string
  wordsUrl: string
  publishedUrl: string
}

const ch1Timing: Record<number, SectionTiming> = {
  1: {
    audioUrl: '/audio/ch1/ch1-s1.mp3',
    wordsUrl: '/audio/ch1/ch1-s1.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s1-8a5836a6ac014cbb7fc5df3820c5dfdfa8c0f5ed9361b88da5e1b9a5442f980f.mp3',
  },
  2: {
    audioUrl: '/audio/ch1/ch1-s2.mp3',
    wordsUrl: '/audio/ch1/ch1-s2.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s2-9b0f275664522871f07fbec826917a64373327e7bd8e749e62ad95756248fe13.mp3',
  },
  3: {
    audioUrl: '/audio/ch1/ch1-s3.mp3',
    wordsUrl: '/audio/ch1/ch1-s3.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s3-cbfc6e12ff487f39bb78aec9c72cb85e6617e1339f214bc2739da66fa9536050.mp3',
  },
  4: {
    audioUrl: '/audio/ch1/ch1-s4.mp3',
    wordsUrl: '/audio/ch1/ch1-s4.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s4-ad67bfda80c99d1044eb0fd8f97765b7337d0a7f93d7e49ac11001260af7d123.mp3',
  },
  5: {
    audioUrl: '/audio/ch1/ch1-s5.mp3',
    wordsUrl: '/audio/ch1/ch1-s5.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s5-0bbe8ac41033408878cf0b5454d5ca0ead6891f880e04d3d1804c8d450958978.mp3',
  },
  6: {
    audioUrl: '/audio/ch1/ch1-s6.mp3',
    wordsUrl: '/audio/ch1/ch1-s6.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s6-4b28b9317e94e609e15ca19b6ab61331e9d24416092df24fc84029f46e9b7fba.mp3',
  },
  7: {
    audioUrl: '/audio/ch1/ch1-s7.mp3',
    wordsUrl: '/audio/ch1/ch1-s7.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s7-15556217745ebcbfddca5e9a1b9763d7703db3d11580d17f765191377bf25f3e.mp3',
  },
  8: {
    audioUrl: '/audio/ch1/ch1-s8.mp3',
    wordsUrl: '/audio/ch1/ch1-s8.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s8-7e5fa4732a8a156817aeb5d0fd523d37bce64eeaaa9db8154de3130e03a0f7f2.mp3',
  },
  9: {
    audioUrl: '/audio/ch1/ch1-s9.mp3',
    wordsUrl: '/audio/ch1/ch1-s9.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s9-edc893473eaef3e9f37e17e0fccfcb964807541d39a921734ffa8b93613eb169.mp3',
  },
  10: {
    audioUrl: '/audio/ch1/ch1-s10.mp3',
    wordsUrl: '/audio/ch1/ch1-s10.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s10-a650d1b5f2b9ab719ba78e60124d71c1c753ca6f8856367fd6b2364faf53b05d.mp3',
  },
  11: {
    audioUrl: '/audio/ch1/ch1-s11.mp3',
    wordsUrl: '/audio/ch1/ch1-s11.words.json',
    publishedUrl: 'https://atlas.foreviewusercontent.com/audio/atlas-ch1-s11-7683f418ed05758dad588cddbba6cd343853fb647d7b6417501c74b848004628.mp3',
  },
}

export default ch1Timing
