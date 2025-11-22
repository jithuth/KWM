import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ml';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
    en: {
        'nav.home': 'Home',
        'nav.news': 'News',
        'nav.directory': 'Directory',
        'nav.associations': 'Associations',
        'nav.obituary': 'Obituary',
        'nav.tools': 'Tools',
        'nav.admin': 'Admin',
        'hero.readMore': 'Read Full Story',
        'stats.exchange': 'Exchange Rate',
        'stats.events': 'Events',
        'stats.embassy': 'Embassy',
        'stats.prayer': 'Prayer',
        'section.latest': 'Latest Updates',
        'section.viewAll': 'View All',
        'promo.title': 'Promote Your Business',
        'promo.subtitle': 'Reach thousands of Malayalis in Kuwait. Join our business directory today!',
        'promo.btn': 'List Your Business',
        'footer.desc': 'Connecting the Malayali community in Kuwait since 2023. Your one-stop destination for news, directory, and events.',
        'footer.links': 'Quick Links',
        'footer.contact': 'Contact Us',
    },
    ml: {
        'nav.home': 'ഹോം',
        'nav.news': 'വാർത്തകൾ',
        'nav.directory': 'ഡയറക്ടറി',
        'nav.associations': 'സംഘടനകൾ',
        'nav.obituary': 'ചരമം',
        'nav.tools': 'സേവനങ്ങൾ',
        'nav.admin': 'അഡ്മിൻ',
        'hero.readMore': 'കൂടുതൽ വായിക്കുക',
        'stats.exchange': 'വിനിമയ നിരക്ക്',
        'stats.events': 'പരിപാടികൾ',
        'stats.embassy': 'എംബസി',
        'stats.prayer': 'പ്രാർത്ഥന സമയം',
        'section.latest': 'ഏറ്റവും പുതിയ വാർത്തകൾ',
        'section.viewAll': 'എല്ലാം കാണുക',
        'promo.title': 'നിങ്ങളുടെ ബിസിനസ്സ് വളർത്തൂ',
        'promo.subtitle': 'കുവൈറ്റിലെ ആയിരക്കണക്കിന് മലയാളികളിലേക്ക് എത്തിച്ചേരൂ.',
        'promo.btn': 'ബിസിനസ്സ് ചേർക്കൂ',
        'footer.desc': 'കുവൈറ്റിലെ മലയാളി സമൂഹത്തെ കോർത്തിണക്കുന്നു.',
        'footer.links': 'ലിങ്കുകൾ',
        'footer.contact': 'ബന്ധപ്പെടുക',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};