import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ur from "./locales/ur";
import es from "./locales/es";
import ru from "./locales/ru";
import fr from "./locales/fr";
import de from "./locales/de";
import ar from "./locales/ar";
import zh from "./locales/zh";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur },
    es: { translation: es },
    ru: { translation: ru },
    fr: { translation: fr },
    de: { translation: de },
    ar: { translation: ar },
    "zh-CN": { translation: zh },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
