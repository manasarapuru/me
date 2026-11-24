import GirlBust, { SKIN, TOP } from './GirlBust.jsx';

// The avatar at her laptop, typing: the guide's scene on the approach panel's last slide.
// Drawn in a 100x100 space; the hands type while an ancestor has `is-live`.

export default function CodingScene() {
  return (
    <svg className="coding-scene" viewBox="0 0 100 100" aria-hidden="true">
      {/* chair back, behind her */}
      <rect x="19" y="57" width="62" height="50" rx="12" fill="#c9a48f" stroke="#b48d78" strokeWidth="0.7" />

      <GirlBust />

      {/* arms reach behind the laptop; the hands peek over the lid as she types */}
      <g className="type-hand type-hand-l">
        <path d="M33.5 78 Q34 87 43 81.5" fill="none" stroke={TOP} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="43.5" cy="80" rx="3.6" ry="2.8" fill={SKIN} />
      </g>
      <g className="type-hand type-hand-r">
        <path d="M66.5 78 Q66 87 57 81.5" fill="none" stroke={TOP} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="56.5" cy="80" rx="3.6" ry="2.8" fill={SKIN} />
      </g>

      {/* laptop, seen from behind its lid */}
      <rect x="32" y="80" width="36" height="18" rx="2.2" fill="#aab4c0" />
      <rect x="33.2" y="81.2" width="33.6" height="15.6" rx="1.4" fill="#c3ccd6" />
      <circle className="laptop-mark" cx="50" cy="89" r="2.3" fill="#5fd3b8" />
    </svg>
  );
}
