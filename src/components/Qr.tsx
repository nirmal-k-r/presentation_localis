import QRCode from 'qrcode'
import { useMemo } from 'react'

/** QR code drawn as SVG rects on a white tile, so it scans in both themes. */
export function Qr({ text, size, label }: { text: string; size: number; label: string }) {
  const { n, cells } = useMemo(() => {
    const q = QRCode.create(text, { errorCorrectionLevel: 'M' })
    const n = q.modules.size
    const cells: string[] = []
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules.get(x, y)) cells.push(`M${x} ${y}h1v1h-1z`)
    return { n, cells: cells.join('') }
  }, [text])
  const pad = 2
  return (
    <svg width={size} height={size} viewBox={`${-pad} ${-pad} ${n + 2 * pad} ${n + 2 * pad}`} shapeRendering="crispEdges" role="img" aria-label={label}>
      <rect x={-pad} y={-pad} width={n + 2 * pad} height={n + 2 * pad} fill="#ffffff" rx={1.2} />
      <path d={cells} fill="#111318" />
    </svg>
  )
}
