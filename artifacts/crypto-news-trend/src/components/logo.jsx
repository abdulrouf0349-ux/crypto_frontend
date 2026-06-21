import { Link } from 'lucide-react'
import React from 'react'

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 mb-4">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2em"
    height="2em"
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="16" fill="#f97316" />
    {/* paths unchanged */}
  </svg>

  <span className="font-display font-bold text-xl tracking-tight">
    <span className="text-white">Crypto</span>
    <span className="text-orange-500">NewsTrend</span>
  </span>
</Link>
  )
}

export default Logo