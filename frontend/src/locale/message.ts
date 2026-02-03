import en from './en.json';
import ka from './ka.json';
import '@formatjs/intl-numberformat/polyfill-force';
import '@formatjs/intl-numberformat/locale-data/ka';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-datetimeformat/polyfill-force';
import '@formatjs/intl-datetimeformat/locale-data/ka';
import '@formatjs/intl-datetimeformat/locale-data/en';
import {createIntl, createIntlCache} from 'react-intl';
import {locale} from 'primereact/api';

export const messages = {
  en: en,
  ka: ka,
};

export type ResourceId = keyof typeof ka;
export type Locale = 'en' | 'ka';

const cache = createIntlCache();

const LOCALE_STORAGE_KEY = 'locale';

const enIntl = createIntl(
  {
    locale: 'en',
    messages: messages['en'],
  },
  cache
);

const kaIntl = createIntl(
  {
    locale: 'ka',
    messages: messages['ka'],
  },
  cache
);

export function getCurrentLanguage(): Locale {
  return (localStorage.getItem(LOCALE_STORAGE_KEY) ?? 'ka') as Locale;
}

export function changeLanguage(newLocal: Locale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, newLocal);
  locale(newLocal);
}

export const translateWrapper = (id: string) => {
  return translate(id as ResourceId);
};

const translate = (id: ResourceId) => {
  switch (getCurrentLanguage()) {
    case 'en':
      return enIntl.formatMessage({id});
    case 'ka':
      return kaIntl.formatMessage({id});
  }
};

export default translate;
