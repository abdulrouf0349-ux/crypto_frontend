export function getSlugByLocale(article, locale) {
  switch (locale) {
    case "ar":
      return article.slug_ar || article.slug;
    case "ur":
      return article.slug_ur || article.slug;
    case "es":
      return article.slug_es || article.slug;
    case "fr":
      return article.slug_fr || article.slug;
    case "de":
      return article.slug_de || article.slug;
    case "ru":
      return article.slug_ru || article.slug;
    case "zh":
      return article.slug_zh || article.slug;
    default:
      return article.slug;
  }
}