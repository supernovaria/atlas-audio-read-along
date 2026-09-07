/**
 * Which audio file a section page plays, and whether it can be read along.
 *
 * Chapter 1 ships word-level timings (`src/data/ch1-timing.ts`) next to CBR
 * re-encoded MP3s. Those MP3s are gitignored -- large and reproducible -- so
 * whether they are present depends on who is building:
 *
 * - Staged locally by `scripts/copy-ch1-audio.sh`: play those. Constant
 *   bitrate makes a seek land exactly where the timings say, which is what
 *   clicking a word to jump there needs.
 * - Not staged, but the build resolved published audio (a maintainer build,
 *   where `section.audioLink` points at the CDN): play that instead. It is
 *   the same narration, so the committed timings still line up and the
 *   read-along works; only seeking is coarser, because the published file is
 *   variable bitrate and browsers interpolate the seek position.
 * - Neither: the section has no audio and the page renders no player at all,
 *   which is what a contributor build without credentials already does for
 *   every other section. A player that loads a 404 is worse than no player.
 *
 * The CDN URL is hashed on the section *text*, so a TTS re-render publishes
 * different audio under the same URL. The committed timings have to be
 * regenerated with it -- `pipeline.py --check-remote` in `atlas-podcast`
 * detects that the upstream audio moved.
 */

import { existsSync } from "node:fs"
import { join } from "node:path"
import ch1Timing from "@/data/ch1-timing"

export interface SectionAudio {
  /** What the player loads. */
  audioUrl: string
  /** Word timings driving the read-along, or null when there are none. */
  wordsUrl: string | null
}

/** Is a `/public`-relative URL backed by a file this build will serve? */
function isStaged(publicUrl: string): boolean {
  return existsSync(join(process.cwd(), "public", publicUrl))
}

/**
 * `staged` is injectable so the decision can be tested without a filesystem;
 * callers pass the section's published (CDN) audio URL, if the build has one.
 */
export function resolveSectionAudio(
  chapterNumber: number,
  sectionNumber: number,
  publishedAudioUrl: string | undefined,
  staged: (publicUrl: string) => boolean = isStaged,
): SectionAudio | null {
  const timing = chapterNumber === 1 ? ch1Timing[sectionNumber] : undefined

  if (timing && staged(timing.audioUrl)) {
    return { audioUrl: timing.audioUrl, wordsUrl: timing.wordsUrl }
  }
  if (!publishedAudioUrl) return null
  return { audioUrl: publishedAudioUrl, wordsUrl: timing?.wordsUrl ?? null }
}
