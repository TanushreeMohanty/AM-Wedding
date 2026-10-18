import React, { useState, useEffect, useRef, useCallback } from 'react';
import Confetti from 'react-confetti';

// ── Opening Curtain ─────────────────────────────────────
const CURTAIN_STRIPS = 10;

function Curtain({ onOpen }) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (gone) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [gone]);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpen?.();
    setTimeout(() => setGone(true), 3800);
  };

  if (gone) return null;
  return (
    <div className={`curtain ${opening ? 'opening' : ''}`}>
      {['left', 'right'].map(side => (
        <div key={side} className={`curtain-panel ${side}`}>
          {Array.from({ length: CURTAIN_STRIPS }, (_, i) => (
            <div key={i} className={`curtain-strip ${i === CURTAIN_STRIPS - 1 ? 'inner' : ''}`} style={{ '--i': i }} />
          ))}
        </div>
      ))}
      <div className="curtain-valance" />
      <div className="curtain-center">
        <img src="/images/logo.png" alt="" className="curtain-logo" />
        <p className="curtain-odia">ଶ୍ରୀ ଗଣେଶାୟ ନମଃ</p>
        <h1 className="curtain-names">Amresh &amp; Madhusmita</h1>
        <p className="curtain-sub">You are cordially invited</p>
        <button className="hero-cta-btn curtain-btn" id="open-curtain-btn" onClick={open}>
          ✨ Open the Curtain ✨
        </button>
      </div>
    </div>
  );
}

// ── Floating Particles ──────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${6 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 8}s`,
    size: `${3 + Math.random() * 4}px`,
    opacity: 0.4 + Math.random() * 0.4,
  }));

  return (
    <div className="particles-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
}

// ── Section Fade-In Hook ────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Kesariya Flute Cover (Brahmāstra) BGM ────────────────
const KESARIYA_TRACK = {
  id: '37OFgwtS2pM',
  title: 'Kesariya — Soulful Flute Cover (Brahmāstra)',
  odiaTitle: 'କେସରିୟା (ବ୍ରହ୍ମାସ୍ତ୍ର ବଂଶୀ ଧୁନ୍)',
};

// ── Background Audio Player (Plays Kesariya Flute Only) ───
function BackgroundAudioPlayer({ playing }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    try {
      const command = playing ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    } catch (e) {
      console.warn('Audio postMessage error', e);
    }
  }, [playing]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '-9999px',
        left: '-9999px',
        width: '200px',
        height: '200px',
        opacity: 0.001,
        pointerEvents: 'none',
        zIndex: -999,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <iframe
        ref={iframeRef}
        id="kesariya-audio-frame"
        src={`https://www.youtube.com/embed/${KESARIYA_TRACK.id}?autoplay=1&enablejsapi=1&loop=1&playlist=${KESARIYA_TRACK.id}`}
        title="Kesariya Flute Cover BGM"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ width: '200px', height: '200px' }}
      />
    </div>
  );
}






// ── Hanging Diya Chains ─────────────────────────────────
function DiyaChain({ h, style }) {
  const links = [];
  for (let y = 30; y < h - 30; y += 42) links.push(y);
  return (
    <svg className="diya-chain" width="30" height={h + 30} viewBox={`0 0 30 ${h + 30}`} style={style}>
      <g fill="none" stroke="#F2A93B" strokeWidth="1.3">
        <line x1="15" y1="0" x2="15" y2={h} />
        {links.map(y => (
          <g key={y}>
            <path d={`M15 ${y - 14} Q23 ${y} 15 ${y + 14} Q7 ${y} 15 ${y - 14}Z`} fill="#4A0E2C" />
            <circle cx="15" cy={y + 22} r="1.8" fill="#F2A93B" />
          </g>
        ))}
        <path d={`M3 ${h} Q15 ${h + 20} 27 ${h} Z`} fill="#4A0E2C" />
        <path d={`M15 ${h - 2} Q10 ${h - 10} 15 ${h - 18} Q20 ${h - 10} 15 ${h - 2}Z`} fill="#F2A93B" stroke="none" />
      </g>
    </svg>
  );
}

// ── Countdown Timer ─────────────────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

// ── Navbar ──────────────────────────────────────────────
function Navbar({ playing, onToggleMusic }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a
        href="#hero"
        className="navbar-logo"
        onClick={(e) => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }); }}
        aria-label="Scroll to top"
      >
        <img src="/images/logo.png" alt="AM Wedding Crest" />
      </a>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {['Story', 'Events', 'Gallery', 'Venue'].map(item => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
          </li>
        ))}
      </ul>
      <button
        className={`music-btn ${playing ? 'playing' : ''}`}
        onClick={onToggleMusic}
        id="music-toggle-btn"
        title={playing ? 'Music is playing — Click to Pause' : 'Music is paused — Click to Play'}
      >
        <span className="music-icon">{playing ? '⏸️' : '▶️'}</span>
        {playing ? 'Pause Music' : 'Play Music'}
      </button>
      <button
        className={`nav-burger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(o => !o)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}

// ── Hero Section ────────────────────────────────────────
// Faded photo mosaic behind the hero: [photo, rowStart, colStart, rowEnd, colEnd] — mixed sizes, no gaps/overlaps
const HERO_MOSAIC = {
  d: [
    ['07', 1, 1, 3, 2], ['10', 1, 2, 2, 4], ['08', 1, 4, 3, 5], ['02', 1, 5, 2, 6],
    ['02', 2, 2, 3, 3], ['07', 2, 3, 4, 4], ['07', 2, 5, 4, 6],
    ['10', 3, 1, 4, 2], ['08', 3, 2, 4, 3], ['10', 3, 4, 4, 5],
  ],
  m: [
    ['07', 1, 1, 3, 2], ['10', 1, 2, 2, 3], ['08', 2, 2, 4, 3],
    ['02', 3, 1, 4, 2], ['10', 4, 1, 5, 3],
    ['08', 5, 1, 6, 2], ['07', 5, 2, 6, 3],
  ],
};

function HeroMandala({ className }) {
  const g = (n, f) => Array.from({ length: n }, (_, k) => f(k, (360 / n) * k));
  return (
    <div className={`hero-mandala ${className}`} aria-hidden="true">
      <svg viewBox="0 0 520 520" width="100%" height="100%">
        <defs>
          <linearGradient id={`mg-${className}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F6C770" />
            <stop offset="1" stopColor="#C9801F" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#mg-${className})`} strokeWidth="3.5" strokeLinejoin="round">
          {g(12, (k, a) => (
            <g key={`p${k}`} transform={`rotate(${a} 260 260)`}>
              <path d="M260 15 C292 50 292 95 260 130 C228 95 228 50 260 15Z" />
              <circle cx="260" cy="62" r="11" />
              <circle cx="260" cy="62" r="5" fill={`url(#mg-${className})`} />
            </g>
          ))}
          <circle cx="260" cy="260" r="128" />
          <circle cx="260" cy="260" r="120" strokeWidth="1.5" />
          {g(20, (k, a) => (
            <g key={`c${k}`} transform={`rotate(${a} 260 260)`}>
              <circle cx="260" cy="155" r="14" />
              <circle cx="260" cy="155" r="7" />
              <circle cx="260" cy="155" r="2.5" fill={`url(#mg-${className})`} />
            </g>
          ))}
          <circle cx="260" cy="260" r="88" />
          <circle cx="260" cy="260" r="74" strokeWidth="1.5" />
          {g(8, (k, a) => (
            <path key={`i${k}`} transform={`rotate(${a} 260 260)`} d="M260 196 C274 212 274 230 260 246 C246 230 246 212 260 196Z" />
          ))}
          <circle cx="260" cy="260" r="26" />
          <circle cx="260" cy="260" r="14" fill={`url(#mg-${className})`} />
        </g>
      </svg>
    </div>
  );
}

function HeroSection({ started }) {
  const [dateRevealed, setDateRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleReveal = () => {
    setDateRevealed(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const item = (d) => ({ className: 'hero-item', style: { '--d': d } });

  return (
    <section className={`hero ${started ? 'hero-in' : ''}`} id="hero">
      {showConfetti && (
        <div className="confetti-overlay">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={250}
            colors={['#C9A14A', '#E8C97A', '#FAF5EB', '#D4521E', '#C44D6F', '#4A0E2C']}
            gravity={0.25}
            recycle={false}
          />
        </div>
      )}

      {['d', 'm'].map(k => (
        <div key={k} className={`hero-tiles hero-tiles-${k}`} aria-hidden="true">
          {HERO_MOSAIC[k].map(([n, r1, c1, r2, c2], i) => (
            <div key={i} className="hero-tile-cell" style={{ gridArea: `${r1} / ${c1} / ${r2} / ${c2}` }}>
              <img className="hero-tile" src={`/images/gallery/g${n}.jpeg`} alt="" style={{ '--t': `${(i % 7) * 0.12}s` }} />
            </div>
          ))}
        </div>
      ))}

      <HeroMandala className="left" />
      <HeroMandala className="right" />
      {['tl', 'tr', 'bl', 'br'].map(pos => (
        <div key={pos} className={`hero-corner ${pos}`}><CornerOrnament className="" /></div>
      ))}

      <div className="hero-content">
        <p {...item(0)} className="hero-item hero-om">ॐ</p>
        <p {...item(1)} className="hero-item hero-odia-text">ଶ୍ରୀ ଗଣେଶାୟ ନମଃ</p>
        <p {...item(2)} className="hero-item hero-together">Together with their families</p>

        <div {...item(3)} style={{ '--d': 3, lineHeight: 1 }} className="hero-item">
          <p className="hero-names">Amresh</p>
          <p style={{ fontFamily: 'Great Vibes, cursive', fontSize: '1.8rem', color: 'var(--gold)', margin: '2px 0' }}>&amp;</p>
          <p className="hero-names">Madhusmita</p>
        </div>

        <p {...item(4)} className="hero-item hero-invite">
          joyfully invite you to celebrate their wedding
        </p>
        <p {...item(4)} className="hero-item hero-invite-odia">ଦୁଇ ଆତ୍ମା, ଏକ ସୁନ୍ଦର ଯାତ୍ରା</p>

        <div {...item(5)} className={`hero-item hero-date-block ${dateRevealed ? 'revealed' : ''}`}>
          <div className="date-inner">
            <span className="date-month">December</span>
            <div className="date-row">
              <span className="date-side">Sunday</span>
              <span className="date-day">13</span>
              <span className="date-side">At 7 PM</span>
            </div>
            <span className="date-year">2026</span>
          </div>
        </div>

        {!dateRevealed ? (
          <button {...item(6)} className="hero-item hero-cta-btn" id="reveal-date-btn" onClick={handleReveal}>
            ✨ Reveal the Date ✨
          </button>
        ) : (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.8s ease' }}>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--gold-light)', letterSpacing: '0.15em' }}>
              🎉 Save the Date! 🎉
            </p>
            <p style={{ fontFamily: 'Noto Sans Oriya, sans-serif', fontSize: '0.85rem', color: 'var(--sand)', opacity: 0.8 }}>
              ଏହି ଦିନଟି ସ୍ମରଣ ରଖନ୍ତୁ!
            </p>
          </div>
        )}

        <div {...item(7)} className="hero-item hero-venue">
          <span>📍</span>
          <span>Paradip, Odisha</span>
          <span>•</span>
          <span>ପାରାଦ୍ୱୀପ, ଓଡ଼ିଶା</span>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}

// ── Countdown Section ───────────────────────────────────
function CountdownSection() {
  const timeLeft = useCountdown('2026-12-13T19:00:00+05:30');

  const items = [
    { label: 'Days', odia: 'ଦିନ', value: timeLeft.days },
    { label: 'Hours', odia: 'ଘଣ୍ଟା', value: timeLeft.hours },
    { label: 'Minutes', odia: 'ମିନିଟ', value: timeLeft.minutes },
    { label: 'Seconds', odia: 'ସେକେଣ୍ଡ', value: timeLeft.seconds },
  ];

  return (
    <section className="section countdown-section" id="countdown">
      <div className="diya-side left">
        {[150, 100, 200].map((h, i) => <DiyaChain key={i} h={h} />)}
      </div>
      <div className="diya-side right">
        {[200, 100, 150].map((h, i) => <DiyaChain key={i} h={h} />)}
      </div>
      <div className="countdown-arch">
      <FadeIn>
        <div className="section-header">
          <span className="section-tag">ବିବାହ ଦିନ ପ୍ରତି ଗଣନା</span>
          <h2 className="section-title">Counting Down to Forever</h2>
          <p className="section-subtitle">The most beautiful day is almost here</p>
          <div className="ornamental-divider"><span>❋</span></div>
        </div>
      </FadeIn>

      <div className="countdown-grid">
        {items.map((item, i) => (
          <FadeIn key={item.label} delay={i * 0.1}>
            <div className="countdown-item">
              <span className="countdown-number">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="countdown-label">{item.label}</span>
              <span style={{ fontFamily: 'Noto Sans Oriya, sans-serif', fontSize: '0.6rem', color: 'var(--gold)', opacity: 0.6 }}>
                {item.odia}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
      </div>
    </section>
  );
}

// ── Events Section ──────────────────────────────────────
const eventsData = [
  {
    id: 'baraat',
    name: 'Baraat',
    odiaName: 'ବରଯାତ୍ରା',
    time: '7:00 PM Onwards',
    odiaTime: 'ସନ୍ଧ୍ୟା ୭ ଟା',
    icon: '🐴',
    image: '/images/baraat_watercolor.png',
    imagePos: 'center 90%',
    desc: 'The grand procession of the groom arrives in royal style on the golden shores of Paradip. Music fills the air, sparklers light the night, and the festive dance of the baraat begins against the backdrop of the Bay of Bengal.',
    odiaDesc: 'ବରଯାତ୍ରା ସମୁଦ୍ର ତଟରେ ଆସିବ। ଆଲୋକ ଓ ସଙ୍ଗୀତ ସହ ଏକ ଅବିସ୍ମରଣୀୟ ଉତ୍ସବ।',
  },
  {
    id: 'varmala',
    name: 'Varmala',
    odiaName: 'ବରମାଳ',
    time: '9:00 PM Onwards',
    odiaTime: 'ରାତ୍ରି ୯ ଟା',
    icon: '💐',
    image: '/images/varmala_new.jpeg',
    imagePos: 'center 100%',
    desc: 'As fireworks burst above the Konark Temple silhouette, Amresh and Madhusmita exchange garlands of marigold and jasmine — a timeless moment that marks the beginning of their eternal union.',
    odiaDesc: 'ଅଗ୍ନି ଆଲୋକ ଓ ଫୁଲ ଗୁଛ ସହ ବର ଓ କନ୍ୟା ଏକ ଅଭୂତପୂର୍ବ ମୁହୂର୍ତ୍ତ ଅନୁଭବ କରିବେ।',
  },
  {
    id: 'dinner',
    name: 'Gala Dinner',
    odiaName: 'ଗ୍ୟାଲା ଡିନର',
    time: '10:00 PM Onwards',
    odiaTime: 'ରାତ୍ରି ୧୦ ଟା',
    icon: '🍽️',
    image: '/images/dinner_watercolor.png',
    desc: 'Under a canopy of stars and fairy lights on the shores of Paradip, join us for a royal feast. Savor the finest Odia cuisine and coastal delicacies as the waves serenade this magical evening.',
    odiaDesc: 'ସ୍ୱର୍ଗୀୟ ଭୋଜ। ସ୍ଥାନୀୟ ଓ ରାଜକୀୟ ଖାଦ୍ୟ ସହ ଏକ ଅଦ୍ଭୁତ ଅନୁଭୂତି।',
  },
];

// ── Pillars + hanging garlands (Celebrations) ───────────
function PillarCap({ flip }) {
  const petals = [0, 1, 2, 3, 4, 5];
  return (
    <svg className="pillar-cap" viewBox="0 0 100 96" style={flip ? { transform: 'scaleY(-1)' } : undefined} aria-hidden="true">
      <g fill="#f0b8ae" stroke="#8b2a3a" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="2" y="2" width="96" height="10" rx="2" />
        <path d="M6 12 H94 L88 36 Q50 48 12 36Z" fill="#e8a39c" />
        {petals.map(k => (
          <path key={k} d={`M${14 + k * 14} 14 Q${21 + k * 14} 32 ${14 + k * 14 + 14} 14`} fill="#f6cdc4" />
        ))}
        <rect x="16" y="40" width="68" height="8" rx="3" />
        <rect x="22" y="50" width="56" height="7" rx="3" />
        <path d="M24 58 H76 L72 72 Q50 78 28 72Z" fill="#e8a39c" />
        <rect x="26" y="74" width="48" height="8" rx="3" />
        <rect x="30" y="84" width="40" height="10" rx="2" />
      </g>
    </svg>
  );
}

function ArchCorner({ side }) {
  const d = 'M0 0 H478 C436 6 396 22 360 42 C334 56 338 72 302 82 C256 92 208 98 172 114 C132 132 118 154 104 184 C90 214 66 234 58 270';
  return (
    <svg className={`arch-corner ${side}`} viewBox="0 0 500 270" aria-hidden="true">
      <defs>
        <pattern id={`ap-${side}`} width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M3 11 Q11 2 19 11 Q11 20 3 11Z M11 0 V4 M11 18 V22" fill="none" stroke="#e6a597" strokeWidth="1.2" />
        </pattern>
      </defs>
      <path d={`${d} H0 Z`} fill="#f4c6ba" />
      <path d={`${d} H0 Z`} fill={`url(#ap-${side})`} />
      <path d={d} fill="none" stroke="#d9918f" strokeWidth="13" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#8b2a3a" strokeWidth="1.6" transform="translate(7 0)" />
    </svg>
  );
}

function Pillar({ side }) {
  return (
    <div className={`pillar ${side}`} aria-hidden="true">
      <PillarCap />
      <div className="pillar-shaft" />
      <PillarCap flip />
    </div>
  );
}

function Strands({ side }) {
  const rings = Array.from({ length: 4 }, (_, i) => 20 + i * 42);
  return (
    <div className={`strands ${side}`} aria-hidden="true">
      <svg width="46" height="250" viewBox="0 0 46 250">
        <line x1="12" y1="0" x2="12" y2="208" stroke="#d9b13a" strokeWidth="1.4" />
        {rings.map(y => (
          <g key={y}>
            <circle cx="12" cy={y} r="9" fill="#f6c640" stroke="#d98b1c" strokeWidth="1.5" />
            <circle cx="12" cy={y} r="3.5" fill="#d1383a" />
            <circle cx="12" cy={y + 21} r="3" fill="#d1383a" />
          </g>
        ))}
        <path d="M12 208 V220" stroke="#d9b13a" strokeWidth="1.6" />
        <path d="M7 220 H17 L19 244 H5Z" fill="#3f8a4d" />
        <line x1="34" y1="0" x2="34" y2="216" stroke="#d1383a" strokeWidth="1.4" strokeDasharray="1 5" strokeLinecap="round" />
        {Array.from({ length: 20 }, (_, i) => (
          <circle key={i} cx="34" cy={4 + i * 10.5} r="2.6" fill={i % 3 ? '#f6c640' : '#d1383a'} />
        ))}
        <path d="M30 218 L38 218 L34 234Z" fill="#d98b1c" />
      </svg>
    </div>
  );
}

function EventsSection() {
  return (
    <section className="section events-section" id="events">
      <ArchCorner side="left" />
      <ArchCorner side="right" />
      <Pillar side="left" />
      <Pillar side="right" />
      <Strands side="left" />
      <Strands side="right" />
      <FadeIn>
        <div className="section-header">
          <span className="section-tag">ଅନୁଷ୍ଠାନ ସୂଚୀ</span>
          <h2 className="section-title">The Celebrations</h2>
          <p className="section-subtitle">An evening woven in gold, music & eternal love</p>
          <div className="ornamental-divider"><span>❋</span></div>
        </div>
      </FadeIn>

      <div className="events-grid">
        {eventsData.map((event, i) => (
          <FadeIn key={event.id} delay={i * 0.15}>
            <div className="event-card" id={`event-${event.id}`}>
              <div className="event-card-image-wrapper">
                <img
                  src={event.image}
                  alt={event.name}
                  className="event-card-image"
                  style={{ objectPosition: event.imagePos }}
                />
              </div>
              <div className="event-card-body">
                <div className="event-time-badge">
                  <span>{event.icon}</span>
                  <span>{event.time}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span style={{ fontFamily: 'Noto Sans Oriya, sans-serif' }}>{event.odiaTime}</span>
                </div>
                <h3 className="event-name">{event.name}</h3>
                <p className="event-name-odia">{event.odiaName}</p>
                <p className="event-desc">{event.desc}</p>
                <p style={{
                  fontFamily: 'Noto Sans Oriya, sans-serif',
                  fontSize: '0.8rem',
                  color: 'var(--sand)',
                  opacity: 0.65,
                  marginTop: '8px',
                  lineHeight: 1.7,
                }}>
                  {event.odiaDesc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── Story / Couple Section ───────────────────────────────
function StorySection() {
  return (
    <section className="section couple-section" id="story">
      <img className="story-hang left" src="/images/gold_hangings.png" alt="" aria-hidden="true" />
      <img className="story-hang right" src="/images/gold_hangings.png" alt="" aria-hidden="true" />
      <FadeIn>
        <div className="section-header">
          <span className="section-tag">ଆମ କଥା</span>
          <h2 className="section-title">Our Love Story</h2>
          <p className="section-subtitle">Written in the sands of Odisha, sealed with the blessings of Jagannath</p>
          <div className="ornamental-divider"><span>❋</span></div>
        </div>
      </FadeIn>

      <div className="couple-grid">
        {/* Groom */}
        <FadeIn delay={0.1}>
          <div className="couple-profile">
            <div className="couple-photo-frame">
              <img src="/images/groom.jpg" alt="Amresh - The Groom" />
            </div>
            <span className="couple-role">The Groom • ବର</span>
            <h3 className="couple-name">Amresh</h3>
            <p className="couple-name-odia">ଅମ୍ରେଶ</p>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '0.9rem',
              color: 'var(--sand)',
              opacity: 0.75,
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: '200px',
            }}>
              "Her smile is my favourite place in the world."
            </p>
          </div>
        </FadeIn>

        {/* Center */}
        <FadeIn delay={0.2}>
          <div className="couple-center">
            <span className="couple-ampersand">&amp;</span>
            <span className="couple-rings-icon">💍</span>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.7rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', opacity: 0.7 }}>
                13 · 12 · 2026
              </p>
              <p style={{ fontFamily: 'Noto Sans Oriya, sans-serif', fontSize: '0.75rem', color: 'var(--sand)', opacity: 0.6, marginTop: '4px' }}>
                ୧୩ · ୧୨ · ୨୦୨୬
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Bride */}
        <FadeIn delay={0.1}>
          <div className="couple-profile">
            <div className="couple-photo-frame">
              <img src="/images/bride.jpg" alt="Madhusmita - The Bride" />
            </div>
            <span className="couple-role">The Bride • କନ୍ୟା</span>
            <h3 className="couple-name">Madhusmita</h3>
            <p className="couple-name-odia">ମଧୁସ୍ମିତା</p>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '0.9rem',
              color: 'var(--sand)',
              opacity: 0.75,
              fontStyle: 'italic',
              textAlign: 'center',
              maxWidth: '200px',
            }}>
              "With him, every moment feels like home."
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Rings tray photo */}
      <FadeIn delay={0.3} style={{ marginTop: '60px', textAlign: 'center' }}>
        <div className="rings-frame">
          <img src="/images/rings.jpg" alt="Amresh & Madhusmita — the ring tray" />
          {[[50, 33, 16], [66, 42, 20], [62, 56, 22], [53, 63, 14], [82, 26, 18], [24, 52, 16], [38, 44, 12]].map(([x, y, size], i) => (
            <span key={i} className="sparkle" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDelay: `${i * 0.55}s` }} />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

// ── Gallery Section ──────────────────────────────────────
function GallerySection() {
  const galleryImages = [
    { src: '/images/gallery/g01.jpeg', alt: "Amresh & Madhusmita walking down a hotel corridor" },
    { src: '/images/gallery/g02.jpeg', alt: "The couple seated together" },
    { src: '/images/gallery/g03.jpeg', alt: "Kalash with mango leaves and marigold garland" },
    { src: '/images/gallery/g04.jpeg', alt: "Lord Jagannath, Balabhadra and Subhadra" },
    { src: '/images/gallery/g05.jpeg', alt: "The AM wedding crest on a sheer drape" },
    { src: '/images/gallery/g06.jpeg', alt: "The AM crest framed by flowers and palms" },
    { src: '/images/gallery/g07.jpeg', alt: "Silhouette of the couple, foreheads together" },
    { src: '/images/gallery/g08.jpeg', alt: "Madhusmita — bridal jewellery detail" },
    { src: '/images/gallery/g09.jpeg', alt: "The ring tray" },
    { src: '/images/gallery/g10.jpeg', alt: "Amresh — the groom" },
  ];

  return (
    <section className="section gallery-section" id="gallery">
      <img className="gallery-lantern left" src="/images/lantern.png" alt="" aria-hidden="true" />
      <img className="gallery-lantern right" src="/images/lantern.png" alt="" aria-hidden="true" />
      <FadeIn>
        <div className="section-header">
          <span className="section-tag">ସ୍ମୃତି ଭଣ୍ଡାର</span>
          <h2 className="section-title">Our Gallery</h2>
          <p className="section-subtitle">Moments frozen in time, memories that last forever</p>
          <div className="ornamental-divider"><span>❋</span></div>
        </div>
      </FadeIn>

      <div className="gallery-grid">
        {galleryImages.map((img, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="gallery-item" id={`gallery-item-${i}`}>
              <img src={img.src} alt={img.alt} />
              <div className="gallery-item-overlay" />
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── Venue ornaments ──────────────────────────────────────
function CornerOrnament({ className }) {
  return (
    <svg className={`corner-orn ${className}`} width="170" height="170" viewBox="0 0 170 170" aria-hidden="true">
      <g fill="none" stroke="#C9A14A" strokeWidth="2.2" strokeLinecap="round">
        <path d="M6 6 H150 M6 6 V150" />
        <path d="M18 18 H70 C90 18 96 40 82 46 C70 51 62 40 70 34" />
        <path d="M18 18 V70 C18 90 40 96 46 82 C51 70 40 62 34 70" />
        <path d="M52 52 C70 60 84 76 86 100" />
        <path d="M52 52 C60 70 76 84 100 86" />
        <path d="M110 6 C120 20 130 20 140 10 M6 110 C20 120 20 130 10 140" />
      </g>
      <g fill="#C9A14A">
        <path d="M100 18 C112 10 124 14 128 24 C116 28 106 26 100 18Z" />
        <path d="M18 100 C10 112 14 124 24 128 C28 116 26 106 18 100Z" />
        <circle cx="150" cy="6" r="4" /><circle cx="6" cy="150" r="4" /><circle cx="52" cy="52" r="4" />
      </g>
    </svg>
  );
}

// ── Venue Section ────────────────────────────────────────
function VenueSection() {
  return (
    <section className="section venue-section" id="venue">
      <img className="venue-figure groom" src="/images/groom_figure.png" alt="" aria-hidden="true" />
      <img className="venue-figure bride" src="/images/bride_figure.png" alt="" aria-hidden="true" />
      <CornerOrnament className="tl" />
      <CornerOrnament className="tr" />
      <div className="venue-arch">
        <svg className="venue-arch-cap" viewBox="0 0 600 260" preserveAspectRatio="none" aria-hidden="true">
          <path fill="#36081f" d="M45 260 V140 C45 125 62 118 70 112 C60 95 62 60 90 55 C110 52 125 66 130 78 C140 55 190 62 215 48 C250 32 280 20 300 0 C320 20 350 32 385 48 C410 62 460 55 470 78 C475 66 490 52 510 55 C538 60 540 95 530 112 C538 118 555 125 555 140 V260 Z" />
          <path fill="none" stroke="#C9A14A" strokeWidth="1.5" vectorEffect="non-scaling-stroke" d="M45 260 V140 C45 125 62 118 70 112 C60 95 62 60 90 55 C110 52 125 66 130 78 C140 55 190 62 215 48 C250 32 280 20 300 0 C320 20 350 32 385 48 C410 62 460 55 470 78 C475 66 490 52 510 55 C538 60 540 95 530 112 C538 118 555 125 555 140 V260" />
        </svg>
        <div className="venue-arch-body">
          <span className="venue-flourish bl"><CornerOrnament className="" /></span>
          <span className="venue-flourish br"><CornerOrnament className="" /></span>
      <FadeIn>
        <div className="section-header">
          <span className="section-tag">ବିବାହ ସ୍ଥଳ</span>
          <h2 className="section-title">Where Love Meets the Sea</h2>
          <p className="section-subtitle">The enchanting shores of Paradip await you</p>
          <div className="ornamental-divider"><span>❋</span></div>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="venue-card">
          <svg className="venue-emblem" viewBox="0 0 120 70" aria-hidden="true">
            <defs>
              <linearGradient id="vem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F6D98B" />
                <stop offset="1" stopColor="#B8862A" />
              </linearGradient>
            </defs>
            <g fill="none" stroke="url(#vem)" strokeWidth="2" strokeLinecap="round">
              <path d="M38 38 A22 22 0 0 1 82 38" />
              {Array.from({ length: 9 }, (_, i) => {
                const a = (-170 + i * 20) * Math.PI / 180;
                return <line key={i} x1={60 + 27 * Math.cos(a)} y1={38 + 27 * Math.sin(a)} x2={60 + 35 * Math.cos(a)} y2={38 + 35 * Math.sin(a)} />;
              })}
              <path d="M6 46 q10 -9 20 0 t20 0 t20 0 t20 0 t20 0 t14 0" />
              <path d="M14 56 q10 -9 20 0 t20 0 t20 0 t20 0 t12 0" opacity="0.75" />
              <path d="M24 66 q10 -8 20 0 t20 0 t20 0 t10 0" opacity="0.5" />
            </g>
            <circle cx="60" cy="38" r="9" fill="url(#vem)" />
          </svg>
          <h3 className="venue-name">Paradip</h3>
          <p className="venue-subname"><i>◆</i> Odisha, India <b>•</b> ଓଡ଼ିଶା, ଭାରତ <i>◆</i></p>

          <div className="venue-date">
            <p className="venue-date-label"><span /> Date <span /></p>
            <p className="venue-date-en">Sunday, 13th December 2026</p>
            <p className="venue-date-or">ରବିବାର, ୧୩ ଡିସେମ୍ବର ୨୦୨୬</p>
          </div>

          <div className="venue-cta">
            <a
              href="https://maps.google.com/?q=Paradip+Odisha"
              target="_blank"
              rel="noopener noreferrer"
              className="venue-map-link"
              id="venue-map-link"
            >
              <span>📍</span> View on Map
            </a>
          </div>
        </div>
      </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Music Toast ──────────────────────────────────────────
function MusicToast({ show, onPlay }) {
  if (!show) return null;
  return (
    <div className="music-toast" id="music-toast" onClick={onPlay} style={{ cursor: 'pointer' }}>
      <div className="music-wave">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontWeight: 600, color: 'var(--gold-light)' }}>
          🌸 Play Wedding Music 🎶
        </span>
        <span style={{ fontFamily: 'Noto Sans Oriya, sans-serif', fontSize: '0.72rem', color: 'var(--gold)' }}>
          ସଙ୍ଗୀତ ଶୁଣିବା ପାଇଁ ଏଠାରେ କ୍ଲିକ୍ କରନ୍ତୁ
        </span>
      </div>
    </div>
  );
}

// ── Footer ───────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <img className="footer-deities" src="/images/jagannath.png" alt="" aria-hidden="true" />
      <img className="footer-deities-right" src="/images/jagannath_trio.png" alt="" aria-hidden="true" />
      <div className="footer-logo">
        <img src="/images/logo.png" alt="AM Crest" />
      </div>
      <p className="footer-odia-blessing">ଜୟ ଜଗନ୍ନାଥ 🙏</p>
      <p className="footer-blessing">
        "May the blessings of Lord Jagannath and the eternal waves of the Bay of Bengal<br />
        witness this sacred union of Amresh & Madhusmita"
      </p>
      <p style={{ fontFamily: 'Noto Sans Oriya, sans-serif', fontSize: '0.85rem', color: 'var(--sand)', opacity: 0.65, marginBottom: '20px' }}>
        ଭଗବାନ ଜଗନ୍ନାଥଙ୍କ ଆଶୀର୍ବାଦ ସହ ଏହି ପବିତ୍ର ବିବାହ ସମ୍ପନ୍ନ ହେଉ
      </p>
      <div className="ornamental-divider" style={{ marginBottom: '20px' }}><span>❋</span></div>
      <p className="footer-date">13 · December · 2026 · Paradip, Odisha</p>
    </footer>
  );
}

// ── App Root ─────────────────────────────────────────────
export default function App() {
  const [playing, setPlaying] = useState(true);
  const [started, setStarted] = useState(false);
  const userManuallyPausedRef = useRef(false);

  useEffect(() => {
    // Start music on arrival; if browser autoplay policy blocks unmuted audio until user interaction,
    // trigger playback automatically on the visitor's first click, scroll, or tap.
    const handleFirstArrivalInteraction = () => {
      if (!userManuallyPausedRef.current) {
        setPlaying(true);
        const iframe = document.getElementById('kesariya-audio-frame');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
            '*'
          );
        }
      }
    };

    window.addEventListener('click', handleFirstArrivalInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstArrivalInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstArrivalInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('click', handleFirstArrivalInteraction);
      window.removeEventListener('touchstart', handleFirstArrivalInteraction);
      window.removeEventListener('scroll', handleFirstArrivalInteraction);
    };
  }, []);

  const toggleMusic = () => {
    setPlaying((prev) => {
      const next = !prev;
      userManuallyPausedRef.current = !next;
      return next;
    });
  };

  return (
    <div className="app">
      <Curtain onOpen={() => setStarted(true)} />
      <Particles />
      <Navbar playing={playing} onToggleMusic={toggleMusic} />
      <main>
        <HeroSection started={started} />
        <CountdownSection />
        <StorySection />
        <EventsSection />
        <GallerySection />
        <VenueSection />
      </main>
      <Footer />
      {/* Invisible Background Audio Player playing Kesariya Flute */}
      <BackgroundAudioPlayer playing={playing} />
    </div>
  );
}

