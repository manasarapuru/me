import { useCallback, useEffect, useRef, useState } from 'react';
import {
  profile,
  themes,
  projects,
  featuredProjects,
  showStartHere,
  skillById,
  themesOf,
} from './data.js';
import { parseEmphasis } from './text.js';
import HeroFigure from './components/HeroFigure.jsx';
import IntroOverlay from './components/IntroOverlay.jsx';
import Story from './components/Story.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import AboutModal from './components/AboutModal.jsx';
import SkillModal from './components/SkillModal.jsx';
import ContactPage from './components/ContactPage.jsx';
import ResumePage from './components/ResumePage.jsx';
import SocialLinks from './components/SocialLinks.jsx';
import SocialIcons from './components/SocialIcons.jsx';

function Header({ theme, onToggleTheme, onAbout }) {
  const dark = theme === 'dark';
  // On narrow screens the links fold away into a menu, opened with the button at the end of the bar.
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#top" className="brand">
          <span className="brand-name">{profile.name}</span>
        </a>
        <nav className={`header-nav ${menuOpen ? 'is-open' : ''}`}>
          <div id="nav-links" className="nav-links">
            <a href="#explore" className="nav-link" onClick={closeMenu}>Work</a>
            <button
              type="button"
              className="nav-link"
              onClick={() => {
                closeMenu();
                onAbout();
              }}
            >
              About me
            </button>
            <a href="#/resume" className="nav-link" onClick={closeMenu}>Resume</a>
            {/* in the menu on the narrowest screens, where the button in the bar has no room */}
            <a href="#/contact" className="nav-link nav-contact" onClick={closeMenu}>Get in touch</a>
          </div>
          <a href="#/contact" className="btn btn-primary" onClick={closeMenu}>Get in touch</a>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {dark ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
                </>
              ) : (
                <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" strokeLinejoin="round" />
              )}
            </svg>
          </button>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="nav-links"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero({ figureRef, headlineRef, revealed, figureVisible }) {
  return (
    <section className={`hero ${revealed ? 'is-revealed' : ''}`} id="top">
      <div className="container">
        <div className="hero-grid">
          {/* Left blank until the intro's headline has landed on this spot, then shown in its place. */}
          <h1 ref={headlineRef} className={`hero-statement ${figureVisible ? '' : 'is-hidden'}`}>
            {parseEmphasis(profile.statement[0]).map((piece, i) =>
              piece.strong ? <em key={i}>{piece.text}</em> : piece.text
            )}
          </h1>

          <div className="hero-side">
            {/* Hidden while the intro plays; the intro's disk glides onto this spot and this one takes over. */}
            <HeroFigure figureRef={figureRef} className={figureVisible ? '' : 'is-hidden'} sceneOnly />
            <SocialIcons ids={['linkedin']} className="hero-socials hero-copy" />
          </div>
        </div>

        <div className="hero-sub hero-copy">
          {profile.statement.slice(1).map((sentence) => (
            <p key={sentence} className="hero-intro">
              {parseEmphasis(sentence).map((piece, i) => (piece.strong ? <em key={i}>{piece.text}</em> : piece.text))}
            </p>
          ))}
          <ul className="hero-tags">
            {profile.heroTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <a href="#explore" className="hero-cue">
            Explore my work
            <span className="hero-cue-arrow" aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// The projects under each design challenge, in the order they appear in the data.
const challengeProjects = Object.fromEntries(themes.map((t) => [t.id, projects.filter((p) => themesOf(p).includes(t.id))]));
const pad = (n) => String(n).padStart(2, '0');

function Explorer({ onOpenProject }) {
  const featured = showStartHere
    ? featuredProjects.map((f) => ({ ...f, project: projects.find((p) => p.id === f.id) })).filter((f) => f.project)
    : [];

  return (
    <section className="explorer" id="explore">
      <div className="container">
        <header className="section-head reveal">
          <h2 className="section-title is-accent">Projects</h2>
        </header>
        {/* the reveal sits on a wrapper: the scroll reveal adds a class to it, which React would drop on re-render */}
        <div className="reveal">
        <div className="explorer-card">
          <div className="explorer-main">
            <div className="explorer-intro">
              <div>
                <h2 className="explorer-title">Where the gap shows up.</h2>
                <p className="explorer-text">
                  In practice, the gap between what software makes possible and what people can actually do with it
                  takes different forms. I explore three recurring design challenges through my past work.
                </p>
              </div>
            </div>

            {/* one card per design challenge: its number, name and question, then links to its projects */}
            <ol className="challenge-cards">
              {themes.map((t, i) => {
                const list = challengeProjects[t.id];
                return (
                  <li key={t.id} className="challenge-card" style={{ '--c': t.color }}>
                    <span className="challenge-num">{pad(i + 1)}.</span>
                    <h3 className="challenge-title">{t.label}</h3>
                    <p className="challenge-question">{t.question}</p>
                    <div className="challenge-foot">
                      <span className="challenge-count">
                        {list.length ? `${pad(list.length)} ${list.length === 1 ? 'project' : 'projects'}` : 'No projects yet'}
                      </span>
                      <ul className="challenge-projects">
                        {list.map((p) => (
                          <li key={p.id}>
                            {/* a project still being written up is listed, greyed out, but can't be opened yet */}
                            {p.comingSoon ? (
                              <span className="challenge-link is-soon">
                                {p.title}
                                <span className="challenge-soon">Coming soon</span>
                              </span>
                            ) : (
                              <button type="button" className="challenge-link" onClick={() => onOpenProject(p.id)}>
                                {p.title}
                                <span aria-hidden="true"> ↗</span>
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* a shortcut for anyone skimming: two projects to start with, and what each shows */}
            {featured.length > 0 && (
              <div className="start-here">
                <p className="start-here-title">Short on time? Start here:</p>
                <ul>
                  {featured.map((f) => (
                    <li key={f.id}>
                      <button type="button" className="start-here-link" onClick={() => onOpenProject(f.id)}>
                        {f.project.title}
                        <span aria-hidden="true"> ↗</span>
                      </button>
                      <span className="start-here-why">{f.why}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  // The contact and resume pages live at #/contact and #/resume; every other hash is a section of the home page.
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const page = hash === '#/contact' ? 'contact' : hash === '#/resume' ? 'resume' : 'home';

  // Start the contact page at the top; coming back, scroll to the section the link asked for.
  useEffect(() => {
    if (page !== 'home') window.scrollTo(0, 0);
    else if (hash.length > 1) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [page, hash]);

  // Light is the default theme. A visitor's own choice is remembered; index.html applies it before first paint.
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('theme-choice', next);
    } catch {
      // storage unavailable (private mode): the choice just won't persist
    }
  };

  // Only one popup is open at a time: { type: 'about' | 'skill' | 'project', id? } or null.
  const [modal, setModal] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);
  const openAbout = () => setModal({ type: 'about' });
  const openSkill = (id) => setModal({ type: 'skill', id });
  const openProject = (id) => setModal({ type: 'project', id });

  // Intro: 'playing' (avatar centered) → 'leaving' (gliding to the hero) → 'done'.
  // Skipped entirely for visitors who prefer reduced motion.
  const [intro, setIntro] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'done' : 'playing'
  );
  const heroFigureRef = useRef(null);
  const heroHeadlineRef = useRef(null);
  const introLeave = useCallback(() => setIntro('leaving'), []);
  const introDone = useCallback(() => setIntro('done'), []);

  // Sections slide up into place as they are scrolled to. Elements marked .reveal start hidden only
  // once this has run (it adds .has-reveal to the page), so without it everything simply shows.
  // It waits for the intro to finish, so nothing is revealed behind it before anyone can see.
  useEffect(() => {
    if (page === 'home' && intro !== 'done') return undefined;
    const items = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window) || !items.length) return undefined;
    document.documentElement.classList.add('has-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [page, intro]);

  return (
    <>
      {page === 'home' && intro !== 'done' && (
        <IntroOverlay
          targetRef={heroFigureRef}
          headlineRef={heroHeadlineRef}
          onLeave={introLeave}
          onDone={introDone}
        />
      )}
      <Header theme={theme} onToggleTheme={toggleTheme} onAbout={openAbout} />
      {page === 'contact' ? (
        <main>
          <ContactPage />
        </main>
      ) : page === 'resume' ? (
        <main>
          <ResumePage />
        </main>
      ) : (
        <main>
          <Hero
            figureRef={heroFigureRef}
            headlineRef={heroHeadlineRef}
            revealed={intro !== 'playing'}
            figureVisible={intro === 'done'}
          />
          <Story />
          <Explorer onOpenProject={openProject} />
        </main>
      )}
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <SocialLinks />
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </footer>

      {modal?.type === 'about' && (
        <AboutModal onClose={closeModal} />
      )}

      {modal?.type === 'skill' && (
        <SkillModal skill={skillById[modal.id]} onClose={closeModal} onOpenProject={openProject} />
      )}

      {modal?.type === 'project' && (
        <ProjectModal
          project={projects.find((p) => p.id === modal.id)}
          onClose={closeModal}
        />
      )}
    </>
  );
}
