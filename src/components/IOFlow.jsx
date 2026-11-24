import { useState } from 'react';

// images in src/media, looked up by file name
const IMAGES = import.meta.glob('../media/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });

const ICONS = {
  upload: <path d="M12 15V4m0 0L8 8m4-4 4 4M5 15v4h14v-4" />,
  process: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  download: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />,
};

// An input → processing → output flow: one card per stage, joined by arrows, each with an icon, its
// name, who carries it out and its numbered steps. `flow` has `stages` (each with `title`, `who`,
// `icon` (upload, process or download), `color` and `steps`), and optionally a `label` (e.g. an
// iteration) with a `note` on what changed, and a `caption`. A step is a line of text, or
// `{ text, options, added, empty }`: `options` for a step that can be done in more than one way (shown
// as alternatives under it), `added` to tag it as new in this version, `empty` for a note that there
// is no step here (plain text, unnumbered).
// With a `label`, the flow is collapsible under it: open to start only if `defaultOpen`. A `wireframe`
// (`file` in src/media, `alt`, optional `caption`) is shown under the cards.
export default function IOFlow({ flow, defaultOpen = true }) {
  const [open, setOpen] = useState(flow.label ? defaultOpen : true);
  return (
    <figure className={`io-flow ${open ? 'is-open' : ''}`}>
      {flow.label && (
        <button type="button" className="io-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="expand-chevron" aria-hidden="true" />
          <span className="io-label">{flow.label}</span>
          {flow.note && <span className="io-note">{flow.note}</span>}
        </button>
      )}
      {open && (
        <>
          <ol className="io-stages">
            {flow.stages.map((stage) => (
              <li key={stage.title} className="io-stage" style={{ '--c': stage.color }}>
                <span className="io-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    {ICONS[stage.icon]}
                  </svg>
                </span>
                <span className="io-title">{stage.title}</span>
                <span className="io-who">{stage.who}</span>
                <ol className="io-steps">
                  {stage.steps.map((step) => {
                    const text = step.text ?? step;
                    return (
                      <li key={text} className={`io-step ${step.added ? 'is-added' : ''} ${step.empty ? 'is-empty' : ''}`}>
                        <span className="io-step-text">
                          {text}
                          {step.added && <span className="io-new">New</span>}
                        </span>
                        {step.options && (
                          <span className="io-options">
                            {step.options.map((option, n) => (
                              <span key={option} className="io-option-wrap">
                                {n > 0 && <span className="io-or">or</span>}
                                <span className="io-option">{option}</span>
                              </span>
                            ))}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
          {flow.wireframe && (
            <div className="io-wireframe">
              <img src={IMAGES[`../media/${flow.wireframe.file}`]} alt={flow.wireframe.alt} loading="lazy" />
              {flow.wireframe.caption && <span className="io-wireframe-caption">{flow.wireframe.caption}</span>}
            </div>
          )}
          {flow.caption && <figcaption className="chat-caption">{flow.caption}</figcaption>}
        </>
      )}
    </figure>
  );
}
