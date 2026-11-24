import { profile } from '../data.js';
import photo from '../docs/intro_prof.jpg';
import Modal from './Modal.jsx';

// The About popup: photo, name and role, the introduction paragraphs, and a link through to the
// resume for the rest.
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

      {/* closing the popup as it goes, so the resume page isn't left behind it */}
      <a href="#/resume" className="hero-cue is-light about-resume" onClick={onClose}>
        View my resume
        <span className="hero-cue-arrow" aria-hidden="true">→</span>
      </a>
    </Modal>
  );
}
