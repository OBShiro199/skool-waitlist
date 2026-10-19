import { DotArt } from './DotArt'

const mark = ['....#', '...##', '..o##', '.oo##', 'ooo##']

export function Logo() {
  return <DotArt rows={mark} cell={4} className="h-4 w-4 flex-none" />
}
