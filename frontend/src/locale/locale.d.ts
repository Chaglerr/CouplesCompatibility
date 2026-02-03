import {messages} from './message.ts';

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof typeof messages.ka | keyof typeof messages.en;
    }

    interface IntlConfig {
      locale: 'en' | 'ka';
    }
  }
}
