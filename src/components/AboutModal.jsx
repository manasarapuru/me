import { profile } from '../data.js';
import photo from '../docs/intro_prof.jpg';
import Modal from './Modal.jsx';

// The degrees, certificates and memberships recorded along the timeline, gathered by kind.
const marks = profile.timeline.flatMap((chapter) => chapter.roles.filter((entry) => entry.mark));
const CREDENTIALS = [
  ['Education', marks.filter((entry) => entry.mark === 'Education')],
  ['Certifications', marks.filter((entry) => entry.mark === 'Certificate')],
  ['Memberships', marks.filter((entry) => entry.mark === 'Membership')],
].filter(([, items]) => items.length);

export default function AboutModal({ onClose }) {
  return (
    <Modal labelledBy="about-modal-title" onClose={onClose} className="modal-mid">
      <div className="about-head">
        <div className="about-avatar">
          <img className="about-photo" src={photo} alt={profile.name} />
        </div>
        <div>
          <p className="eyebrow">About</p>
          <h2 id="about-modal-title" className="modal-title">{profile.name}</h2>
          <p className="modal-tagline">{profile.role}</p>
        </div>
      </div>

      {profile.bio.map((paragraph) => (
        <p key={paragraph} className="about-bio">{paragraph}</p>
      ))}

      {/* tucked away until asked for, so the timeline below stays about the work */}
      <details className="about-more">
        <summary>Education and certifications</summary>
        {CREDENTIALS.map(([heading, items]) => (
          <div key={heading} className="about-more-group">
            <h3>{heading}</h3>
            <ul className="edu-list">
              {items.map((item) => (
                <li key={item.name}>
                  <span className="edu-name">{item.name}</span>
                  <span className="edu-org">{item.org}</span>
                  <span className="edu-dates">{item.dates}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </details>

      <div className="modal-section about-path">
        <h3>My path</h3>
        <ol className="timeline">
          {profile.timeline.map((chapter, i) => (
            <li
              key={chapter.period}
              className={`${i % 2 ? 'is-right' : 'is-left'} ${chapter.current ? 'is-current' : ''}`}
              style={{ '--c': chapter.color }}
            >
              {/* the period sits across the line from its card */}
              <div className="timeline-when">
                <span className="timeline-period">{chapter.period}</span>
                <span className="timeline-label">{chapter.label}</span>
                {chapter.summary && <span className="timeline-summary">{chapter.summary}</span>}
              </div>
              <span className="timeline-dot" aria-hidden="true" />
              <ul className="timeline-card timeline-roles">
                {chapter.roles
                  .filter((entry) => !entry.mark)
                  .map((entry) => (
                    <li key={`${entry.role}-${entry.org}`}>
                      <span className="timeline-role">{entry.role}</span>
                      <span className="timeline-org">{entry.org}</span>
                      {entry.detail && <span className="timeline-detail">{entry.detail}</span>}
                      <span className="timeline-dates">{entry.dates}</span>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
