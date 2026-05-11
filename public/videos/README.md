# Hero video assets

Drop the production hero video at:

```
public/videos/hero.mp4
```

It is referenced by `components/HeroVideo.tsx` as `/videos/hero.mp4`.

## Recommended specs

| Property        | Value                                          |
|-----------------|------------------------------------------------|
| Codec           | H.264 (most compatible) or H.265 (smaller)     |
| Container       | `.mp4`                                         |
| Resolution      | 1920×1080 (16:9)                               |
| Duration        | 8–12 seconds, seamless loop                    |
| Audio           | None — video is muted on the page              |
| Captions        | None — no spoken content; mark `aria-hidden`   |
| File size       | < 4 MB after compression                       |
| Frame rate      | 24 or 30 fps                                   |
| Content tone    | Real human moments — connection, eye contact, |
|                 | quiet care; no stock-footage cliché            |

## Reduced motion

`HeroVideo.tsx` honors `prefers-reduced-motion`: the video is paused on first
paint and only the poster is shown. Users can opt back in via the play button.

## Optional alternates (progressive enhancement)

For future optimization you can also ship a WebM source:

```
public/videos/hero.webm     (VP9 — smaller file for Chromium/Firefox)
```

Then update the `<video>` element in `components/HeroVideo.tsx` to include both
`<source>` tags, MP4 listed last as the universal fallback.
