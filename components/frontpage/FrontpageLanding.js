import { useEffect, useState } from 'react';

import FrontpageVisuals from './FrontpageVisuals';
import CuratorialSection from './CuratorialSection';
import RaycastCanvas from './RaycastCanvas';

const IMAGE_BASE_PATH = '/assets/frontpage';

const FrontpageLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`frontpage-landing${isScrolled ? ' frontpage-landing--hidden' : ''}`}>
      <FrontpageVisuals />

      <div id="frontpage-main">
        <CuratorialSection />

        <div
          id="frontpage-aqua-01"
          data-tilt
          data-tilt-full-page-listening=""
          data-tilt-max="4"
          data-tilt-speed="50"
          data-tilt-perspective="500"
        >
          <img
            src={`${IMAGE_BASE_PATH}/aquarell-10-2-10.png`}
            loading="lazy"
            alt="Watercolour overlay"
          />
        </div>

        <div
          id="frontpage-aqua-02"
          data-tilt
          data-tilt-full-page-listening=""
          data-tilt-max="4"
          data-tilt-speed="50"
          data-tilt-perspective="500"
        >
          <img
            src={`${IMAGE_BASE_PATH}/aquarell-10-2-6.png`}
            loading="lazy"
            alt="Watercolour overlay"
          />
        </div>

        <div
          id="frontpage-aqua-03"
          data-tilt
          data-tilt-full-page-listening=""
          data-tilt-max="4"
          data-tilt-speed="50"
          data-tilt-perspective="500"
        >
          <img
            src={`${IMAGE_BASE_PATH}/aquarell-10-2-1.png`}
            loading="lazy"
            alt="Watercolour overlay"
          />
        </div>
      </div>

      <RaycastCanvas />
    </div>
  );
};

export default FrontpageLanding;
