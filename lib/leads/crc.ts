// crc32 of the UTF-8 bytes, masked into int32: must match the loader's
// zlib.crc32(v.encode()) & 0x7fffffff exactly (see tests/leads.test.ts).
const TABLE = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

export function crc(value: string): number {
  let c = 0xffffffff
  for (const b of new TextEncoder().encode(value)) c = TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return ((c ^ 0xffffffff) >>> 0) & 0x7fffffff
}
