# Hero video assets (`public/videos`)

The home hero (`components/HeroVideo.tsx`) loads **three local MP4s** (muted, looping):

| File | Carousel slide |
|------|----------------|
| `hero-kids-arcade.mp4` | 1 |
| `hero-boy-arcade.mp4` | 2 |
| `hero-girl-dance.mp4` | 3 |

Paths in code look like **`/videos/hero-kids-arcade.mp4`**.

Swap any file while keeping the same name, or rename and update **`HERO_SLIDES`** in `HeroVideo.tsx`.

## Specs

- Codec: **H.264** in `.mp4` works everywhere.
- Mute clips in your editor — the hero always plays **`muted`**.
- Optional fourth file **`hero-pool-fun.mp4`** is unused by the carousel but kept for future swaps.
