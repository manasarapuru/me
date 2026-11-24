import { Fragment, useId, useLayoutEffect, useRef, useState } from 'react';

const ENTRY_BLOCKS = 5; // how many per-entry blocks to draw before the "…"

// A workflow as a timeline across swimlanes: one row per team, the steps left to right in the order
// they happen, and an arrow from each step to the next (crossing rows at each handoff). A bracket over
// the steps names the time window they had to fit in. `flow` has `deadline` (the bracket's label),
// `lanes` (by id: `label` and `color`), `steps` (each with `lane`, `title`, `time`; `wide` for a step
// that takes up most of the window; `work`, the tasks a step involves, in order; `perEntry` for a step
// whose work repeats for every entry; `bottleneck`, a note on why the step holds the work up: `title`
// and `text`),
// optional `spans` (a duration `label` bracketed under the steps `from`…`to`, counted from 0) and an
// optional `caption`. With `outline`, only the steps' titles and the brackets are drawn: no times, tasks
// or bottlenecks, as the workflow looks before anyone has been asked about it. The bottlenecks are numbered on their steps and listed beside the diagram, as
// annotations: choosing one, by its marker or in the list, outlines its step and opens its note.
export default function WorkflowTimeline({ flow }) {
  const { lanes, steps, spans = [] } = flow;
  const laneIds = Object.keys(lanes);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const [links, setLinks] = useState([]);
  const [active, setActive] = useState(0);
  // the steps with a bottleneck, numbered in the order they happen
  const notes = flow.outline ? [] : steps.map((step, i) => step.bottleneck && { ...step.bottleneck, step: i }).filter(Boolean);
  const activeStep = notes[active]?.step;
  const marker = `wf-arrow-${useId().replace(/:/g, '')}`;

  // The arrows are drawn over the grid from where the cards actually land, and redrawn whenever the
  // grid changes size (the popup going full screen, the window resizing).
  useLayoutEffect(() => {
    const grid = gridRef.current;
    const measure = () => {
      const box = grid.getBoundingClientRect();
      const rects = cardRefs.current.map((el) => el?.getBoundingClientRect());
      setLinks(
        rects.slice(1).map((to, i) => {
          const from = rects[i];
          const x1 = from.right - box.left;
          const y1 = from.top + from.height / 2 - box.top;
          const x2 = to.left - box.left - 3;
          const y2 = to.top + to.height / 2 - box.top;
          if (Math.abs(y1 - y2) < 2) return `M${x1} ${y1} H${x2}`;
          const mid = (x1 + x2) / 2;
          return `M${x1} ${y1} H${mid} V${y2} H${x2}`;
        })
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [steps]);

  const columns = steps.map((s) => (s.wide ? 'minmax(0, 2fr)' : 'minmax(0, 1fr)')).join(' ');

  return (
    <figure className={`workflow ${flow.outline ? 'is-outline' : ''}`}>
      <div className={`workflow-layout ${notes.length ? 'has-notes' : ''}`}>
      <div className="workflow-main">
      <div className="workflow-deadline">
        <span className="workflow-deadline-label">{flow.deadline}</span>
        <span className="workflow-bracket" aria-hidden="true" />
      </div>

      <div className="workflow-grid" ref={gridRef} style={{ gridTemplateColumns: `var(--wf-lane) ${columns}` }}>
        {laneIds.map((id, row) => (
          <div key={id} className="workflow-lane" style={{ gridRow: row + 1, '--c': lanes[id].color }}>
            <span className="workflow-lane-label">{lanes[id].label}</span>
          </div>
        ))}

        <svg className="workflow-links" aria-hidden="true">
          <defs>
            <marker id={marker} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M1 1 9 5 1 9" />
            </marker>
          </defs>
          {links.map((d) => (
            <path key={d} d={d} markerEnd={`url(#${marker})`} />
          ))}
        </svg>

        {steps.map((step, i) => {
          // a span ending at this step follows it, so it lands in order when the steps are stacked
          const span = spans.find((s) => s.to === i);
          const spanColor = span && lanes[steps[span.from].lane].color;
          const n = notes.findIndex((note) => note.step === i); // this step's bottleneck number, or -1
          return (
            <Fragment key={step.title}>
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`workflow-step ${step.wide ? 'is-wide' : ''} ${i ? 'is-later' : ''}`}
                data-lit={i === activeStep ? '' : undefined}
                style={{ gridColumn: i + 2, gridRow: laneIds.indexOf(step.lane) + 1, '--c': lanes[step.lane].color }}
              >
                {n >= 0 && (
                  <button
                    type="button"
                    className={`tool-marker workflow-marker ${n === active ? 'is-on' : ''}`}
                    onClick={() => setActive(n)}
                    aria-label={`Bottleneck ${n + 1}: ${step.bottleneck.title}`}
                    aria-pressed={n === active}
                  >
                    {n + 1}
                  </button>
                )}
                <span className="workflow-step-lane">{lanes[step.lane].label}</span>
                <span className="workflow-step-title">{step.title}</span>
                {!flow.outline && step.time && <span className="workflow-step-time">{step.time}</span>}
                {!flow.outline && step.work && (
                  <ol className="workflow-work">
                    {step.work.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ol>
                )}
                {!flow.outline && step.perEntry && (
                  <span className="workflow-entries">
                    <span className="workflow-entry-row" aria-hidden="true">
                      {Array.from({ length: ENTRY_BLOCKS }, (_, n) => (
                        <span key={n} className="workflow-entry" />
                      ))}
                      <span className="workflow-entry-more">…</span>
                    </span>
                    {step.perEntry}
                  </span>
                )}
              </div>
              {span && (
                <div
                  className="workflow-span"
                  style={{ gridColumn: `${span.from + 2} / ${span.to + 3}`, gridRow: laneIds.length + 1, '--c': spanColor }}
                >
                  <span className="workflow-span-bracket" aria-hidden="true" />
                  <span className="workflow-span-label">{span.label}</span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      </div>

      {/* the bottlenecks, as notes beside the diagram (under it when there isn't room): the open one shows why */}
      {notes.length > 0 && (
        <ol className="tool-notes workflow-notes">
          {notes.map((note, n) => (
            <li key={note.title}>
              <button type="button" className={`tool-note ${n === active ? 'is-on' : ''}`} onClick={() => setActive(n)} aria-expanded={n === active}>
                <span className="tool-note-num">{n + 1}</span>
                <span className="tool-note-body">
                  <span className="tool-note-title">{note.title}</span>
                  {n === active && (
                    <>
                      <span className="tool-note-source">Bottleneck</span>
                      <span className="tool-note-text">{note.text}</span>
                    </>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      </div>

      {flow.caption && <figcaption className="chat-caption">{flow.caption}</figcaption>}
    </figure>
  );
}
