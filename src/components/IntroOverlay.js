import { useEffect, useState } from 'react';

const RAY_COUNT = 8;
const SUN_R = 9;
const CIRCUMFERENCE = 2 * Math.PI * SUN_R;
const TOTAL_DURATION_MS = 3100;

function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="intro-overlay">
      <svg className="intro-sun-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <g className="intro-sun-move">
          {Array.from({ length: RAY_COUNT }, (_, i) => {
            const angle = (i * (360 / RAY_COUNT) * Math.PI) / 180;
            const x1 = 50 + Math.cos(angle) * 11;
            const y1 = 58 + Math.sin(angle) * 11;
            const x2 = 50 + Math.cos(angle) * 16;
            const y2 = 58 + Math.sin(angle) * 16;
            return (
              <line
                key={i}
                className="intro-sun-ray"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={{ animationDelay: `${0.9 + i * 0.06}s` }}
              />
            );
          })}
          <circle
            className="intro-sun-circle"
            cx={50}
            cy={58}
            r={SUN_R}
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE }}
          />
        </g>
      </svg>
    </div>
  );
}

export default IntroOverlay;
