#!/usr/bin/env bash
# Stage Chapter 1 audio for local development.
#
# The CBR-re-encoded MP3s are large and gitignored, so a fresh clone has the
# timings but no audio. This copies the MP3s out of the podcast pipeline's
# output directory under the stable ch1-sN.mp3 names that
# src/data/ch1-timing.ts refers to.
#
# It deliberately does NOT touch the committed .words.json files. A pipeline
# output directory can hold timings from a different transcription run: those
# track the same audio, but with slightly different word boundaries than the
# committed set the alignment was tuned and measured against. Refresh timings
# only on purpose, never as a side effect of staging audio.
#
# Override the source with:  ATLAS_AUDIO_SRC=/path/to/output/capabilities
set -euo pipefail

DEST="$(cd "$(dirname "$0")/.." && pwd)/public/audio/ch1"
SRC="${ATLAS_AUDIO_SRC:-$(cd "$(dirname "$0")/../.." && pwd)/atlas-podcast/output/capabilities}"

if [ ! -d "$SRC" ]; then
  echo "ERROR: audio source not found: $SRC" >&2
  echo "Set ATLAS_AUDIO_SRC to the pipeline's output/capabilities directory." >&2
  exit 1
fi

mkdir -p "$DEST"
for i in $(seq 1 11); do
  # Newer pipeline runs append a content hash (…_cbr.<hash>.mp3) for cache
  # busting; older ones don't. Prefer the newest match so a re-render wins,
  # and fail loudly rather than silently copying a stale file.
  mp3=$(ls -t "$SRC"/capabilities_1-"${i}"_*_cbr*.mp3 2>/dev/null | head -1 || true)
  if [ -z "$mp3" ]; then
    echo "ERROR: section $i has no CBR audio in $SRC" >&2
    exit 1
  fi
  cp "$mp3" "$DEST/ch1-s${i}.mp3"
  echo "  s${i}: $(basename "$mp3")"
done

echo "Done. MP3s are gitignored; committed .words.json left untouched."
