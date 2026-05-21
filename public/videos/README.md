# Video assets (`public/videos`)

The hero carousel can load **remote** MP4s (see `components/HeroVideo.tsx`). **Pexels**
direct `videos.pexels.com` links often return **403** when embedded on your own domain, so the
code uses hosts that allow in-browser playback unless you self-host.

**Recommended for production:** add short, muted H.264 clips here and point `SLIDES` in
`HeroVideo.tsx` at paths like `/videos/hero-1.mp4`.

These **local** MP4s are kept for swapping later or other pages if you want to avoid remote video:

| File                    | Notes                          |
| ----------------------- | ------------------------------ |
| `hero-kids-arcade.mp4`  | H.264 `.mp4`, keep **muted**   |
| `hero-boy-arcade.mp4`   | same                           |
| `hero-girl-dance.mp4`   | same                           |

To use local files in the hero again, add them to the `SLIDES` array in `HeroVideo.tsx`.

## Specs

- Codec: **H.264** in `.mp4` works everywhere.
