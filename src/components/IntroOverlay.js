import { useEffect, useState } from 'react';

const TOTAL_DURATION_MS = 3400;

function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="intro-overlay" aria-hidden="true">
      <div className="intro-boot">
        <p className="intro-line intro-line-1">&gt; BOOT_AGENDA v2.0</p>
        <p className="intro-line intro-line-2">&gt; CHARGEMENT MODULES...</p>
        <p className="intro-line intro-line-3">&gt; [&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;&#x2588;] 100%</p>
        <p className="intro-line intro-line-4">&gt; SYSTEME PRET<span className="intro-cursor">_</span></p>
      </div>
    </div>
  );
}

export default IntroOverlay;
