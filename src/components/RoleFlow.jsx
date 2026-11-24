import { useId } from 'react';

const RING = 36; // the loop's radius, in its 100-unit drawing
const GAP = 30; // degrees left clear around each stage on the ring

const point = (deg) => [50 + RING * Math.cos((deg * Math.PI) / 180), 50 + RING * Math.sin((deg * Math.PI) / 180)];

// Stages that ran as a cycle, set around a ring with an arrow from each to the next. The first stage
// sits at the ring's left, beside the arrow coming in from the stage before.
function Loop({ stages }) {
  const marker = `role-flow-arrow-${useId().replace(/:/g, '')}`;
  const angles = stages.map((_, i) => 180 + (360 / stages.length) * i);

  return (
    <li className="role-flow-loop">
      <div className="role-flow-ring-box">
      {/* stretched to its box, so the stages (placed in % of the box) sit on the ring */}
      <svg className="role-flow-ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id={marker} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M1 1 9 5 1 9" />
          </marker>
        </defs>
        {angles.map((a, i) => {
          const [x1, y1] = point(a + GAP);
          const [x2, y2] = point(angles[(i + 1) % angles.length] + (i + 1 === angles.length ? 360 : 0) - GAP);
          return <path key={a} d={`M${x1} ${y1} A${RING} ${RING} 0 0 1 ${x2} ${y2}`} markerEnd={`url(#${marker})`} />;
        })}
      </svg>
      {stages.map((name, i) => {
        const [x, y] = point(angles[i]);
        return (
          <span key={name} className="role-flow-pill is-loop" style={{ left: `${x}%`, top: `${y}%` }}>
            {name}
          </span>
        );
      })}
      </div>
    </li>
  );
}

// A one-line diagram of how a project ran: the stages left to right, under a bracket naming who covered
// them. `flow` has `owner` (the bracket's label), `steps` and an optional `caption`. A step is a name;
// `{ loop: [a, b, …] }` for stages that ran as a cycle (drawn as a ring of arrows); or
// `{ name, ongoing: true }` for a stage that kept going (shown with a repeat mark).
export default function RoleFlow({ flow }) {
  return (
    <figure className="role-flow">
      <div className="role-flow-owner">
        <span className="role-flow-owner-label">{flow.owner}</span>
        <span className="role-flow-bracket" aria-hidden="true" />
      </div>
      <ol className="role-flow-steps">
        {flow.steps.map((step) => {
          if (step.loop) return <Loop key={step.loop.join()} stages={step.loop} />;
          const name = step.name ?? step;
          return (
            <li key={name}>
              <span className={`role-flow-pill ${step.ongoing ? 'is-ongoing' : ''}`}>
                {name}
                {step.ongoing && (
                  <svg className="role-flow-repeat" viewBox="0 0 24 24" width="14" height="14" aria-label="(ongoing)">
                    <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />
                  </svg>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      {flow.caption && <figcaption className="chat-caption">{flow.caption}</figcaption>}
    </figure>
  );
}
