import { useState } from 'react';
import { skillSteps } from '../data.js';
import Avatar from './Avatar.jsx';

// What the avatar holds up for each step, drawn in her 120x120 space just above the raised hand (≈105, 66).
// The whole guide is mirrored in this section (see .skills-guide), so the code card's slash is drawn reversed.
function SkillProps({ pose }) {
  const on = (name) => `guide-prop ${pose === name ? 'is-on' : ''}`;
  return (
    <svg className="guide-props" viewBox="0 0 120 120" aria-hidden="true">
      {/* understand: a magnifying glass */}
      <g className={on('magnifier')}>
        <path d="M110 52 L117 60" stroke="#475569" strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="103" cy="45" r="9.5" fill="#e0f2fe" stroke="#0a1628" strokeWidth="2.4" />
        <path d="M98 42 a6 6 0 0 1 5 -4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* connect: two linked rings */}
      <g className={on('links')} fill="none" strokeWidth="2.8">
        <circle cx="98" cy="46" r="7.5" stroke="#0e7490" />
        <circle cx="110" cy="46" r="7.5" stroke="#be185d" />
      </g>

      {/* build: a code card */}
      <g className={on('code')}>
        <rect x="92" y="34" width="26" height="22" rx="4" fill="#0a1628" />
        <path d="M100 41 l-4 4 4 4 M110 41 l4 4 -4 4 M103.5 39.5 l3 11" fill="none" stroke="#5fd3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* evaluate: a clipboard of ticks */}
      <g className={on('checklist')}>
        <rect x="94" y="31" width="22" height="28" rx="3" fill="#fff" stroke="#94a3b8" strokeWidth="1" />
        <rect x="100" y="29" width="10" height="4" rx="1.5" fill="#94a3b8" />
        {[39, 46, 53].map((y) => (
          <g key={y}>
            <path d={`M97.5 ${y} l2 2 3.5 -3.5`} fill="none" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="105" y={y - 1} width="8" height="2" rx="1" fill="#cbd5e1" />
          </g>
        ))}
      </g>
    </svg>
  );
}

// The skills section, between the approach and the work: what I can do, told as the four steps of
// the work. The steps run along a numbered path; the avatar sits on the right, holding up a tool
// for the step that is open.
export default function Skills() {
  const [active, setActive] = useState(0);
  const step = skillSteps[active];

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') setActive((i) => (i + 1) % skillSteps.length);
    if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + skillSteps.length) % skillSteps.length);
  };

  return (
    <section className="skills" id="skills" aria-label="Skills">
      <div className="container">
        <header className="section-head reveal">
          <h2 className="section-title is-accent">Process</h2>
          <p className="section-sub">How I combine skills from life sciences, engineering and design at each step of the work.</p>
        </header>
        <div className="skills-panel reveal">
          <div className="skills-main">
            {/* the four steps along a path that fills up to the one that is open */}
            <div
              className="skills-path"
              role="tablist"
              aria-label="Skills, by step of the work"
              onKeyDown={onKeyDown}
              style={{ '--progress': active / (skillSteps.length - 1) }}
            >
              {skillSteps.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  id={`skills-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="skills-step"
                  tabIndex={i === active ? 0 : -1}
                  className={`skills-node ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="skills-node-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="skills-node-title">{s.title}</span>
                </button>
              ))}
            </div>

            <div key={step.title} id="skills-step" role="tabpanel" aria-labelledby={`skills-tab-${active}`} className="skills-slide">
              <p className="skills-lead">{step.text}</p>
              <div className="skills-groups">
                {step.groups.map((group) => (
                  <div key={group.label} className="skills-group">
                    <h3>{group.label}</h3>
                    <ul className="skills-tags">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="skills-guide" aria-hidden="true">
            <div className="hero-disk guide-disk">
              <Avatar className="guide-avatar" track={false} hold />
              <SkillProps pose={step.pose} />
            </div>
            <p key={step.title} className="guide-caption">{step.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
