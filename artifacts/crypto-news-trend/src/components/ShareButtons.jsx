"use client";
import Link from "next/link";
import { Twitter, Facebook, Link2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ canonicalUrl, title }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(canonicalUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="hover:text-[#1DA1F2] transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </Link>
      <Link
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="hover:text-[#1877F2] transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </Link>
      <button
        onClick={copyLink}
        aria-label="Copy article link"
        className="hover:text-purple-400 transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}