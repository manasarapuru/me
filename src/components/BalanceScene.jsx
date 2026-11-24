import GirlBust, { SKIN, TOP } from './GirlBust.jsx';

// The hero's disk (and the flipped side of the intro disk): the avatar holding up a balance scale in
// one raised hand, beside her head. Code sits on one pan (technical depth) and a person on the other
// (users' mental models). While live, the beam tips one way, then the other, and settles level; the
// pans counter-turn so they keep hanging straight down. Drawn in the disk's 100x100 space.

const PIVOT = { x: 81, y: 33 };
const ARM = 10; // from the pivot to each end of the beam
const HAND = { x: 81, y: 58 }; // where her hand closes round the post

// A pan hanging from the beam at `x`: two strings down to a shallow dish, holding `children`.
function Pan({ x, children }) {
  const y = PIVOT.y;
  return (
    <g className="balance-pan" style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M${x} ${y} L${x - 4.5} ${y + 8} M${x} ${y} L${x + 4.5} ${y + 8}`} stroke="#94a3b8" strokeWidth="0.4" />
      <g transform={`translate(${x} ${y + 5.4}) scale(0.72)`}>{children}</g>
      <path d={`M${x - 5} ${y + 8} Q${x} ${y + 11.5} ${x + 5} ${y + 8} Z`} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.45" />
    </g>
  );
}

export default function BalanceScene() {
  return (
    <svg className="balance-scene" viewBox="0 0 100 100" aria-hidden="true">
      <GirlBust />

      {/* raised arm, up to the hand round the foot of the post */}
      <path d="M67.5 85 L78.5 80" stroke={TOP} strokeWidth="7.5" strokeLinecap="round" />
      <path d={`M78.5 80 L${HAND.x} ${HAND.y + 4}`} stroke={TOP} strokeWidth="7" strokeLinecap="round" />

      {/* the post, from her hand up to the pivot */}
      <rect x={PIVOT.x - 0.6} y={PIVOT.y} width="1.2" height={HAND.y - PIVOT.y} rx="0.5" fill="#64748b" />

      {/* the beam and its pans, tipping together around the pivot */}
      <g className="balance-beam" style={{ transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}>
        <path d={`M${PIVOT.x - ARM} ${PIVOT.y} H${PIVOT.x + ARM}`} stroke="#475569" strokeWidth="1.1" strokeLinecap="round" />
        <Pan x={PIVOT.x - ARM}>
          {/* technical depth: code brackets */}
          <path
            d="M-2.6 -2.4 L-4.6 0 L-2.6 2.4 M2.6 -2.4 L4.6 0 L2.6 2.4 M0.9 -3 L-0.9 3"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Pan>
        <Pan x={PIVOT.x + ARM}>
          {/* users' mental models: a person */}
          <circle cy="-1.6" r="1.7" fill="#BE185D" />
          <path d="M-3.2 3.3 Q-3.2 0.6 0 0.6 Q3.2 0.6 3.2 3.3 Z" fill="#BE185D" />
        </Pan>
      </g>
      <circle cx={PIVOT.x} cy={PIVOT.y} r="1.2" fill="#475569" />

      {/* the hand, closed round the post */}
      <circle cx={HAND.x} cy={HAND.y} r="4.6" fill={SKIN} />
      <ellipse cx={HAND.x - 4.4} cy={HAND.y + 1.6} rx="1.6" ry="2.5" fill={SKIN} transform={`rotate(-35 ${HAND.x - 4.4} ${HAND.y + 1.6})`} />
    </svg>
  );
}
