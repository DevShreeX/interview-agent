import React, { useRef, useEffect } from 'react';

const QuestionPanel = ({ question, answer, onChange, onKeyDown, isSubmitting = false }) => {
  const textareaRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(140, el.scrollHeight)}px`;
  };

  useEffect(() => {
    autoResize();
  }, [answer]);

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span className="mono" style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: 'var(--accent-electric)' }}>
          QUESTION {String(question.number || 1).padStart(2, '0')}
        </span>
        {question.category && (
          <span className="badge" style={{ fontSize: '0.7rem' }}>
            {question.category.toUpperCase()}
          </span>
        )}
      </div>

      <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', lineHeight: 1.4, margin: '0.5rem 0 2rem', fontWeight: 500, color: 'var(--text-primary)' }}>
        {question.prompt}
      </h2>

      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isSubmitting}
          placeholder="Explain your approach, design decisions, trade-offs, and failure mode considerations..."
          rows={5}
          spellCheck="false"
          style={{
            width: '100%',
            minHeight: '150px',
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
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          PRO-TIP: <kbd style={{ background: 'var(--bg-surface)', padding: '0.15rem 0.35rem', borderRadius: '3px', border: '1px solid var(--border-subtle)' }}>Ctrl + Enter</kbd> to submit
        </span>
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {wordCount} words | {answer.length} / 2400 chars
        </span>
      </div>
    </div>
  );
};

export default QuestionPanel;
