#!/usr/bin/env bash
# Stage Chapter 1 audio for local development.
#
# The CBR-re-encoded MP3s are large and gitignored, so a fresh clone has the
# timings but no audio and every page falls back to streaming the published
# file. That is fine for reading along, but seeking in a variable-bitrate MP3
# only lands near the word, so anything to do with click-to-seek wants the
# constant-bitrate copies this script produces.
#
# Two ways to get them, tried in this order:
#
#   1. Copy them out of the podcast pipeline's output directory, if it is
#      there. Byte-identical to what the timings were measured against.
#   2. Download the published audio and re-encode it here, which needs only
#      curl and ffmpeg. Same recording and same encoder settings as the
#      pipeline, so the decoded audio comes out bit-identical to it.
#
# It deliberately does NOT touch the committed .words.json files. A pipeline
# output directory can hold timings from a different transcription run: those
# track the same audio, but with slightly different word boundaries than the
# committed set the alignment was tuned and measured against. Refresh timings
# only on purpose, never as a side effect of staging audio.
#
#   ATLAS_AUDIO_SRC=/path/to/output/capabilities   use a pipeline output here
#   --fetch                                        skip it and download instead
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/audio/ch1"
TIMINGS="$ROOT/src/data/ch1-timing.ts"
SRC="${ATLAS_AUDIO_SRC:-$(cd "$ROOT/.." && pwd)/atlas-podcast/output/capabilities}"
SECTIONS=11

fetch_only=false
[ "${1:-}" = "--fetch" ] && fetch_only=true

need() {
  command -v "$1" >/dev/null 2>&1 || { echo "ERROR: $1 is required but not installed." >&2; exit 1; }
}

mkdir -p "$DEST"

if [ "$fetch_only" = false ] && [ -d "$SRC" ]; then
  echo "Staging from the pipeline output: $SRC"
  for i in $(seq 1 $SECTIONS); do
    # Newer pipeline runs append a content hash (…_cbr.<hash>.mp3) for cache
    # busting; older ones don't. Prefer the newest match so a re-render wins,
    # and fail loudly rather than silently copying a stale file.
    mp3=$(ls -t "$SRC"/capabilities_1-"${i}"_*_cbr*.mp3 2>/dev/null | head -1 || true)
    if [ -z "$mp3" ]; then
      echo "ERROR: section $i has no CBR audio in $SRC" >&2
      echo "       Re-run with --fetch to download and encode it instead." >&2
      exit 1
    fi
    cp "$mp3" "$DEST/ch1-s${i}.mp3"
    echo "  s${i}: $(basename "$mp3")"
  done
  echo "Done. MP3s are gitignored; committed .words.json left untouched."
  exit 0
fi

need curl
need ffmpeg

echo "Downloading the published audio and re-encoding to CBR."
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

for i in $(seq 1 $SECTIONS); do
  # The published URL for each section is pinned in the timing table; it
  # embeds the section number, so no parsing of the file's structure is
  # needed to pick the right one out.
  url=$(grep -o "https://[^']*atlas-ch1-s${i}-[^']*\.mp3" "$TIMINGS" | head -1 || true)
  if [ -z "$url" ]; then
    echo "ERROR: no published URL for section $i in $TIMINGS" >&2
    exit 1
  fi
  curl -fsSL "$url" -o "$tmp/s${i}.mp3"
  # Matches the pipeline: 64kbps mono, and no XING header, whose table of
  # contents is what makes a seek in the published file imprecise.
  ffmpeg -v error -y -i "$tmp/s${i}.mp3" -ac 1 -b:a 64k -write_xing 0 "$DEST/ch1-s${i}.mp3"
  echo "  s${i}: $(basename "$url" | cut -c1-24)… -> ch1-s${i}.mp3"
done

echo "Done. MP3s are gitignored; committed .words.json left untouched."
