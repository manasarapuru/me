import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const FILE = { name: 'customers_request.xlsx', size: '2.4 KB' };
const ENTRIES = ['A-10427', 'A-10583'];

// The playing demo: a bulk request by file, then a small one typed in. Each step holds for `ms`;
// `cursor` names the element the pointer moves to, `click` presses it, and `t` is the running time
// in seconds shown in the window's bar.
const PLAY = [
  { ms: 1400, mode: 'file', status: 'idle', cursor: 'input', t: 0 },
  { ms: 700, mode: 'file', status: 'idle', cursor: 'input', click: true, t: 3 },
  { ms: 1500, mode: 'file', status: 'ready', cursor: 'submit', t: 6 },
  { ms: 2000, mode: 'file', status: 'processing', cursor: 'submit', click: true, t: 8 },
  { ms: 2800, mode: 'file', status: 'done', cursor: 'download', t: 34 },
  { ms: 1400, mode: 'text', status: 'idle', cursor: 'tab-text', click: true, t: 0 },
  { ms: 900, mode: 'text', status: 'ready', typed: 1, cursor: 'input', t: 4 },
  { ms: 1300, mode: 'text', status: 'ready', typed: 2, cursor: 'submit', t: 9 },
  { ms: 2000, mode: 'text', status: 'processing', typed: 2, cursor: 'submit', click: true, t: 11 },
  { ms: 3200, mode: 'text', status: 'done', typed: 2, cursor: 'download', t: 29 },
];
const STILL = PLAY[4]; // shown instead of the animation to visitors who prefer reduced motion

// Where an element sits inside a container, in px.
function place(el, box) {
  if (!el || !box) return null;
  const r = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  return { left: r.left - b.left, top: r.top - b.top, width: r.width, height: r.height, boxWidth: b.width, boxHeight: b.height };
}

// A mock of the self-service tool. With `annotations` it holds still beside a numbered list of notes
// (`title`, `text`, and a `source` such as a design decision or a usability-testing round): choosing
// one, in the list or by its marker on the screen, outlines its element and opens it in the list;
// a note's `screen` changes what the tool shows. Without them it plays through a file upload and a
// typed request on a loop.
export default function ToolDemo({ demo }) {
  const annotated = Boolean(demo.annotations);
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(0);
  const [layout, setLayout] = useState({ cursor: null, markers: [] });
  const [resized, setResized] = useState(0);
  const figureRef = useRef(null);
  const stageRef = useRef(null); // the window and its markers
  const windowRef = useRef(null);
  const targets = useRef({});

  // Play once the demo has scrolled into view.
  useEffect(() => {
    if (annotated) return undefined;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setStarted(true), { threshold: 0.4 });
    observer.observe(figureRef.current);
    return () => observer.disconnect();
  }, [annotated]);

  useEffect(() => {
    if (annotated || !started || reducedMotion) return undefined;
    const timer = setTimeout(() => setStep((s) => (s + 1) % PLAY.length), PLAY[step].ms);
    return () => clearTimeout(timer);
  }, [annotated, started, reducedMotion, step]);

  useEffect(() => {
    const onResize = () => setResized((n) => n + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const note = annotated ? demo.annotations[active] : null;
  const screen = annotated ? { ...demo.screen, ...note.screen } : reducedMotion ? STILL : PLAY[step];
  const { mode, status } = screen;
  const typed = ENTRIES.slice(0, screen.typed ?? 0);

  // Measure after each change: the pointer's spot, or (annotated) where the markers go.
  useLayoutEffect(() => {
    const at = (name, box) => place(targets.current[name], box.current);
    setLayout({
      cursor: annotated ? null : at(screen.cursor, windowRef),
      markers: annotated ? demo.annotations.map((a) => at(a.target, stageRef)) : [],
    });
  }, [annotated, step, active, resized]); // eslint-disable-line react-hooks/exhaustive-deps

  // Props for an element a note or the pointer can point at.
  const spot = (name) => ({
    ref: (el) => {
      targets.current[name] = el;
    },
    'data-lit': note?.target === name ? '' : undefined,
  });

  const { cursor, markers } = layout;

  return (
    <figure className={`tool-demo ${annotated ? 'is-annotated' : ''}`} ref={figureRef}>
      <div className="tool-layout">
      <div className="tool-stage" ref={stageRef}>
      <div className="tool-window" ref={windowRef}>
        <div className="tool-bar">
          <span className="tool-lights" aria-hidden="true" />
          <span className="tool-url">
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
              <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {demo.url}
          </span>
          {!annotated && (
            <span className="tool-clock">
              Total time <b>{screen.t} s</b>
            </span>
          )}
        </div>

        <div className="tool-app" aria-hidden="true">
          <nav className="tool-nav">
            <span className="tool-nav-icon is-on">
              <svg viewBox="0 0 24 24"><path d="M12 15V4m0 0L8 8m4-4 4 4M5 15v4h14v-4" /></svg>
            </span>
            {/* contact / report a problem: a speech bubble with an exclamation mark */}
            <span className="tool-nav-icon" {...spot('contact')}>
              <svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" /><path d="M12 8.5v3.5M12 14.2v.1" /></svg>
            </span>
            <span className="tool-avatar is-nav">A</span>
          </nav>

          <div className="tool-main">
            <div className="tool-head">
              Run Analysis
              <span className="tool-user">
                {/* help: opens a short tutorial, on every screen */}
                <span className="tool-help" {...spot('help')}>?</span>
                Alex M.
                <span className="tool-avatar">A</span>
              </span>
            </div>
            <div className="tool-body">
              <div className="tool-card">
                <div className="tool-card-head">
                  <span className="tool-card-title">New request</span>
                  <span className="tool-limits" {...spot('limits')}>
                    {mode === 'file' ? 'xlsx format · max 10 MB' : 'One entry per line'}
                  </span>
                </div>

                <div className="tool-tabs" {...spot('tabs')}>
                  <span className={`tool-tab ${mode === 'file' ? 'is-on' : ''}`}>Upload a file</span>
                  <span className={`tool-tab ${mode === 'text' ? 'is-on' : ''}`} {...spot('tab-text')}>
                    Type entries
                  </span>
                </div>

                {mode === 'file' && status === 'idle' && (
                  <div className="tool-drop" {...spot('input')}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 8a4.5 4.5 0 0 1 .5 9M12 12v8m0-8-3 3m3-3 3 3" /></svg>
                    Drop a file here or <span className="tool-drop-btn">Upload</span>
                  </div>
                )}
                {mode === 'file' && status !== 'idle' && (
                  <div className="tool-file" {...spot('input')}>
                    <span className="tool-file-icon">xlsx</span>
                    <span className="tool-file-name">
                      {FILE.name}
                      <span className="tool-file-meta">{FILE.size} · Ready</span>
                    </span>
                    <span className="tool-file-check">✓</span>
                  </div>
                )}
                {mode === 'text' && (
                  <div className={`tool-entry ${typed.length ? 'has-text' : ''}`} {...spot('input')}>
                    {typed.length ? typed.map((line) => <span key={line}>{line}</span>) : <span className="tool-entry-hint">e.g. A-10427</span>}
                    {!annotated && status === 'ready' && step < 8 && <span className="tool-caret" />}
                  </div>
                )}

                {status === 'done' ? (
                  <div className="tool-actions">
                    <span className="tool-btn is-done" {...spot('submit')}>✓ Task complete</span>
                    <span className="tool-btn is-download" {...spot('download')}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" /></svg>
                      Download results
                    </span>
                  </div>
                ) : (
                  <div className="tool-actions">
                    <span className={`tool-btn ${status === 'idle' ? 'is-off' : ''}`} {...spot('submit')}>
                      {status === 'processing' ? (
                        <>
                          <span className="tool-spinner" />
                          Processing…
                        </>
                      ) : (
                        'Submit'
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {cursor && (
          <span
            className="tool-cursor"
            style={{ left: cursor.left + cursor.width * 0.55, top: cursor.top + cursor.height * 0.6 }}
            aria-hidden="true"
          >
            {screen.click && <span key={step} className="tool-click" />}
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path d="M2 1.5v12l3.3-3.1 2.2 4.8 2-.9-2.2-4.7h4.4z" fill="#111827" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {annotated &&
        markers.map(
          (m, i) =>
            m && (
              <button
                key={demo.annotations[i].title}
                type="button"
                className={`tool-marker ${i === active ? 'is-on' : ''}`}
                style={{ left: m.left - 9, top: m.top - 9 }}
                onClick={() => setActive(i)}
                aria-label={`Note ${i + 1}: ${demo.annotations[i].title}`}
                aria-pressed={i === active}
              >
                {i + 1}
              </button>
            )
        )}
      </div>

      {/* the notes, beside the screen: the open one shows its source and reasoning */}
      {annotated && (
        <ol className="tool-notes">
          {demo.annotations.map((a, i) => (
            <li key={a.title}>
              <button
                type="button"
                className={`tool-note ${i === active ? 'is-on' : ''}`}
                onClick={() => setActive(i)}
                aria-expanded={i === active}
              >
                <span className="tool-note-num">{i + 1}</span>
                <span className="tool-note-body">
                  <span className="tool-note-title">{a.title}</span>
                  {i === active && (
                    <>
                      {a.source && <span className="tool-note-source">{a.source}</span>}
                      <span className="tool-note-text">{a.text}</span>
                    </>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
      </div>

      {demo.caption && <figcaption className="chat-caption">{demo.caption}</figcaption>}
    </figure>
  );
}
