import { useState } from 'react';
import { statusById, themeTag } from '../data.js';
import ChatDemo from './ChatDemo.jsx';
import FilesDemo from './FilesDemo.jsx';
import ExplorerDemo from './ExplorerDemo.jsx';
import DenseDemo from './DenseDemo.jsx';
import PosterDemo from './PosterDemo.jsx';
import CompanionDemo from './CompanionDemo.jsx';
import JargonDemo from './JargonDemo.jsx';
import ToolDemo from './ToolDemo.jsx';
import RoleFlow from './RoleFlow.jsx';
import WorkflowTimeline from './WorkflowTimeline.jsx';
import IOFlow from './IOFlow.jsx';
import VideoCarousel from './VideoCarousel.jsx';
import Modal from './Modal.jsx';
import SocialLinks from './SocialLinks.jsx';

// Renders **bold** spans inside a section's text.
function renderText(text) {
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

function Personas({ personas }) {
  return (
    <div className="persona-list">
      {personas.map((persona) => (
        <article key={persona.name} className="persona" style={{ '--c': persona.color }}>
          <div className="persona-head">
            <span className="persona-avatar" aria-hidden="true">{persona.name[0]}</span>
            <div>
              <p className="persona-name">
                {persona.name}
                <span className="persona-role">{persona.role}</span>
              </p>
              <p className="persona-team">{persona.team}</p>
            </div>
          </div>
          <div className="persona-body">
            <div>
              <h5>Goals</h5>
              <ul className="persona-points is-goals">
                {persona.goals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5>Pain points</h5>
              <ul className="persona-points is-pains">
                {persona.pains.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// The distinct disciplines behind a stage's practices, e.g. "UX · Product".
function disciplines(practices) {
  return [...new Set(practices.flatMap((p) => p.discipline.split(' / ')))].join(' · ');
}

// Splits `details` into tabs at each `{ group }` block.
function toTabs(details) {
  const tabs = [];
  for (const block of details) {
    if (block.group) tabs.push({ label: block.group, sections: [] });
    else {
      if (!tabs.length) tabs.push({ label: 'Project overview', sections: [] });
      tabs[tabs.length - 1].sections.push(block);
    }
  }
  return tabs;
}

function Stages({ stages, standalone }) {
  // On their own (not under a section's heading), the steps take the sections' layout: the step's
  // number, name and disciplines on the left, its content on the right.
  if (standalone) {
    return stages.map((stage, i) => (
      <div key={stage.title} className="modal-section process-section">
        <div className="process-label">
          <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{stage.title}</h3>
          {stage.practices && <span className="process-count">{disciplines(stage.practices)}</span>}
        </div>
        <div className="modal-section-body">
          <Body block={stage} />
          {stage.personas && (
            <>
              <h5 className="process-sub">Personas</h5>
              {stage.personasNote && <p className="process-sub-note">{stage.personasNote}</p>}
              <Personas personas={stage.personas} />
            </>
          )}
          {/* a workflow diagram filled in from what was learned in this step */}
          {stage.mappedNote && <p className="process-mapped-note">{stage.mappedNote}</p>}
          {stage.mappedWorkflow && <WorkflowTimeline flow={stage.mappedWorkflow} />}
        </div>
      </div>
    ));
  }

  return (
    <div className={`project-process ${standalone ? 'is-standalone' : ''}`}>
      <ol className="process-steps">
        {stages.map((stage) => (
          <li key={stage.title} className="process-step">
            <div className="process-head">
              <h4>{stage.title}</h4>
              {stage.practices && <span className="process-count">{disciplines(stage.practices)}</span>}
            </div>
            <div className="process-body">
              <Body block={stage} />
            </div>
            {stage.personas && (
              <>
                <h5>Personas</h5>
                <Personas personas={stage.personas} />
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

// The content fields shared by sections and stages.
function Body({ block }) {
  return (
    <>
      {/* a question that leads the section, set like the design-question callout */}
      {block.question && <p className="process-question">{block.question}</p>}
      {[].concat(block.text ?? []).map((text) => (
        <p key={text}>{renderText(text)}</p>
      ))}
      {block.list && (
        <ol className="modal-goals">
          {block.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )}
      {block.bullets && (
        <ul className="modal-bullets">
          {block.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {block.chips && (
        <ul className="modal-chips">
          {block.chips.map((item) => (
            <li key={item} className="chip">{item}</li>
          ))}
        </ul>
      )}
      {block.table && (
        <dl className="feedback-table">
          {block.table.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>
                {row.items ? (
                  <ul className="modal-bullets">
                    {row.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  renderText(row.value)
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {/* problems and their answers, as numbered cards side by side */}
      {block.fixes && (
        <ol className="fix-cards">
          {block.fixes.map((item, i) => (
            <li key={item.title} className="fix-card">
              <span className="fix-problem">
                <span className="tool-note-num fix-num">{i + 1}</span>
                {item.title}
              </span>
              <span className="fix-arrow" aria-hidden="true">↓</span>
              <span className="fix-answer">{item.fix}</span>
            </li>
          ))}
        </ol>
      )}
      {[].concat(block.after ?? []).map((text) => (
        <p key={text}>{renderText(text)}</p>
      ))}
      {block.chat && <ChatDemo chat={block.chat} />}
      {block.files && <FilesDemo demo={block.files} />}
      {block.explorer && <ExplorerDemo demo={block.explorer} />}
      {block.dense && <DenseDemo demo={block.dense} />}
      {block.poster && <PosterDemo demo={block.poster} />}
      {block.companion && <CompanionDemo demo={block.companion} />}
      {block.jargon && <JargonDemo demo={block.jargon} />}
      {block.flow && <RoleFlow flow={block.flow} />}
      {block.workflow && <WorkflowTimeline flow={block.workflow} />}
      {/* one flow, or several in order (e.g. iterations): the last starts open, with a shared caption under it */}
      {block.io &&
        [].concat(block.io).map((flow, i, all) => (
          <IOFlow
            key={flow.label ?? i}
            flow={i === all.length - 1 && block.ioCaption ? { ...flow, caption: block.ioCaption } : flow}
            defaultOpen={i === all.length - 1}
          />
        ))}
      {block.tool && <ToolDemo demo={block.tool} />}
      {/* before and after as two cards side by side, the same rows in each */}
      {block.compare && (
        <div className="compare">
          {['before', 'after'].map((side) => (
            <div key={side} className={`compare-card is-${side}`}>
              <p className="compare-head">{block.compare[side]}</p>
              <dl>
                {block.compare.rows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row[side]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
      {block.videos && <VideoCarousel videos={block.videos} />}
      {block.embed && (
        <figure className="embed-demo">
          <div className="embed-window">
            <div className="embed-bar">
              <span className="embed-dots" aria-hidden="true" />
              <span className="embed-url">{block.embed.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
              <a href={block.embed.url} target="_blank" rel="noreferrer" className="link-btn">
                Open full size <span aria-hidden="true">↗</span>
              </a>
            </div>
            <iframe src={block.embed.url} title={block.embed.title} loading="lazy" />
          </div>
          <figcaption className="chat-caption">{block.embed.caption}</figcaption>
        </figure>
      )}
      {block.quotes?.map((quote) => (
        <blockquote key={quote} className="modal-quote">“{quote}”</blockquote>
      ))}
      {[].concat(block.closing ?? []).map((text) => (
        <p key={text}>{renderText(text)}</p>
      ))}
      {block.socials && <SocialLinks ids={block.socials} />}
    </>
  );
}

// A collapsible group of steps (`expand` is its name, `summary` an optional line beside it). Closed to
// start; its steps are only rendered once opened, so diagrams inside measure themselves at full size.
function Expandable({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`expand-section ${open ? 'is-open' : ''}`}>
      <button type="button" className="expand-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="expand-title">{section.expand}</span>
        {section.summary && <span className="expand-summary">{section.summary}</span>}
        <span className="expand-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="expand-body">
          <Stages stages={section.stages} standalone />
        </div>
      )}
    </div>
  );
}

function Section({ section }) {
  if (section.expand) return <Expandable section={section} />;
  return (
    <>
      {section.heading && (
        <div className={`modal-section ${section.callout ? 'modal-callout' : ''}`}>
          <h3>{section.heading}</h3>
          <div className="modal-section-body">
            <Body block={section} />
          </div>
        </div>
      )}
      {section.stages && <Stages stages={section.stages} standalone={!section.heading} />}
    </>
  );
}

export default function ProjectModal({ project, onClose }) {
  const tabs = toTabs(project.details ?? []);
  const theme = themeTag(project);
  const status = statusById[project.status];
  const [active, setActive] = useState(0);

  return (
    <Modal labelledBy="project-modal-title" onClose={onClose} className={tabs.length > 1 ? 'modal-wide' : 'modal-roomy'} expandable>
      {/* everything above the tabs, on a card of its own */}
      <header className="case-head">
        <p className="eyebrow eyebrow-skill" style={{ '--c': theme.color }}>
          {theme.label}
        </p>
        <h2 id="project-modal-title" className="modal-title">{project.title}</h2>
        {/* under the title: the summary where there is one (it stands in for the result box), else the tagline,
            which moves into the result box when there is a result to show */}
        {project.summary ? (
          <p className="modal-tagline modal-summary">{renderText(project.summary)}</p>
        ) : (
          !project.stat && <p className="modal-tagline">{project.tagline}</p>
        )}

        {/* the facts about the work, each under a small label */}
        <dl className="case-facts">
          {[
            ['Type', project.kind],
            ['Status', status && <span className="case-status" style={{ '--c': status.color }}>{status.label}</span>],
            ['Where', project.place],
            ['Year', project.year],
            ['Skills', project.skills.join(' · ')],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className={label === 'Skills' ? 'case-skills' : ''}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
        {project.meta && <p className="modal-meta">{project.meta}</p>}

        {project.stat && !project.summary && (
          <div className="result-stat">
            <p className="stat-summary">{project.tagline}</p>
            <div>
              <span className="stat-label">Before</span>
              <span className="stat-value">{project.stat.from}</span>
            </div>
            <span className="stat-arrow" aria-hidden="true">→</span>
            <div>
              <span className="stat-label">After</span>
              <span className="stat-value is-after">{project.stat.to}</span>
            </div>
            <p className="stat-caption">{project.stat.label}</p>
          </div>
        )}
      </header>

      {tabs.length ? (
        <>
          {tabs.length > 1 && (
            <div className="project-tabs" role="tablist">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`project-tab ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="project-tab-num">{i + 1}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          <div className="project-sections" role={tabs.length > 1 ? 'tabpanel' : undefined}>
            {tabs[active].sections.map((section, i) => (
              <Section key={section.heading ?? section.expand ?? i} section={section} />
            ))}
          </div>
        </>
      ) : (
        <p className="modal-section modal-pending">Details coming soon.</p>
      )}
    </Modal>
  );
}
