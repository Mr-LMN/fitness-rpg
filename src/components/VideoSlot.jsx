import React, { useRef, useState, useEffect } from 'react';

/**
 * VideoSlot — Universal video player for cutscenes and room intros.
 *
 * Drop a video file at the specified path and it auto-plays.
 * If the file is missing, calls onEnd immediately — the game never breaks.
 *
 * Video naming and placement: see /MEDIA_GUIDE.md
 *
 * Usage:
 *   <VideoSlot src="/videos/intro-cinematic.mp4" onEnd={handleVideoEnd} />
 */
export default function VideoSlot({
  src,
  onEnd,
  poster,
  loop = false,
  muted = false,
  label = '',
  className = '',
  style = {},
}) {
  const videoRef = useRef(null);
  const [missing, setMissing] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setMissing(false);
    setCanSkip(false);
  }, [src]);

  // Show skip button after 1 second of playback
  useEffect(() => {
    if (missing) return;
    const t = setTimeout(() => setCanSkip(true), 1000);
    return () => clearTimeout(t);
  }, [missing]);

  const handleError = () => {
    setMissing(true);
    if (onEnd) onEnd();
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (onEnd) onEnd();
  };

  if (missing) return null;

  return (
    <div
      className={`video-slot ${className}`}
      style={{ position: 'relative', width: '100%', borderRadius: 8, overflow: 'hidden', background: '#000', ...style }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop={loop}
        muted={muted}
        playsInline
        poster={poster}
        onError={handleError}
        onEnded={onEnd}
        style={{ width: '100%', display: 'block', maxHeight: '70vh', objectFit: 'contain' }}
        aria-label={label || src}
      />

      {/* Skip button — appears after 1s, only for non-looping videos with an onEnd callback */}
      {canSkip && onEnd && !loop && (
        <button
          onClick={handleSkip}
          aria-label="Skip video"
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(200,168,75,0.6)',
            color: '#c8a84b',
            borderRadius: 4,
            padding: '6px 16px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '0.12em',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => { e.target.style.background = 'rgba(200,168,75,0.2)'; }}
          onMouseLeave={(e) => { e.target.style.background = 'rgba(0,0,0,0.75)'; }}
        >
          SKIP ▶
        </button>
      )}
    </div>
  );
}
