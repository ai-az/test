#!/usr/bin/env bash
# Encode the rendered frame sequence into the delivery MP4.
set -euo pipefail
cd "$(dirname "$0")"
ffmpeg -y -framerate 30 -i frames/f%05d.jpg \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -level 4.1 \
  -x264-params "keyint=60:min-keyint=30" -movflags +faststart \
  ../first-aid-vertical.mp4
