import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import type { AvailableLanguages } from '@-types/bo-module-aggregator';
import { getLocalStorageValue } from '@-bo/utils';

import translationFr from '../locale/fr.json';
import translationEn from '../locale/en.json';

const DEFAULT_LANGUAGE = 'fr';

const instance = i18n.createInstance();

instance
    .use(initReactI18next)
    .use(LanguageDetector)
    .init(
        {
            defaultNS: 'common',
            resources: {
                en: { common: translationEn },
                fr: { common: translationFr },
            },
            cleanCode: true,
            load: 'languageOnly',
            fallbackLng: DEFAULT_LANGUAGE,
            lng: getLocalStorageValue('language'),
            supportedLngs: ['fr', 'en'] as Array<AvailableLanguages>,
            interpolation: { escapeValue: false },
            detection: {
                order: ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
                caches: ['localStorage'],
            },
        },
        () => {
            dayjs.locale(instance.language);
        },
    );

export const handleLanguageChange = (language: string) => {
    instance.changeLanguage(language);
    dayjs.locale(language);
};

window.addEventListener('languageChangeCustom', ((event: CustomEvent<AvailableLanguages>) => {
    handleLanguageChange(event.detail);
}) as EventListener);

export default instance;
