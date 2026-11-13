// Lander Library: every lander's facts in one place. The library grid, the clone panel and the
// rebuild prompt all read from here (spec: /home/user/lander-library/LanderLibrary-BUILD.md, section 5).

export type Lander = {
  slug: string
  name: string
  style: string
  what: string
  tagline: string
  fonts: [string, string]
  palette: string
  layout: string
  stillPrompt: string
  motionPrompt: string
  video: string
  poster: string
  sprites: string[]
}

const hero = (slug: string) => ({ video: `/landers/heroes/${slug}.mp4`, poster: `/landers/heroes/${slug}.jpg` })
const sprites = (slug: string, names: string[]) => names.map((n) => `/landers/sprites/${slug}/${n}.webp`)

export const LANDERS: Lander[] = [
  {
    slug: 'perihelion',
    name: 'Perihelion',
    style: 'Cinematic space',
    what: 'Satellite crop data for small farms: see which field needs water before it shows.',
    tagline: 'See thirst before it shows.',
    fonts: ['Instrument Serif', 'Geist'],
    palette: 'night #05070B · starlight #E8E4DA · dawn #F2A65A',
    layout: 'Full-bleed dark hero, a tiny headline set low-left like a film title, specs in a thin mono row along the bottom.',
    stillPrompt: 'Cinematic photograph from low Earth orbit at dawn: the curved terminator line slicing across farmland, patchwork fields catching the first amber light while the rest sits in deep blue shadow, a small boxy satellite with gold foil in the upper right, thin atmosphere glowing along the horizon, real photographic grain, 35mm look, deep blacks, no text, no logos.',
    motionPrompt: 'Very slow push in towards the horizon as dawn light sweeps across the fields below, the satellite drifts gently and its solar panels catch a glint, atmosphere shimmers, calm and weightless, steady camera, seamless loop feel, 10 seconds, 16:9, no text.',
    ...hero('perihelion'),
    sprites: sprites('perihelion', ['satellite', 'wheat', 'field-tile', 'moon', 'sun-glint']),
  },
  {
    slug: 'proofbox',
    name: 'Proofbox',
    style: 'Claymation',
    what: 'Stock and order planning for small bakeries, so nothing sells out by 10am.',
    tagline: 'Bake what sells. Sell out at closing, not at ten.',
    fonts: ['Fraunces', 'Inter'],
    palette: 'cream #F6EBDD · terracotta #C8553D · dough #E9C995 · cocoa #3B2A20',
    layout: 'Warm cream page, the clay video as a full-bleed hero with a soft rounded inset like a shop window, headline centred and chunky, menu-board style pricing.',
    stillPrompt: 'Handmade claymation scene: a tiny clay bakery counter with lumpy clay loaves, croissants and a round clay oven with a glowing orange mouth, visible thumbprints and tool marks in the plasticine, soft warm studio lighting, shallow depth of field, cream and terracotta palette, stop-motion set photographed on a real tabletop, no text, no logos.',
    motionPrompt: 'Stop-motion animation at 12 frames per second: the clay oven door pops open and three loaves hop out one by one onto the counter, a croissant wobbles and settles, a tiny puff of clay steam rises, slight frame-to-frame jitter like real stop-motion, locked-off camera, 8 seconds, 16:9, no text.',
    ...hero('proofbox'),
    sprites: sprites('proofbox', ['croissant', 'loaf', 'oven', 'rolling-pin', 'steam']),
  },
  {
    slug: 'saltmarsh',
    name: 'Saltmarsh',
    style: 'Watercolour',
    what: 'A walking journal that turns your routes into a painted map of the year.',
    tagline: 'Every walk you take, painted into the year.',
    fonts: ['Cormorant Garamond', 'Inter'],
    palette: 'paper #F4EFE6 · sea #5B7F8E · ochre #C79A4B · ink #2A2B2E',
    layout: 'Feels like a sketchbook page: a deckled edge where the hero video meets the page, handwritten-style italics only in the headline, generous margins.',
    stillPrompt: 'Loose watercolour painting on cold-press paper of a coastal salt marsh at low tide, winding blue channels, ochre reed beds, soft grey sky, granulating pigment and blooms where wet paint met, visible paper tooth, white paper left unpainted at the edges, no text, no logos.',
    motionPrompt: 'Watercolour paint visibly blooming and spreading across the paper as if painted in real time, a winding blue channel fills with pigment from left to right, reeds appear in soft ochre strokes, wet sheen catches light then dries matte, gentle and slow, 10 seconds, 16:9, no text.',
    ...hero('saltmarsh'),
    sprites: sprites('saltmarsh', ['egret', 'reeds', 'shell', 'rowing-boat', 'cloud']),
  },
  {
    slug: 'foldwell',
    name: 'Foldwell',
    style: 'Paper cut-out',
    what: 'Tax filing for freelancers: snap receipts all year, file in ten minutes.',
    tagline: 'Snap receipts all year. File in ten minutes.',
    fonts: ['Geist', 'Instrument Serif (accents)'],
    palette: 'pine #2F4A3A · sage #8DA67B · paper #E9E2CF · post red #C2452D',
    layout: 'Layered sections that overlap like the paper in the video, each with a soft drop shadow. One red accent, on the button only.',
    stillPrompt: 'Layered paper cut-out diorama: hills in five shades of green card stacked with real depth and soft shadows between layers, a winding paper river, a tiny red paper boat, small paper houses, warm side lighting showing paper fibres and cut edges, photographed as a real handmade craft, no text, no logos.',
    motionPrompt: 'Stop-motion paper animation: the red paper boat glides along the river, the paper layers shift slightly for parallax as the camera trucks right, a paper sun slides up behind the hills, small handmade jitter, 10 seconds, 16:9, no text.',
    ...hero('foldwell'),
    sprites: sprites('foldwell', ['red-boat', 'house', 'tree', 'sun', 'cloud']),
  },
  {
    slug: 'paperwing',
    name: 'Paperwing',
    style: 'Origami',
    what: 'Crew and flight scheduling for small airlines and charter operators.',
    tagline: 'Every crew, every tail, every leg. One calm board.',
    fonts: ['Inter Tight', 'Inter'],
    palette: 'sky #DCE6EE · paper #FBFAF7 · navy #1E2A3A · crane red #D2453B',
    layout: 'Light and airy with a thin grid like a flight chart laid over the full-bleed video and continuing down the page.',
    stillPrompt: 'A white origami crane with one red wing tip perched on a folded paper city of white buildings, soft pale blue sky backdrop made of paper, crisp folds and creases, soft shadows, photographed like a real paper craft set, no text, no logos.',
    motionPrompt: 'Paper animation: the origami crane unfolds its wings with crisp paper sounds implied, lifts off and glides across the folded paper city, small paper clouds slide past, slight stop-motion texture, camera follows gently, 10 seconds, 16:9, no text.',
    ...hero('paperwing'),
    sprites: sprites('paperwing', ['crane', 'cloud', 'star', 'boat', 'tower']),
  },
  {
    slug: 'smallport',
    name: 'Smallport',
    style: 'Tilt-shift miniature',
    what: 'Shipping and stock tracking for independent coffee roasters.',
    tagline: 'Know where every sack is, from origin to roaster.',
    fonts: ['Archivo', 'Geist'],
    palette: 'harbour #2C5A73 · container #E07A3F · crema #F3E9DC · charcoal #222222',
    layout: 'A bold, practical page like a shipping manifest: a big full-bleed video hero, then a dense spec table set in the narrow face.',
    stillPrompt: 'Tilt-shift aerial photograph of a small harbour at golden hour that looks like a toy model: colourful shipping containers, a crane loading a small cargo ship, tiny trucks, sacks of coffee on the quay, strong blur at top and bottom, saturated miniature look, no readable text, no logos.',
    motionPrompt: 'Tilt-shift time-lapse look: the crane swings a container onto the ship, tiny trucks move along the quay, water ripples, slightly sped-up miniature motion, static high camera, 10 seconds, 16:9, no text.',
    ...hero('smallport'),
    sprites: sprites('smallport', ['cargo-ship', 'container', 'crane', 'truck', 'coffee-sacks']),
  },
]

export const getLander = (slug: string) => LANDERS.find((l) => l.slug === slug)

export const TASTE_RULES = [
  'No purple-to-blue gradients, no glassmorphism cards, no glowing orbs, no emoji in headings.',
  'No "Supercharge / Unlock / Revolutionise" copy, no three identical feature cards in a row.',
  'Use Geist or Inter for interface text and one characterful display face for headlines.',
  'Use the given fonts and palette, real typographic hierarchy and plenty of space.',
  "Copy is short, specific and believable, written for the startup's real customer.",
  'No real brands, logos or people anywhere.',
]

/** The Claude Code prompt shown in the clone panel (spec section 7, full-bleed hero). */
export const rebuildPrompt = (l: Lander) =>
  `Build a single landing page for ${l.name}: ${l.what} Use ${l.fonts[0]} for headlines and ${l.fonts[1]} for body text, and this palette: ${l.palette}. Layout: ${l.layout} Put the hero video at /heroes/${l.slug}.mp4 (poster /heroes/${l.slug}.jpg) as a full-bleed hero background, autoplaying, muted, looping and playsInline, with the headline, one line of copy and one button on top of it; show the poster instead when the visitor prefers reduced motion. Make it feel like a premium product site: a sticky nav that turns solid on scroll, a staggered word-by-word headline reveal, a marquee of customer names, a large product window showing the real app UI, a bento grid of features with cursor spotlight, count-up stats, a testimonial wall, three pricing plans with the middle one highlighted, an FAQ accordion, a closing section over the hero video, and a full footer. Sections fade and rise in on scroll; respect reduced motion. Float the companion images from /companions/${l.slug}/ gently around the sections as decoration. Follow these taste rules:\n- ${TASTE_RULES.join('\n- ')}`
