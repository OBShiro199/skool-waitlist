export type ReviewTag = 'Quality' | 'No fluff' | 'Clear teaching' | 'Already bought' | 'Life impact' | 'Trust' | 'Consistency'

export const tagHue: Record<ReviewTag, 'blue' | 'teal' | 'amber' | 'green' | 'rose' | 'grey'> = {
  Quality: 'blue',
  'No fluff': 'teal',
  'Clear teaching': 'amber',
  'Already bought': 'green',
  'Life impact': 'rose',
  Trust: 'grey',
  Consistency: 'grey',
}

/** Unedited YouTube comments. Keep the wording exactly as written. */
/** Profile photos in public/avatars, keyed by handle. Handles without one show their initial. */
export const avatars: Record<string, string> = {}

export const reviews: { handle: string; tag: ReviewTag; text: string }[] = [
  { handle: 'SugSean', tag: 'Life impact', text: "Hey Olly, thank you mate. You've helped me a lot with the development of my project. I am about to launch my app. I'm really happy and proud of it." },
  { handle: 'ramsyrama', tag: 'No fluff', text: 'I love how practical your guide is, no fantasy, just the normal, boring, old-school way of achieving success on the internet. Lots of work required, which makes it even more realistic.' },
  { handle: 'untalked', tag: 'Already bought', text: 'Bought your guide and already 5-minutes in I am finding very valuable insight on how to scale, retain users and improve product. Well worth it!' },
  { handle: 'uv-rayss', tag: 'Quality', text: "No one can beat the quality of info you provided, can't be more grateful!" },
  { handle: 'SYBIOTE', tag: 'Quality', text: "6 views I'm early, I'm trying to build a side hustle myself with your videos, really informative, thanks for all the wisdom you impart" },
  { handle: 'osvaldodiasdossantos6625', tag: 'Clear teaching', text: 'Helpful and well presented. Easy to watch from start to finish. Thanks.' },
  { handle: 'Hendrix312002', tag: 'Quality', text: 'This model is absolutely insane! I have been getting incredible results as well. Love the content my dude. Keep it coming.' },
  { handle: 'craigbarber', tag: 'Clear teaching', text: 'So good! Love how you explain complex stuff so simply : )' },
  { handle: 'gobdovan', tag: 'No fluff', text: 'I like how this is actually a holistic guide for a successful product and happy customers.' },
  { handle: 'nelsonlecuane', tag: 'Quality', text: 'bro been watching your content the quality and value is of the highest level, thank you' },
  { handle: 'ta-prgmr', tag: 'Quality', text: 'This was so insightful !! Thanks for sharing man' },
  { handle: 'Frank_learns', tag: 'Already bought', text: 'Very inspiring! Just purchased your course!' },
  { handle: 'Dr_Asif_Khan', tag: 'Trust', text: 'Love this guy and the sound advice here' },
  { handle: 'timsh0e03', tag: 'Quality', text: 'Absolute genius ideas. Why are you giving these out for free?' },
  { handle: 'Hendrix312002', tag: 'Consistency', text: 'Super solid as always. Thank you' },
]
