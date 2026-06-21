"use client";
import { useParams, usePathname } from "next/navigation";

export function useCurrentLanguage() {
  const params = useParams();
  const pathname = usePathname() || "/";

  // URL se accurate language extract karein
  const pathParts = pathname.split("/").filter(Boolean);
  const currentLocale = (params?.locale as string) || pathParts[0] || "en";

  // Valid languages ki array check karein
  const validLocales = ["ur", "es", "ru", "fr", "de", "ar", "zh"];
  const cleanLocale = validLocales.includes(currentLocale) ? currentLocale : "en";

  // Database se field uthane wala helper function
  const getLocalizedValue = (item: any, baseFieldName: string) => {
    if (!item) return "";
    
    // Agar language English hai, to direct base key return karo (e.g., item.slug)
    if (cleanLocale === "en") {
      return item[baseFieldName] || "";
    }

    // Agar language Arabic/Urdu hai, to 'slug_ar' ya 'title_ar' check karo
    const localizedKey = `${baseFieldName}_${cleanLocale}`;
    
    if (item[localizedKey] && String(item[localizedKey]).trim() !== "") {
      return String(item[localizedKey]).trim();
    }

    // Agar database mein localized value khali (null) ho, to English backup return karo
    return item[baseFieldName] || "";
  };

  return {
    locale: cleanLocale,
    isRtl: cleanLocale === "ur" || cleanLocale === "ar",
    getLocalizedValue,
    pathname,
  };
}