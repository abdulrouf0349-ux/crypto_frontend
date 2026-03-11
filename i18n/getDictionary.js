import en from "./en.json";
import ur from "./ur.json";
import ru from "./ru.json";
import es from "./es.json";
import fr from "./fr.json";
import ar from "./ar.json"
import de from "./de.json";
import zhcn from "./zh-cn.json"; // renamed variable for clarity

// map locales to dictionaries
const dictionaries = {
  en,
  ur,
  ar,
  ru,
  es,
  fr,
  de,
  "zh-cn": zhcn, // send zh-cn when locale is zh-cn
};

export async function getDictionary(locale) {
  return dictionaries[locale] || dictionaries["en"];
}
