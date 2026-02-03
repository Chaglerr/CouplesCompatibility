import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {useContext, useEffect} from 'react';
import {useWashState} from '../wash-in-progress/UseWashState.tsx';
import {observer} from 'mobx-react-lite';

export interface LandingPageProps {
  backgroundColor?: string;
  logoSrc?: string;
  azryLogoSrc?: string;
}

export const LandingPage = observer(
  ({backgroundColor, logoSrc, azryLogoSrc}: LandingPageProps) => {
    const rootUiStore = useContext(RootUiStoreContext);

    useEffect(() => {
      rootUiStore.setIsCancelled(false);
    }, [rootUiStore]);

    useWashState();

    const bgColor = backgroundColor || 'var(--splash-bg)';
    const logo = logoSrc || './resources/driwo_light.svg';
    const azryLogo = azryLogoSrc || './resources/azry_light.svg';
    return (
      <div
        className="w-full h-full flex flex-column align-items-center justify-content-between"
        style={{backgroundColor: bgColor}}
      >
        <div />
        <img src={logo} alt="driwo-logo" />
        <img
          src={azryLogo}
          alt="azry-logo"
          style={{width: '200px', height: '200px', marginBottom: '30px'}}
        />
      </div>
    );
  }
);
