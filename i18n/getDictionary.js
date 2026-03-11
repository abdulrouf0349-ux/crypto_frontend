import en from "./en.json";
import ur from "./ur.json";
import ru from "./ru.json";
import es from "./es.json";
import fr from "./fr.json";
import ar from "./ar.json"
import de from "./de.json";
import zhCN from './zh-CN.json'

// map locales to dictionaries
const dictionaries = {
  en,
  ur,
  ar,
  ru,
  es,
  fr,
  de,
  "zh-CN": zhCN, // send zh-CN when locale is zh-CN
};

export async function getDictionary(locale) {
  return dictionaries[locale] || dictionaries["en"];
}
