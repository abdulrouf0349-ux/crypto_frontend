'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Lang_Btn_mobile = () => {
  const router = useRouter();
  const pathname = usePathname(); // Next.js App Router hook
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const languageList = [
    { code: 'en', name: 'EN' },
    { code: 'ur', name: 'UR' },
    { code: 'ar', name: 'AR' },
    { code: 'ru', name: 'RU' },
    { code: 'es', name: 'ES' },
    { code: 'fr', name: 'FR' },
    { code: 'de', name: 'DE' },
    { code: 'zh-CN', name: 'ZH' },
  ];

  // Update selected language based on pathname
  useEffect(() => {
    const pathParts = pathname?.split('/');
    const currentLocale = pathParts?.[1]; // first segment after '/'
    const found = languageList.find(lang => lang.code === currentLocale);
    if (found) setSelectedLanguage(found.name);
    else setSelectedLanguage('EN'); // default if not found
  }, [pathname]);

  const toggleList = () => setIsOpen(!isOpen);

 const switchLocale = (newLocale) => {
  const pathParts = pathname.split('/');
  
  // ✅ FIX: Length check karne ke bajaye list se check karein
  // pathParts[1] wo pehla segment hai jo locale ho sakta hai (e.g., 'en' or 'zh-CN')
  if (LOCALE_CODES.includes(pathParts[1])) {
    pathParts[1] = newLocale;          // Purane locale ko naye se badal do
  } else {
    pathParts.splice(1, 0, newLocale); // Agar locale nahi tha, toh insert karo
  }

  const targetPath = pathParts.join('/') || '/';
  router.push(targetPath);
  setIsOpen(false);
};

// Lang_Btn_mobile component ka return part:
return (
  <div className="relative w-fit"> 
    <div
      onClick={toggleList}
      className="text-white gap-2 flex flex-row items-center cursor-pointer py-1.5 px-3 bg-white/10 rounded-md border border-white/10 hover:bg-white/20 transition-all"
      style={{ zIndex: 100 }}
    >
      <span className="text-[13px] font-bold text-white">{selectedLanguage}</span>
      <span className="text-[10px] text-[#b3c5ce]">{isOpen ? '▲' : '▼'}</span>
    </div>

    {isOpen && (
      <div
        /* right-0 lagaya taake ye container ke andar hi khule */
        className="text-[#2f3c42] cursor-pointer mt-2 bg-white rounded-md shadow-2xl min-w-[110px] z-[9999] absolute right-0 top-full"
      >
        {languageList.map((lang) => (
          <div
            key={lang.code}
            className="py-2.5 px-4 text-[13px] font-medium hover:bg-gray-100 border-b border-gray-100 last:border-0"
            onClick={() => switchLocale(lang.code)}
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
