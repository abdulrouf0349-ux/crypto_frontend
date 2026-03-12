'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const languageList = [
  { code: 'en',    name: 'EN' },
  { code: 'ur',    name: 'UR' },
  { code: 'ar',    name: 'AR' },
  { code: 'ru',    name: 'RU' },
  { code: 'es',    name: 'ES' },
  { code: 'fr',    name: 'FR' },
  { code: 'de',    name: 'DE' },
  { code: 'zh-CN', name: 'ZH' },
];

// ✅ All valid locale codes
const LOCALE_CODES = languageList.map(l => l.code);

// ─────────────────────────────────────────────
// SHARED HOOK — locale switch logic
// ─────────────────────────────────────────────
function useLocaleSwitch() {
  const router   = useRouter();
  const pathname = usePathname();
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  useEffect(() => {
    const pathParts    = pathname?.split('/') || [];
    const currentLocale = pathParts[1];
    const found = languageList.find(lang => lang.code === currentLocale);
    setSelectedLanguage(found ? found.name : 'EN');
  }, [pathname]);

  const switchLocale = (newLocale) => {
    const pathParts = pathname.split('/');

    // ✅ FIX: Check against LOCALE_CODES list, NOT length === 2
    // This correctly handles 'zh-cn' (length 5), 'en', 'ur' etc.
    if (LOCALE_CODES.includes(pathParts[1])) {
      pathParts[1] = newLocale;          // Replace existing locale
    } else {
      pathParts.splice(1, 0, newLocale); // Insert locale if missing
    }

    setSelectedLanguage(languageList.find(l => l.code === newLocale)?.name || newLocale.toUpperCase());
    router.push(pathParts.join('/'));
  };

  return { selectedLanguage, switchLocale };
}

// ─────────────────────────────────────────────
// MOBILE BUTTON
// ─────────────────────────────────────────────
export const Lang_Btn_mobile = () => {
  const { selectedLanguage, switchLocale } = useLocaleSwitch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-fit">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="text-white gap-2 flex flex-row items-center cursor-pointer py-1.5 px-3 bg-white/10 rounded-md border border-white/10 hover:bg-white/20 transition-all"
        style={{ zIndex: 100 }}
      >
        <span className="text-[13px] font-bold text-white">{selectedLanguage}</span>
        <span className="text-[10px] text-[#b3c5ce]">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="text-[#2f3c42] cursor-pointer mt-2 bg-white rounded-md shadow-2xl min-w-[110px] z-[9999] absolute right-0 top-full">
          {languageList.map((lang) => (
            <div
              key={lang.code}
              className="py-2.5 px-4 text-[13px] font-medium hover:bg-gray-100 border-b border-gray-100 last:border-0"
              onClick={() => { switchLocale(lang.code); setIsOpen(false); }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// DESKTOP BUTTON
// ─────────────────────────────────────────────
export const Lang_Btn_list4 = () => {
  const { selectedLanguage, switchLocale } = useLocaleSwitch();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-3 relative max-md:hidden">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="text-white gap-1 flex-row px-5 absolute top-0 bottom-[40px] right-4 cursor-pointer flex items-center notranslate skiptranslate"
        style={{ zIndex: 100 }}
      >
        <span className="text-[12px] text-[#b3c5ce]">{selectedLanguage}</span>
        <span className="text-[12px] text-[#b3c5ce]">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div
          className="text-[#2f3c42] cursor-pointer mt-5 absolute p-1 right-6 bg-white rounded-md shadow-lg notranslate skiptranslate"
          style={{ zIndex: 9999 }}
        >
          {languageList.map((lang) => (
            <div
              key={lang.code}
              className="py-1 px-3 text-[13px] text-[#2f3c42] hover:bg-gray-400"
              onClick={() => { switchLocale(lang.code); setIsOpen(false); }}
            >
              {lang.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lang_Btn_mobile;