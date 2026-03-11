import Image from "next/image";
import Link from "next/link";
import FooterInteractive from "./footer-client";

export default async function Footer({ dict, locale }) {
  return (
    <footer className="bg-[#111827] pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Brand Section */}
          <div className="lg:w-1/3">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={180} 
                height={40} 
                className="brightness-200" // Logo ko bright karne ke liye
                unoptimized 
              />
            </Link>
            <p className="text-[#94a3b8] text-[15px] leading-relaxed mb-8 max-w-sm">
              {dict.brand.description}
            </p>
            
            {/* Social Icons - Bright White Icons */}
            <div className="flex gap-4">
              {["facebook", "twitter", "whatsapp", "instagram", "telegram"].map((sm) => (
                <a 
                  key={sm} 
                  href="#" 
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 transition-all group"
                >
                  <Image 
                    src={`/svg/${sm}.svg`} 
                    width={20} 
                    height={20} 
                    alt={sm} 
                    className="invert opacity-100 group-hover:scale-110 transition-all" 
                    unoptimized 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <FooterInteractive dict={dict} locale={locale} />
          
        </div>

        {/* Bottom Bar - Clear text */}
        <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[12px] text-[#4f39f6] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} CRYPTONEWS | ALL RIGHTS RESERVED
          </p>
          
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
               <span className="text-[11px] text-[#4f39f6] font-bold uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}