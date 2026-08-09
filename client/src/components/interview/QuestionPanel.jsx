import React, { useRef, useEffect } from 'react';

const QuestionPanel = ({ question, answer, onChange }) => {
  const textareaRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize();
  }, [answer]);

  return (
    <div>
      <span className="mono" style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>
        QUESTION {String(question.number).padStart(2, '0')}
      </span>

      <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 1.9rem)', lineHeight: 1.35, margin: '1rem 0 2.5rem', fontWeight: 500, maxWidth: '640px' }}>
        {question.prompt}
      </h2>

      <textarea
        ref={textareaRef}
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your answer…"
        rows={4}
        spellCheck="false"
        style={{
          width: '100%',
          minHeight: '140px',
          resize: 'none',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          lineHeight: 1.7,
          padding: '1.25rem',
          outline: 'none',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--border-accent)';
          e.target.style.boxShadow = 'var(--glow-electric)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-subtle)';
          e.target.style.boxShadow = 'none';
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {answer.length} / 2400 chars
        </span>
      </div>
    </div>
  );
};

export default QuestionPanel;
