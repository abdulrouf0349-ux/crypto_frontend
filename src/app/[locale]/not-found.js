'use client'

import React from 'react'
import { FiTag, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NotFound = () => {
  const pathname = usePathname()

  // ✅ URL se locale nikalo — /en/news/xyz → en
  const locale = pathname?.split('/')?.[1] || 'en'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white font-sans px-4">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
        <FiTag size={32} className="text-slate-300" />
      </div>
      <h1 className="text-2xl font-black text-slate-900">Article Not Found</h1>
      <p className="text-slate-400 text-sm text-center max-w-sm">
        This page may have been removed or the link is incorrect.
      </p>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-500 transition-all"
      >
        <FiArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  )
}

export default NotFound