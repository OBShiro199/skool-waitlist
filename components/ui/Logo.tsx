/** Brand mark: Olly with the stack logos. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.webp"
      alt=""
      width={size}
      height={size}
      className="flex-none rounded-box border border-hairline object-cover"
      style={{ width: size, height: size }}
    />
  )
}
