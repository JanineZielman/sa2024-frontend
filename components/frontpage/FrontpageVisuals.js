import ActsSvg from './ActsSvg';
import SonicSvg from './SonicSvg';
import DateSvg from './DateSvg';

const IMAGE_BASE_PATH = '/assets/frontpage';

const FrontpageVisuals = () => (
  <>
    <img
      id="frontpage-background-overlay"
      src={`${IMAGE_BASE_PATH}/250904-SonicActs-2026-WebSketch5_pink_ff87ff.png`}
      alt="Sonic Acts overlay"
      style={{
        position: 'fixed',
        left: '50vw',
        top: 0,
        width: '100vw',
        height: 'auto',
        objectFit: 'cover',
        zIndex: 100,
        pointerEvents: 'none',
        transformOrigin: 'top center',
        transform: 'translateX(-50%)',
      }}
    />

    <div id="frontpage-sonic-acts">
      <div id="frontpage-sonic">
        <SonicSvg aria-hidden="true" />
      </div>
      <div id="frontpage-acts">
        <ActsSvg aria-hidden="true" />
      </div>
    </div>

    <div id="frontpage-date">
      <DateSvg aria-hidden="true" />
    </div>

    <div id="frontpage-locations">
      <img
        src={`${IMAGE_BASE_PATH}/250904-SonicActs-2026-WebSketch4.svg`}
        alt="Festival locations"
      />
    </div>

    <div className="frontpage-visuals-svg">
      <img
        src={`${IMAGE_BASE_PATH}/250904-SonicActs-2026-WebSketch3.svg`}
        alt="Decorative visuals"
      />
    </div>
  </>
);

export default FrontpageVisuals;
