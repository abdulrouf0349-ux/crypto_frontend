export const getPathDetails = (pathname) => {
    if (!pathname) return { locale: 'en', page: 'home' };

    const segments = pathname.split('/').filter(Boolean);
    
    // ZAROORI: 'en' ko yahan add karein
    const supportedLangs = ['en', 'ur', 'de', 'ru', 'es', 'fr', 'zh-CN'];

    let locale = 'en';
    let remainingSegments = segments;

    // Case-insensitive check
    if (segments[0] && supportedLangs.includes(segments[0].toLowerCase())) {
        locale = segments[0].toLowerCase();
        remainingSegments = segments.slice(1);
    }

    const page = remainingSegments[0] || 'home';
    const id = remainingSegments[1] || null;

    return {
        locale,
        page,
        id,
        isDashboard: page === 'dashboard',
        isSetting: page === 'setting'
    };
};