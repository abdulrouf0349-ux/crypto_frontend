import Image from "next/image";
import Link from "next/link";
import Language_Button from "../short-components/language-button";
import { HeaderClient } from "./header-client";

const icon2 = "/images/logo.png";

export const Header = async ({ dict, locale }) => {
  return (
    <header className="bg-[#0f172a] border-b border-white/5 w-full h-16 sticky top-0 z-[100] shadow-md">
      <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-4 sm:px-8 lg:px-12">
        
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link href={`/${locale}`}>
            <Image 
              src={icon2} 
              alt="Cryptonews" 
              width={140} 
              height={30} 
              unoptimized 
              className="brightness-110"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <HeaderClient dict={dict} locale={locale} />

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <Language_Button />
          </div>
        </div>
      </div>
    </header>
  );
};