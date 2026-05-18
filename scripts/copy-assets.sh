#!/usr/bin/env bash
# Sync hero/villain thumbnails and characters.json from ScrumBly/Character and Viloes.
# Names come from folder (heroes) or root PNG (villains); images from Personagem/animacao1.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRUMBLY="${SCRUMBLY_ROOT:-$ROOT/../ScrumBly}"
CHAR_DIR="$SCRUMBLY/Character"
VIL_DIR="$SCRUMBLY/Viloes"

HEROES_OUT="$ROOT/assets/images/heroes"
VILLAINS_OUT="$ROOT/assets/images/villains"
DATA_OUT="$ROOT/data/characters.json"
PREVIEW_SRC="$CHAR_DIR/Preview Free.gif"
PREVIEW_DST="$ROOT/assets/preview.gif"

if [[ ! -d "$CHAR_DIR" ]]; then
  echo "Character folder not found: $CHAR_DIR" >&2
  exit 1
fi

mkdir -p "$HEROES_OUT" "$VILLAINS_OUT" "$(dirname "$DATA_OUT")"

export ROOT SCRUMBLY="$SCRUMBLY"

python3 << 'PY'
import json
import os
import re
import shutil
import unicodedata
from pathlib import Path

root = Path(os.environ["ROOT"])
scrumbly = Path(os.environ["SCRUMBLY"])
char_dir = scrumbly / "Character"
vil_dir = scrumbly / "Viloes"
heroes_out = root / "assets/images/heroes"
villains_out = root / "assets/images/villains"
data_out = root / "data/characters.json"

# Display names when folder name differs from in-game name (optional polish)
FOLDER_DISPLAY_ALIASES = {
    "Rosinha Pop": "Luluzinha Pop",
    "Char 7": "Sombrino",
    "Keko": "Roxildo",
    "Beto Gorrinho": "Beto Boné",
    "Sir Latinha2": "Gelelô",
    "atake": "Foguinho",
    "Parafusito": "R Parafusito",
    "cocoBerto": "Cocoberto",
}

PREFERRED_HERO_ORDER = [
    "Léo Faísca",
    "Brocolino",
    "Tico Turquesa",
    "Nicolauzinho",
    "Sombrino",
    "Char 7",
    "Roxildo",
    "Keko",
    "Espinhudo Zeca",
    "Beto Boné",
    "Beto Gorrinho",
    "Azulito",
    "Ninjoca",
    "Sir Latinha",
    "Gelelô",
    "Sir Latinha2",
    "Foguinho",
    "atake",
    "Luluzinha Pop",
    "Rosinha Pop",
    "R Parafusito",
    "Parafusito",
    "Plin Plon",
    "Cocoberto",
    "cocoBerto",
]

SKIP_CHAR_DIRS = {"Preview Free.gif"}


def slugify(name: str) -> str:
    normalized = unicodedata.normalize("NFD", name)
    ascii_name = "".join(c for c in normalized if unicodedata.category(c) != "Mn")
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", ascii_name.strip().lower())
    return slug.strip("_") or "character"


def display_name(folder_name: str) -> str:
    return FOLDER_DISPLAY_ALIASES.get(folder_name, folder_name)


def animacao1_frame(character_dir: Path) -> Path | None:
    anim_dir = character_dir / "Personagem" / "animacao1"
    if not anim_dir.is_dir():
        return None
    preferred = anim_dir / "frame_001.png"
    if preferred.is_file():
        return preferred
    frames = sorted(anim_dir.glob("frame_*.png"))
    return frames[0] if frames else None


def discover_heroes() -> list[dict]:
    heroes = []
    seen_slugs: set[str] = set()

    for entry in sorted(char_dir.iterdir(), key=lambda p: p.name.lower()):
        if not entry.is_dir() or entry.name in SKIP_CHAR_DIRS:
            continue
        frame = animacao1_frame(entry)
        if frame is None:
            print(f"skip hero (no animacao1): {entry.name}")
            continue

        folder_name = entry.name
        name = display_name(folder_name)
        char_id = slugify(folder_name)

        if char_id in seen_slugs:
            print(f"skip duplicate slug {char_id}: {folder_name}")
            continue
        seen_slugs.add(char_id)

        heroes.append({
            "id": char_id,
            "name": name,
            "folder": folder_name,
            "source": str(frame.relative_to(scrumbly)),
            "_sort_name": name,
        })

    order_index = {n: i for i, n in enumerate(PREFERRED_HERO_ORDER)}

    def sort_key(h: dict) -> int:
        return min(
            order_index.get(h["folder"], 999),
            order_index.get(h["name"], 999),
        )

    heroes.sort(key=sort_key)
    return heroes


def villain_display_name(png_stem: str) -> str:
    return png_stem.replace("_", " ")


def discover_villains() -> list[dict]:
    villains = []
    if not vil_dir.is_dir():
        return villains

    for entry in sorted(vil_dir.iterdir(), key=lambda p: int(p.name) if p.name.isdigit() else 999):
        if not entry.is_dir() or not entry.name.isdigit():
            continue

        frame = animacao1_frame(entry)
        if frame is None:
            print(f"skip villain (no animacao1): Viloes/{entry.name}")
            continue

        root_pngs = sorted(p for p in entry.glob("*.png") if p.parent == entry)
        if root_pngs:
            png_name = root_pngs[0].stem
            name = villain_display_name(png_name)
            char_id = slugify(png_name)
        else:
            name = f"Vilão {entry.name}"
            char_id = f"villain_{entry.name}"

        villains.append({
            "id": char_id,
            "name": name,
            "folder": f"Viloes/{entry.name}",
            "order": int(entry.name),
            "source": str(frame.relative_to(scrumbly)),
        })

    villains.sort(key=lambda v: v["order"])
    return villains


heroes = discover_heroes()
villains = discover_villains()

for h in heroes:
    src = scrumbly / h["source"]
    dst = heroes_out / f"{h['id']}.png"
    shutil.copy2(src, dst)
    h["image"] = f"assets/images/heroes/{h['id']}.png"
    print(f"hero: {h['name']} ({h['folder']}) <- {src.name}")

for v in villains:
    src = scrumbly / v["source"]
    dst = villains_out / f"{v['id']}.png"
    shutil.copy2(src, dst)
    v["image"] = f"assets/images/villains/{v['id']}.png"
    print(f"villain: {v['name']} ({v['folder']}) <- {src.name}")

def public_entry(entry: dict) -> dict:
    return {k: entry[k] for k in ("id", "name", "image", "folder", "order") if k in entry}

out = {
    "heroes": [public_entry(h) for h in heroes],
    "villains": [public_entry(v) for v in villains],
}
data_out.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"wrote {data_out} ({len(heroes)} heroes, {len(villains)} villains)")
PY

if [[ -f "$PREVIEW_SRC" ]]; then
  cp "$PREVIEW_SRC" "$PREVIEW_DST"
  echo "preview: $PREVIEW_DST"
fi

echo "Done."
