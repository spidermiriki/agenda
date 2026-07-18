const PETAL_ANGLES = [0, 72, 144, 216, 288];
const GROUND_Y = 182;
const BLADE_COUNT = 100;

const blades = Array.from({ length: BLADE_COUNT }, (_, i) => ({
  x: (i / (BLADE_COUNT - 1)) * 400,
  height: 22 + ((i * 53) % 42),
  lean: ((i * 29) % 19) - 9,
  delay: (i % 12) * 0.12,
}));

function bladePath(height) {
  return `M-1.6,0 C-2,${-height * 0.55} -1,${-height * 0.85} 0,${-height} C1,${-height * 0.85} 2,${-height * 0.55} 1.6,0 Z`;
}

function GrassBlade({ x, height, lean, delay }) {
  return (
    <g transform={`translate(${x}, ${GROUND_Y})`}>
      <path
        className="grass-blade sway"
        d={bladePath(height)}
        style={{ '--lean': `${lean}deg`, animationDelay: `${delay}s` }}
      />
    </g>
  );
}

function Flower({ x, color, rotate = 0, delay = 0 }) {
  return (
    <g transform={`translate(${x},${GROUND_Y})`}>
      <g className="flower-sway" style={{ '--lean': `${rotate}deg`, animationDelay: `${delay}s` }}>
        <path className="flower-stem" d="M0,0 C-3,-11 3,-19 0,-30" />
        {PETAL_ANGLES.map((angle) => (
          <ellipse
            key={angle}
            className="flower-petal"
            cx={0}
            cy={-39}
            rx={4.4}
            ry={9}
            fill={color}
            transform={`rotate(${angle} 0 -30)`}
          />
        ))}
        <circle className="flower-center" cx={0} cy={-30} r={4} />
      </g>
    </g>
  );
}

function Cloud({ animClass, cx, cy, scale = 1, duration, delay = 0 }) {
  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`}>
      <g
        className={`cloud-drift ${animClass}`}
        style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
      >
        <ellipse className="cloud-puff" cx="-18" cy="4" rx="16" ry="11" />
        <ellipse className="cloud-puff" cx="0" cy="-4" rx="20" ry="15" />
        <ellipse className="cloud-puff" cx="20" cy="4" rx="15" ry="10" />
        <ellipse className="cloud-puff" cx="2" cy="10" rx="26" ry="9" />
      </g>
    </g>
  );
}

function Sun() {
  return (
    <g transform="translate(348,36)">
      <g className="sun-rays">
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = Math.cos(angle) * 21;
          const y1 = Math.sin(angle) * 21;
          const x2 = Math.cos(angle) * 30;
          const y2 = Math.sin(angle) * 30;
          return <line key={i} className="sun-ray" x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle className="sun-body" r="17" />
    </g>
  );
}

function GardenBackground() {
  return (
    <svg className="garden-bg" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe3f7" />
          <stop offset="100%" stopColor="#eaf6fb" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="400" height="200" fill="url(#skyGradient)" />

      <Sun />
      <Cloud animClass="cloud-1" cx={65} cy={40} scale={1} duration={50} delay={0} />
      <Cloud animClass="cloud-2" cx={230} cy={60} scale={0.7} duration={65} delay={-25} />

      <rect className="grass-ground" x="0" y={GROUND_Y - 4} width="400" height={200 - (GROUND_Y - 4)} />

      {blades.map((b, i) => (
        <GrassBlade key={i} {...b} />
      ))}

      <Flower x={22} color="var(--purple)" rotate={-4} delay={0.1} />
      <Flower x={78} color="var(--flower-yellow)" rotate={5} delay={0.6} />
      <Flower x={138} color="var(--flower-pink)" rotate={-3} delay={0.3} />
      <Flower x={198} color="var(--purple)" rotate={4} delay={0.9} />
      <Flower x={258} color="var(--flower-yellow)" rotate={-5} delay={0.2} />
      <Flower x={318} color="var(--flower-pink)" rotate={3} delay={0.7} />
      <Flower x={376} color="var(--purple)" rotate={-3} delay={0.4} />
    </svg>
  );
}

export default GardenBackground;
