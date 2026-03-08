#!/usr/bin/env bash
# Извлекает один кадр из видео «О компании» и сохраняет как превью (poster).
# Требуется: ffmpeg, файл public/assets/about/about-video.mp4
# Запуск из корня проекта: bash scripts/extract-about-video-poster.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VIDEO="$ROOT/public/assets/about/about-video.mp4"
OUT="$ROOT/public/assets/about/about-video-poster.jpg"

if ! command -v ffmpeg &>/dev/null; then
  echo "Ошибка: ffmpeg не найден. Установите ffmpeg (brew install ffmpeg / apt install ffmpeg)."
  exit 1
fi

if [[ ! -f "$VIDEO" ]]; then
  echo "Ошибка: видео не найдено: $VIDEO"
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
# Кадр на 0.5 с (логотип «Большая Уборка» обычно в начале)
ffmpeg -y -i "$VIDEO" -ss 00:00:00.5 -vframes 1 -q:v 3 "$OUT"
echo "Превью сохранено: $OUT"
