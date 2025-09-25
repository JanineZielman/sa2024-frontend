import ActsSvg from './ActsSvg';
import SonicSvg from './SonicSvg';
import DateSvg from './DateSvg';

const IMAGE_BASE_PATH = '/assets/frontpage';

const FrontpageVisuals = () => (
  <>
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

    <div className="frontpage-visuals-svg">
      <img
        src={`${IMAGE_BASE_PATH}/250904-SonicActs-2026-WebSketch3.svg`}
        alt="Decorative visuals"
      />
    </div>
  </>
);

export default FrontpageVisuals;
