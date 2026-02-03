import {useContext, useRef} from 'react';
import {RootUiStoreContext} from '../../store/RootUiStore';
import {changeLanguage, getCurrentLanguage} from '../../locale/message';
import './washselection.css';
import {debounce} from 'lodash';

export const ChangeLanguageButton = () => {
  const rootUiStore = useContext(RootUiStoreContext);
  const langRef = useRef(rootUiStore.locale);

  langRef.current = rootUiStore.locale;

  const debouncedToggle = useRef(
    debounce(() => {
      const currentLang = langRef.current;
      const newLang = currentLang === 'en' ? 'ka' : 'en';
      changeLanguage(newLang);
      rootUiStore.setLocale(getCurrentLanguage());
    }, 300)
  ).current;

  return (
    <div className="language-toggle-container" onClick={debouncedToggle}>
      <div className={`toggle-option ${rootUiStore.locale === 'ka' ? 'active' : ''}`}>
        GEO
      </div>
      <div className={`toggle-option ${rootUiStore.locale === 'en' ? 'active' : ''}`}>
        EN
      </div>
    </div>
  );
};
