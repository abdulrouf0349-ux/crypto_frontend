// // app/sitemap.js

// import { fetchCoins } from '../../apis/cryptowhales';
// import { fetchWhaleAlerts } from '../../apis/cryptowhales';
// import { fetchAllArticles } from '../../apis/page_news/events'; 
// import { fetchAllIcoProjects } from '../../apis/page_news/events';
// import { fetchAllEvents } from '../../apis/page_news/events';
// const SITE_URL = 'https://cryptonewstrend.com';
// const BASE_API = process.env.NEXT_PUBLIC_API_BASE || 'https://crytponews.fun';
// const LOCALES  = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];

// const NEWS_CATEGORIES = [
//   'bitcoin','ethereum','blockchain','defi',
//   'nfts','cryptocurrency','altcoin','staking','dao','mining'
// ];

// // ─────────────────────────────────────────────
// // STATIC PAGES
// // ─────────────────────────────────────────────
// function getStaticUrls() {
//   const staticPaths = [
//     { path: '',              priority: 1.0,  changeFrequency: 'daily'  },
//     { path: '/news',         priority: 0.9,  changeFrequency: 'hourly' },
//     { path: '/events',       priority: 0.8,  changeFrequency: 'daily'  },
//     { path: '/ico',          priority: 0.8,  changeFrequency: 'daily'  },
//     { path: '/crypto-whales',priority: 0.7,  changeFrequency: 'hourly' },
//     { path: '/glossary',     priority: 0.8,  changeFrequency: 'daily'  },
//     { path: '/articles',     priority: 0.8,  changeFrequency: 'daily'  },
//     { path: '/about-us',     priority: 0.5,  changeFrequency: 'monthly'},
//     { path: '/contact-us',   priority: 0.5,  changeFrequency: 'monthly'},
//     { path: '/privacy-policy',priority: 0.4, changeFrequency: 'monthly'},
//     { path: '/coin-analysis',priority: 0.4, changeFrequency: 'monthly'},
//   ];

//   return LOCALES.flatMap(locale =>
//     staticPaths.map(({ path, priority, changeFrequency }) => ({
//       url:             `${SITE_URL}/${locale}${path}`,
//       lastModified:    new Date(),
//       changeFrequency,
//       priority,
//     }))
//   );
// }

// // ─────────────────────────────────────────────
// // NEWS CATEGORY PAGES
// // ─────────────────────────────────────────────
// function getNewsCategoryUrls() {
//   return LOCALES.flatMap(locale =>
//     NEWS_CATEGORIES.map(cat => ({
//       url:             `${SITE_URL}/${locale}/news/${cat}`,
//       lastModified:    new Date(),
//       changeFrequency: 'hourly',
//       priority:        0.8,
//     }))
//   );
// }

// // ─────────────────────────────────────────────
// // NEWS SLUG PAGES
// // ─────────────────────────────────────────────
// async function getNewsSlugs() {
//   const urls = [];

//   for (const locale of LOCALES) {
//     let page = 1, hasNext = true;

//     while (hasNext) {
//       try {
//         const res = await fetch(
//           `${BASE_API}/api/getdata${locale === 'en' ? '' : '/' + locale}/?page=${page}`,
//           {
//             method:  'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body:    JSON.stringify({ news: 'all' }),
//             next:    { revalidate: 3600 },
//           }
//         );
//         const data = await res.json();

//         (data?.data || []).forEach(item => {
//           if (item.slug) {
//             urls.push({
//               url:             `${SITE_URL}/${locale}/${item.slug}`,
//               lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
//               changeFrequency: 'never',
//               priority:        0.8,
//             });
//           }
//         });

//         hasNext = data?.metadata?.has_next || false;
//         page++;
//         if (page > 50) break;
//       } catch { break; }
//     }
//   }

//   return urls;
// }

// // ─────────────────────────────────────────────
// // EVENTS SLUG PAGES
// // ─────────────────────────────────────────────
// async function getEventSlugs() {
//   const urls = [];

//   for (const locale of LOCALES) {
//     let page = 1, hasNext = true;

//     while (hasNext) {
//       try {
//         const result = await fetchAllEvents(page, locale);

//         (result?.data || []).forEach(item => {
//           if (item.slug) {
//             urls.push({
//               url:             `${SITE_URL}/${locale}/events/${item.slug}`,
//               lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
//               changeFrequency: 'never',
//               priority:        0.7,
//             });
//           }
//         });

//         hasNext = result?.metadata?.has_next || result?.has_next || false;
//         page++;
//         if (page > 30) break;
//       } catch { break; }
//     }
//   }

//   return urls;
// }

// // ─────────────────────────────────────────────
// // ARTICLES SLUG PAGES
// // ─────────────────────────────────────────────
// async function getArticleSlugs() {
//   const urls = [];

//   for (const locale of LOCALES) {
//     let page = 1, hasNext = true;

//     while (hasNext) {
//       try {
//         const result = await fetchAllArticles(locale, page);

//         (result?.data || []).forEach(item => {
//           if (item.slug) {
//             urls.push({
//               url:             `${SITE_URL}/${locale}/article/${item.slug}`,
//               lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
//               changeFrequency: 'never',
//               priority:        0.8,
//             });
//           }
//         });

//         hasNext = result?.has_next || false;
//         page++;
//         if (page > 30) break;
//       } catch { break; }
//     }
//   }

//   return urls;
// }

// // ─────────────────────────────────────────────
// // ICO SLUG PAGES
// // ─────────────────────────────────────────────
// async function getIcoSlugs() {
//   const urls     = [];
//   const STATUSES = ['Active', 'Upcoming', 'Ended'];

//   for (const locale of LOCALES) {
//     for (const status of STATUSES) {
//       let page = 1, hasNext = true;

//       while (hasNext) {
//         try {
//           const result = await fetchAllIcoProjects(locale, status, page);

//           (result?.data || []).forEach(item => {
//             if (item.slug) {
//               urls.push({
//                 url:             `${SITE_URL}/${locale}/ico/${item.slug}`,
//                 lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
//                 changeFrequency: 'never',
//                 priority:        0.7,
//               });
//             }
//           });

//           hasNext = result?.has_next || false;
//           page++;
//           if (page > 20) break;
//         } catch { break; }
//       }
//     }
//   }

//   return urls;
// }

// // ─────────────────────────────────────────────
// // WHALES HASH PAGES
// // ─────────────────────────────────────────────
// async function getWhaleSlugs() {
//   const urls = [];

//   for (const locale of LOCALES) {
//     let page = 1, hasNext = true;

//     while (hasNext) {
//       try {
//         const result = await fetchWhaleAlerts(page, locale);

//         (result?.data || []).forEach(item => {
//           if (item.hash) {
//             urls.push({
//               url:             `${SITE_URL}/${locale}/crypto-whales/${item.hash}`,
//               lastModified:    item.created_at ? new Date(item.created_at) : new Date(),
//               changeFrequency: 'never',
//               priority:        0.6,
//             });
//           }
//         });

//         hasNext = result?.metadata?.has_next || false;
//         page++;
//         if (page > 20) break;
//       } catch { break; }
//     }
//   }

//   return urls;
// }

// // ─────────────────────────────────────────────
// // GLOSSARY (COINS) SLUG PAGES
// // ─────────────────────────────────────────────
// async function getCoinSlugs() {
//   const urls = [];

//   for (const locale of LOCALES) {
//     let page = 1, hasNext = true;

//     while (hasNext) {
//       try {
//         const result = await fetchCoins(page, '', 'all', locale);

//         (result?.data || []).forEach(item => {
//           if (item.slug) {
//             urls.push({
//               url:             `${SITE_URL}/${locale}/glossary/${item.slug}`,
//               lastModified:    new Date(),
//               changeFrequency: 'monthly',
//               priority:        0.7,
//             });
//           }
//         });

//         hasNext = result?.metadata?.has_next || false;
//         page++;
//         if (page > 50) break;
//       } catch { break; }
//     }
//   }

//   return urls;
// }

// // ─────────────────────────────────────────────
// // MAIN SITEMAP EXPORT
// // ─────────────────────────────────────────────
// export default async function sitemap() {
//   const [
//     newsUrls,
//     eventUrls,
//     articleUrls,
//     icoUrls,
//     whaleUrls,
//     coinUrls,
//   ] = await Promise.all([
//     getNewsSlugs(),
//     getEventSlugs(),
//     getArticleSlugs(),
//     getIcoSlugs(),
//     getWhaleSlugs(),
//     getCoinSlugs(),
//   ]);

//   return [
//     ...getStaticUrls(),        // about-us, contact-us, privacy-policy etc
//     ...getNewsCategoryUrls(),  // bitcoin, ethereum, defi...
//     ...newsUrls,               // /en/some-news-slug
//     ...eventUrls,              // /en/events/slug
//     ...articleUrls,            // /en/article/slug
//     ...icoUrls,                // /en/ico/slug
//     ...whaleUrls,              // /en/crypto-whales/hash
//     ...coinUrls,               // /en/glossary/bitcoin
//   ];
// }

// // ✅ Sitemap 1 hour mein refresh hogi
// export const revalidate = 3600;


// app/sitemap.js
import { fetchCoins } from '../../apis/cryptowhales';
import { fetchWhaleAlerts } from '../../apis/cryptowhales';
import { fetchAllArticles } from '../../apis/page_news/events'; 
import { fetchAllIcoProjects } from '../../apis/page_news/events';
import { fetchAllEvents } from '../../apis/page_news/events';

const SITE_URL = 'https://cryptonewstrend.com';
const BASE_API = process.env.NEXT_PUBLIC_API_BASE || 'https://crytponews.fun';

// ✅ Sab 8 languages
const LOCALES = ['en', 'ur', 'ar', 'de', 'fr', 'ru', 'zh-CN', 'es'];

const NEWS_CATEGORIES = [
  'bitcoin','ethereum','blockchain','defi',
  'nfts','cryptocurrency','altcoin','staking','dao','mining'
];

// ─────────────────────────────────────────────
// STATIC PAGES
// ─────────────────────────────────────────────
function getStaticUrls() {
  const staticPaths = [
    { path: '',                  priority: 1.0,  changeFrequency: 'hourly'  },
    { path: '/news',             priority: 0.9,  changeFrequency: 'hourly'  },
    { path: '/events',           priority: 0.8,  changeFrequency: 'daily'   },
    { path: '/ico',              priority: 0.8,  changeFrequency: 'daily'   },
    { path: '/crypto-whales',    priority: 0.7,  changeFrequency: 'hourly'  },
    { path: '/glossary',         priority: 0.8,  changeFrequency: 'daily'   },
    { path: '/articles',         priority: 0.8,  changeFrequency: 'daily'   },
    { path: '/about-us',         priority: 0.5,  changeFrequency: 'monthly' },
    { path: '/contact-us',       priority: 0.5,  changeFrequency: 'monthly' },
    { path: '/privacy-policy',   priority: 0.4,  changeFrequency: 'monthly' },
    { path: '/coin-analysis',    priority: 0.6,  changeFrequency: 'daily'   },
  ];

  // ✅ Sab locales ke liye URLs banao — /en/en bug fix
  return LOCALES.flatMap(locale =>
    staticPaths.map(({ path, priority, changeFrequency }) => ({
      url:             `${SITE_URL}/${locale}${path}`,
      lastModified:    new Date(),
      changeFrequency,
      priority,
    }))
  );
}

// ─────────────────────────────────────────────
// NEWS CATEGORY PAGES
// ─────────────────────────────────────────────
function getNewsCategoryUrls() {
  // ✅ Sab locales ke liye category URLs
  return LOCALES.flatMap(locale =>
    NEWS_CATEGORIES.map(cat => ({
      url:             `${SITE_URL}/${locale}/news/${cat}`,
      lastModified:    new Date(),
      changeFrequency: 'hourly',
      priority:        0.8,
    }))
  );
}

// ─────────────────────────────────────────────
// NEWS SLUG PAGES
// ─────────────────────────────────────────────
async function getNewsSlugs() {
  const urls = [];

  for (const locale of LOCALES) {
    let page = 1, hasNext = true;

    while (hasNext) {
      try {
        const res = await fetch(
          `${BASE_API}/api/getdata${locale === 'en' ? '' : '/' + locale}/?page=${page}`,
          {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ news: 'all' }),
            next:    { revalidate: 3600 },
          }
        );
        const data = await res.json();

        (data?.data || []).forEach(item => {
          if (item.slug) {
            urls.push({
              url:             `${SITE_URL}/${locale}/${item.slug}`,
              lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority:        0.8,
            });
          }
        });

        hasNext = data?.metadata?.has_next || false;
        page++;
        if (page > 50) break;
      } catch { break; }
    }
  }

  return urls;
}

// ─────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────
async function getEventSlugs() {
  const urls = [];

  for (const locale of LOCALES) {
    let page = 1, hasNext = true;

    while (hasNext) {
      try {
        const result = await fetchAllEvents(page, locale);

        (result?.data || []).forEach(item => {
          if (item.slug) {
            urls.push({
              url:             `${SITE_URL}/${locale}/events/${item.slug}`,
              lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority:        0.7,
            });
          }
        });

        hasNext = result?.metadata?.has_next || result?.has_next || false;
        page++;
        if (page > 30) break;
      } catch { break; }
    }
  }

  return urls;
}

// ─────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────
async function getArticleSlugs() {
  const urls = [];

  for (const locale of LOCALES) {
    let page = 1, hasNext = true;

    while (hasNext) {
      try {
        const result = await fetchAllArticles(locale, page);

        (result?.data || []).forEach(item => {
          if (item.slug) {
            urls.push({
              url:             `${SITE_URL}/${locale}/article/${item.slug}`,
              lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
              changeFrequency: 'weekly',
              priority:        0.8,
            });
          }
        });

        hasNext = result?.has_next || false;
        page++;
        if (page > 30) break;
      } catch { break; }
    }
  }

  return urls;
}

// ─────────────────────────────────────────────
// ICO
// ─────────────────────────────────────────────
async function getIcoSlugs() {
  const urls = [];
  const STATUSES = ['Active', 'Upcoming', 'Ended'];

  for (const locale of LOCALES) {
    for (const status of STATUSES) {
      let page = 1, hasNext = true;

      while (hasNext) {
        try {
          const result = await fetchAllIcoProjects(locale, status, page);

          (result?.data || []).forEach(item => {
            if (item.slug) {
              urls.push({
                url:             `${SITE_URL}/${locale}/ico/${item.slug}`,
                lastModified:    item.updated_at ? new Date(item.updated_at) : new Date(),
                changeFrequency: 'weekly',
                priority:        0.7,
              });
            }
          });

          hasNext = result?.has_next || false;
          page++;
          if (page > 20) break;
        } catch { break; }
      }
    }
  }

  return urls;
}

// ─────────────────────────────────────────────
// WHALES
// ─────────────────────────────────────────────
async function getWhaleSlugs() {
  const urls = [];

  for (const locale of LOCALES) {
    let page = 1, hasNext = true;

    while (hasNext) {
      try {
        const result = await fetchWhaleAlerts(page, locale);

        (result?.data || []).forEach(item => {
          if (item.hash) {
            urls.push({
              url:             `${SITE_URL}/${locale}/crypto-whales/${item.hash}`,
              lastModified:    item.created_at ? new Date(item.created_at) : new Date(),
              changeFrequency: 'never',
              priority:        0.6,
            });
          }
        });

        hasNext = result?.metadata?.has_next || false;
        page++;
        if (page > 20) break;
      } catch { break; }
    }
  }

  return urls;
}

// ─────────────────────────────────────────────
// GLOSSARY
// ─────────────────────────────────────────────
async function getCoinSlugs() {
  const urls = [];

  for (const locale of LOCALES) {
    let page = 1, hasNext = true;

    while (hasNext) {
      try {
        const result = await fetchCoins(page, '', 'all', locale);

        (result?.data || []).forEach(item => {
          if (item.slug) {
            urls.push({
              url:             `${SITE_URL}/${locale}/glossary/${item.slug}`,
              lastModified:    new Date(),
              changeFrequency: 'monthly',
              priority:        0.7,
            });
          }
        });

        hasNext = result?.metadata?.has_next || false;
        page++;
        if (page > 50) break;
      } catch { break; }
    }
  }

  return urls;
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default async function sitemap() {
  const [
    newsUrls,
    eventUrls,
    articleUrls,
    icoUrls,
    whaleUrls,
    coinUrls,
  ] = await Promise.all([
    getNewsSlugs(),
    getEventSlugs(),
    getArticleSlugs(),
    getIcoSlugs(),
    getWhaleSlugs(),
    getCoinSlugs(),
  ]);

  return [
    ...getStaticUrls(),
    ...getNewsCategoryUrls(),
    ...newsUrls,
    ...eventUrls,
    ...articleUrls,
    ...icoUrls,
    ...whaleUrls,
    ...coinUrls,
  ];
}

export const revalidate = 3600;