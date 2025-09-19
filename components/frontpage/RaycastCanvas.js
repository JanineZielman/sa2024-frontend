import { useEffect, useRef } from 'react';
import { initRaycast } from '../../lib/frontpage/raycast';

const RaycastCanvas = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const cleanup = initRaycast(containerRef.current);
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  return (
    <div
      id="frontpage-app"
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}
    />
  );
};

export default RaycastCanvas;
