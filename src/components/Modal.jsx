import { useEffect, useRef, useState } from 'react';

// With `expandable`, a button beside the close button lets the popup fill the screen and back.
// Escape leaves full screen first, then closes.
export default function Modal({ labelledBy, onClose, className = '', expandable = false, children }) {
  const closeRef = useRef(null);
  const [full, setFull] = useState(false);
  const fullRef = useRef(full);
  fullRef.current = full;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (fullRef.current) setFull(false);
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={`modal-backdrop ${full ? 'is-full' : ''}`} onClick={onClose}>
      <div
        className={`modal ${className} ${full ? 'is-full' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
      >
        {expandable && (
          <button
            type="button"
            className="modal-close modal-expand"
            onClick={() => setFull((f) => !f)}
            aria-label={full ? 'Exit full screen' : 'Full screen'}
            title={full ? 'Exit full screen' : 'Full screen'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {full ? (
                <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
              ) : (
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              )}
            </svg>
          </button>
        )}
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
