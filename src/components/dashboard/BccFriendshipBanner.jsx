import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

// ============================================================================
// BANGLADESH CHINA CLUB FRIENDSHIP MASCOT ANIMATION BANNER (PANDA & TIGER)
// Recreates the exact GSAP animation with interactive love hug, eye tracking,
// floating lanterns, lotus blossoms, hearts, and celebratory friendship burst.
// ============================================================================

export default function BccFriendshipBanner() {
  const containerRef = useRef(null);
  const pandaGroupRef = useRef(null);
  const tigerGroupRef = useRef(null);
  const pandaBubbleRef = useRef(null);
  const tigerBubbleRef = useRef(null);
  const pandaPupilsRef = useRef(null);
  const tigerPupilsRef = useRef(null);
  const pandaEyesNormalRef = useRef(null);
  const pandaEyesHappyRef = useRef(null);
  const tigerEyesNormalRef = useRef(null);
  const tigerEyesHappyRef = useRef(null);
  const pandaCheeksRef = useRef(null);
  const tigerCheeksRef = useRef(null);
  const particlesContainerRef = useRef(null);

  const [isHugging, setIsHugging] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // --------------------------------------------------------------------------
  // 1. FLOATING FRIENDSHIP PARTICLES ENGINE (GSAP)
  // --------------------------------------------------------------------------
  const spawnParticle = useCallback((isBurst = false) => {
    if (!particlesContainerRef.current) return;

    const particleTypes = ['heart', 'lotus', 'lantern', 'dragon', 'star'];
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];

    const el = document.createElement('div');
    el.className = 'absolute pointer-events-none select-none z-10 transition-transform';
    
    // Size & Initial Position around center (x: 48% to 52%, y: 65% to 80%)
    const startX = 400 + (Math.random() * 80 - 40);
    const startY = isBurst ? 260 + (Math.random() * 60 - 30) : 340 + Math.random() * 40;
    const endX = startX + (Math.random() * 120 - 60);
    const endY = isBurst ? 30 + Math.random() * 60 : 40 + Math.random() * 80;
    const scale = isBurst ? 0.9 + Math.random() * 0.6 : 0.7 + Math.random() * 0.5;
    const duration = isBurst ? 1.8 + Math.random() * 1.0 : 3.0 + Math.random() * 1.5;

    // Render SVG based on particle type
    if (type === 'heart') {
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff4d79">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      `;
    } else if (type === 'lotus') {
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff8da1">
          <path d="M12 2c1.2 3.5 4 6 7 7-3 1-5 3.5-5 7 0-3.5-2-6-5-7 3-1 5.8-3.5 3-7z" fill="#ff6b8b"/>
          <circle cx="12" cy="14" r="4" fill="#ffd166"/>
        </svg>
      `;
    } else if (type === 'lantern') {
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="24">
          <rect x="5" y="4" width="14" height="15" rx="7" fill="#d92b2b" stroke="#ffd700" stroke-width="1.2"/>
          <line x1="12" y1="1" x2="12" y2="4" stroke="#ffd700" stroke-width="2"/>
          <line x1="12" y1="19" x2="12" y2="23" stroke="#ffd700" stroke-width="2"/>
          <line x1="9" y1="4" x2="9" y2="19" stroke="#ff8080" stroke-width="1" opacity="0.6"/>
          <line x1="15" y1="4" x2="15" y2="19" stroke="#ff8080" stroke-width="1" opacity="0.6"/>
        </svg>
      `;
    } else if (type === 'dragon') {
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M3 14c3-4 7-1 9-4 2 3 6 0 9 4-3 3-7 1-9 4-2-3-6 0-9-4z" fill="#20b2aa" stroke="#ffd700" stroke-width="1"/>
          <circle cx="8" cy="12" r="1.5" fill="#fff"/>
        </svg>
      `;
    } else {
      el.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffd04a">
          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.8h7.6z"/>
        </svg>
      `;
    }

    particlesContainerRef.current.appendChild(el);

    gsap.set(el, {
      x: startX,
      y: startY,
      scale: 0.2,
      opacity: 0,
      rotation: Math.random() * 40 - 20
    });

    gsap.to(el, {
      x: endX,
      y: endY,
      scale: scale,
      opacity: 0.9,
      duration: duration * 0.4,
      ease: 'power1.out',
      onComplete: () => {
        gsap.to(el, {
          y: endY - 40,
          opacity: 0,
          scale: scale * 0.8,
          duration: duration * 0.6,
          ease: 'power1.in',
          onComplete: () => {
            if (el.parentNode) el.parentNode.removeChild(el);
          }
        });
      }
    });
  }, []);

  // --------------------------------------------------------------------------
  // 2. TRIGGER THE "LOVE & FRIENDSHIP HUG" INTERACTION (Matching Video 6s-10s)
  // --------------------------------------------------------------------------
  const triggerFriendshipHug = useCallback(() => {
    if (isHugging) return;
    setIsHugging(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsHugging(false);
      }
    });

    // A. Switch eyes to happy curves (^ ^) & blush cheeks
    if (pandaEyesNormalRef.current) gsap.set(pandaEyesNormalRef.current, { opacity: 0 });
    if (pandaEyesHappyRef.current) gsap.set(pandaEyesHappyRef.current, { opacity: 1 });
    if (tigerEyesNormalRef.current) gsap.set(tigerEyesNormalRef.current, { opacity: 0 });
    if (tigerEyesHappyRef.current) gsap.set(tigerEyesHappyRef.current, { opacity: 1 });

    // B. Panda and Tiger lean in towards each other with rotational cuddle
    tl.to(pandaGroupRef.current, {
      x: 48,
      y: -6,
      rotation: 8.5,
      duration: 0.8,
      ease: 'back.out(1.4)',
      transformOrigin: '200px 380px'
    }, 0);

    tl.to(tigerGroupRef.current, {
      x: -48,
      y: -6,
      rotation: -8.5,
      duration: 0.8,
      ease: 'back.out(1.4)',
      transformOrigin: '580px 380px'
    }, 0);

    // C. Cheeks glow with extra cute blushing
    tl.to([pandaCheeksRef.current, tigerCheeksRef.current], {
      scale: 1.25,
      opacity: 1,
      duration: 0.4,
      transformOrigin: 'center center'
    }, 0);

    // D. Speech Bubbles bounce excitedly
    tl.to([pandaBubbleRef.current, tigerBubbleRef.current], {
      scale: 1.15,
      y: -10,
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      transformOrigin: 'bottom center'
    }, 0);

    // E. Celebratory Burst of Particles
    for (let i = 0; i < 18; i++) {
      setTimeout(() => spawnParticle(true), i * 50);
    }

    // F. Hold the cuddly sweet pose for a moment (~1.4s)
    tl.to({}, { duration: 1.4 });

    // G. Transition to joyful upward glance (matching video frame 10s!)
    tl.add(() => {
      if (pandaEyesHappyRef.current) gsap.set(pandaEyesHappyRef.current, { opacity: 0 });
      if (tigerEyesHappyRef.current) gsap.set(tigerEyesHappyRef.current, { opacity: 0 });
      if (pandaEyesNormalRef.current) gsap.set(pandaEyesNormalRef.current, { opacity: 1 });
      if (tigerEyesNormalRef.current) gsap.set(tigerEyesNormalRef.current, { opacity: 1 });

      // Look up playfully
      gsap.to(pandaPupilsRef.current, { y: -8, x: 2, duration: 0.4 });
      gsap.to(tigerPupilsRef.current, { y: -8, x: -2, duration: 0.4 });
    });

    // H. Return gently to original idle position
    tl.to(pandaGroupRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1.0,
      ease: 'elastic.out(1, 0.75)'
    });

    tl.to(tigerGroupRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1.0,
      ease: 'elastic.out(1, 0.75)'
    }, '<');

    tl.to([pandaCheeksRef.current, tigerCheeksRef.current], {
      scale: 1,
      opacity: 0.85,
      duration: 0.8
    }, '<');

    // Return pupils to center
    tl.to([pandaPupilsRef.current, tigerPupilsRef.current], {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '+=0.3');

  }, [isHugging, spawnParticle]);

  // --------------------------------------------------------------------------
  // 3. CONTINUOUS IDLE BOBBING & FLOATING ANIMATIONS
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Gentle idle floating on Panda
    const pandaIdle = gsap.to(pandaGroupRef.current, {
      y: -8,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Slightly offset idle floating on Tiger
    const tigerIdle = gsap.to(tigerGroupRef.current, {
      y: 8,
      duration: 2.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Subtle speech bubble floating
    const pandaBubbleFloat = gsap.to(pandaBubbleRef.current, {
      y: -5,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    const tigerBubbleFloat = gsap.to(tigerBubbleRef.current, {
      y: -5,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Periodic gentle blinking (every 3.8 seconds)
    const blinkInterval = setInterval(() => {
      if (isHugging) return;
      
      // Quick cute blink
      if (pandaEyesNormalRef.current && pandaEyesHappyRef.current) {
        gsap.set(pandaEyesNormalRef.current, { opacity: 0 });
        gsap.set(pandaEyesHappyRef.current, { opacity: 1 });
        gsap.set(tigerEyesNormalRef.current, { opacity: 0 });
        gsap.set(tigerEyesHappyRef.current, { opacity: 1 });

        setTimeout(() => {
          if (!isHugging) {
            gsap.set(pandaEyesNormalRef.current, { opacity: 1 });
            gsap.set(pandaEyesHappyRef.current, { opacity: 0 });
            gsap.set(tigerEyesNormalRef.current, { opacity: 1 });
            gsap.set(tigerEyesHappyRef.current, { opacity: 0 });
          }
        }, 180);
      }
    }, 3800);

    // Continuous particle generation
    const particleInterval = setInterval(() => {
      spawnParticle(false);
    }, 550);

    // Auto-loop the Friendship Hug every 14 seconds if user doesn't click
    const autoHugTimer = setInterval(() => {
      triggerFriendshipHug();
    }, 14000);

    return () => {
      pandaIdle.kill();
      tigerIdle.kill();
      pandaBubbleFloat.kill();
      tigerBubbleFloat.kill();
      clearInterval(blinkInterval);
      clearInterval(particleInterval);
      clearInterval(autoHugTimer);
    };
  }, [isHugging, triggerFriendshipHug, spawnParticle]);

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE MOUSE TRACKING (Pupils Follow Cursor)
  // --------------------------------------------------------------------------
  const handleMouseMove = (e) => {
    if (isHugging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width; // 0..1
    const relY = (e.clientY - rect.top) / rect.height; // 0..1

    // Calculate pupil shift (range: -6px to +6px)
    const pupilShiftX = (relX - 0.5) * 14;
    const pupilShiftY = (relY - 0.5) * 10;

    gsap.to(pandaPupilsRef.current, {
      x: pupilShiftX,
      y: pupilShiftY,
      duration: 0.25,
      ease: 'power1.out'
    });

    gsap.to(tigerPupilsRef.current, {
      x: pupilShiftX,
      y: pupilShiftY,
      duration: 0.25,
      ease: 'power1.out'
    });
  };

  const handleMouseLeave = () => {
    if (isHugging) return;
    gsap.to([pandaPupilsRef.current, tigerPupilsRef.current], {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  };

  const handleClick = () => {
    setClickCount((c) => c + 1);
    triggerFriendshipHug();
  };

  return (
    <div className="w-full relative select-none overflow-hidden rounded-3xl shadow-xl border border-[#e8b04a]/40 bg-[#fde59b]">
      {/* Interactive Canvas Container */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full cursor-pointer relative aspect-[836/468] max-h-[460px] flex items-center justify-center"
        title="Click for Bangladesh-China Friendship Hug!"
      >
        {/* Floating Particle DOM Layer */}
        <div ref={particlesContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden" />

        {/* Master SVG Canvas */}
        <svg
          viewBox="0 0 836 468"
          className="w-full h-full object-contain"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Background Warm Glow */}
            <radialGradient id="bannerGlow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#fff2be" />
              <stop offset="60%" stopColor="#fde59b" />
              <stop offset="100%" stopColor="#fbdc80" />
            </radialGradient>

            {/* Bubble Drop Shadow */}
            <filter id="bubbleShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#8c7028" floodOpacity="0.18" />
            </filter>

            {/* Red Collar Drop Shadow */}
            <filter id="collarShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* 1. Backdrop */}
          <rect width="836" height="468" fill="url(#bannerGlow)" rx="24" />

          {/* ================================================================ */}
          {/* 2. PANDA CHARACTER (Representing China · Wearing Bangladesh Collar) */}
          {/* ================================================================ */}
          <g ref={pandaGroupRef} id="pandaGroup">
            {/* Ears */}
            <circle cx="100" cy="118" r="44" fill="#181818" />
            <circle cx="300" cy="118" r="44" fill="#181818" />

            {/* Big Round White Head */}
            <circle cx="200" cy="250" r="142" fill="#ffffff" />

            {/* Blush Cheeks */}
            <g ref={pandaCheeksRef} opacity="0.85">
              <ellipse cx="112" cy="275" rx="19" ry="16" fill="#ffb8c4" />
              <ellipse cx="288" cy="275" rx="19" ry="16" fill="#ffb8c4" />
            </g>

            {/* Black Eye Patches */}
            <ellipse
              cx="140"
              cy="225"
              rx="37"
              ry="48"
              fill="#181818"
              transform="rotate(14 140 225)"
            />
            <ellipse
              cx="260"
              cy="225"
              rx="37"
              ry="48"
              fill="#181818"
              transform="rotate(-14 260 225)"
            />

            {/* Panda Normal Eyes (With Pupils) */}
            <g ref={pandaEyesNormalRef} id="pandaEyesNormal">
              {/* White Sclera */}
              <circle cx="148" cy="223" r="16" fill="#ffffff" />
              <circle cx="252" cy="223" r="16" fill="#ffffff" />

              {/* Dynamic Interactive Pupils */}
              <g ref={pandaPupilsRef}>
                <circle cx="151" cy="223" r="9.5" fill="#111111" />
                <circle cx="153" cy="220" r="3.2" fill="#ffffff" />

                <circle cx="249" cy="223" r="9.5" fill="#111111" />
                <circle cx="251" cy="220" r="3.2" fill="#ffffff" />
              </g>
            </g>

            {/* Panda Happy Curved Eyes (^ ^) for Blink & Hug */}
            <g ref={pandaEyesHappyRef} id="pandaEyesHappy" opacity="0">
              <path
                d="M 130 226 Q 146 208 162 226"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M 238 226 Q 254 208 270 226"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </g>

            {/* Black Nose */}
            <path
              d="M 191 262 Q 200 256 209 262 Q 200 274 191 262 Z"
              fill="#181818"
            />

            {/* Cute Smile Mouth */}
            <path
              d="M 200 269 L 200 282"
              stroke="#181818"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <path
              d="M 166 280 Q 183 298 200 282 Q 217 298 234 280"
              fill="none"
              stroke="#181818"
              strokeWidth="4.2"
              strokeLinecap="round"
            />

            {/* Bangladesh Flag Green Collar with Red Circle */}
            <g filter="url(#collarShadow)">
              <path
                d="M 72 334 Q 200 378 328 334 L 338 392 Q 200 442 62 392 Z"
                fill="#01855d"
              />
              <circle cx="200" cy="397" r="19" fill="#ef2a3e" />
            </g>
          </g>

          {/* ================================================================ */}
          {/* 3. PANDA SPEECH BUBBLE: "স্বাগতম!"                                */}
          {/* ================================================================ */}
          <g ref={pandaBubbleRef} filter="url(#bubbleShadow)">
            <rect x="152" y="24" width="84" height="42" rx="14" fill="#ffffff" />
            <polygon points="188,66 195,78 202,66" fill="#ffffff" />
            <text
              x="194"
              y="52"
              textAnchor="middle"
              className="font-serif font-bold select-none pointer-events-none"
              fill="#10231c"
              fontSize="16"
            >
              স্বাগতম!
            </text>
          </g>

          {/* ================================================================ */}
          {/* 4. TIGER CHARACTER (Representing BD · Wearing China Red Collar)     */}
          {/* ================================================================ */}
          <g ref={tigerGroupRef} id="tigerGroup">
            {/* Outer & Inner Ears */}
            <circle cx="482" cy="120" r="44" fill="#fe992d" />
            <circle cx="482" cy="120" r="25" fill="#3a1b09" />

            <circle cx="678" cy="120" r="44" fill="#fe992d" />
            <circle cx="678" cy="120" r="25" fill="#3a1b09" />

            {/* Big Round Orange Head */}
            <circle cx="580" cy="250" r="142" fill="#fe992d" />

            {/* Forehead Tiger Stripes (3 Vertical Stripes) */}
            <path d="M 552 110 L 560 162 L 546 162 Z" fill="#3a1b09" />
            <path d="M 577 105 L 585 165 L 573 165 Z" fill="#3a1b09" />
            <path d="M 605 110 L 615 162 L 601 162 Z" fill="#3a1b09" />

            {/* Cheek Stripes (2 on Left, 2 on Right) */}
            <path d="M 432 216 L 490 228 L 432 233 Z" fill="#3a1b09" />
            <path d="M 428 256 L 494 266 L 428 272 Z" fill="#3a1b09" />

            <path d="M 728 216 L 670 228 L 728 233 Z" fill="#3a1b09" />
            <path d="M 732 256 L 666 266 L 732 272 Z" fill="#3a1b09" />

            {/* Cream Snout / Muzzle */}
            <ellipse cx="580" cy="285" rx="84" ry="62" fill="#fff5e4" />

            {/* Tiger Normal Eyes (With Pupils) */}
            <g ref={tigerEyesNormalRef} id="tigerEyesNormal">
              <circle cx="524" cy="223" r="16" fill="#ffffff" />
              <circle cx="636" cy="223" r="16" fill="#ffffff" />

              {/* Dynamic Interactive Pupils */}
              <g ref={tigerPupilsRef}>
                <circle cx="521" cy="223" r="9.5" fill="#111111" />
                <circle cx="523" cy="220" r="3.2" fill="#ffffff" />

                <circle cx="633" cy="223" r="9.5" fill="#111111" />
                <circle cx="635" cy="220" r="3.2" fill="#ffffff" />
              </g>
            </g>

            {/* Tiger Happy Curved Eyes (^ ^) for Blink & Hug */}
            <g ref={tigerEyesHappyRef} id="tigerEyesHappy" opacity="0">
              <path
                d="M 506 226 Q 522 208 538 226"
                fill="none"
                stroke="#3a1b09"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M 622 226 Q 638 208 654 226"
                fill="none"
                stroke="#3a1b09"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </g>

            {/* Pink Nose */}
            <path
              d="M 569 257 Q 580 249 591 257 Q 580 274 569 257 Z"
              fill="#df5469"
            />

            {/* Cute Smile Mouth */}
            <path
              d="M 580 270 L 580 282"
              stroke="#3a1b09"
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <path
              d="M 546 280 Q 563 298 580 282 Q 597 298 614 280"
              fill="none"
              stroke="#3a1b09"
              strokeWidth="4.2"
              strokeLinecap="round"
            />

            {/* 3 Cute Whiskers on Each Side */}
            <line x1="510" y1="282" x2="440" y2="280" stroke="#3a1b09" strokeWidth="3" strokeLinecap="round" />
            <line x1="510" y1="290" x2="442" y2="295" stroke="#3a1b09" strokeWidth="3" strokeLinecap="round" />
            <line x1="510" y1="298" x2="446" y2="310" stroke="#3a1b09" strokeWidth="3" strokeLinecap="round" />

            <line x1="650" y1="282" x2="720" y2="280" stroke="#3a1b09" strokeWidth="3" strokeLinecap="round" />
            <line x1="650" y1="290" x2="718" y2="295" stroke="#3a1b09" strokeWidth="3" strokeLinecap="round" />
            <line x1="650" y1="298" x2="714" y2="310" stroke="#3a1b09" strokeWidth="3" strokeLinecap="round" />

            {/* China Flag Crimson Collar with Gold Star */}
            <g filter="url(#collarShadow)">
              <path
                d="M 452 334 Q 580 378 708 334 L 718 392 Q 580 442 442 392 Z"
                fill="#e3242c"
              />
              {/* 5-pointed Gold Star */}
              <polygon
                points="580,380 585,394 600,394 588,403 592,417 580,409 568,417 572,403 560,394 575,394"
                fill="#ffd04a"
              />
            </g>
          </g>

          {/* ================================================================ */}
          {/* 5. TIGER SPEECH BUBBLE: "欢迎!"                                    */}
          {/* ================================================================ */}
          <g ref={tigerBubbleRef} filter="url(#bubbleShadow)">
            <rect x="548" y="24" width="70" height="42" rx="14" fill="#ffffff" />
            <polygon points="576,66 583,78 590,66" fill="#ffffff" />
            <text
              x="583"
              y="52"
              textAnchor="middle"
              className="font-serif font-bold select-none pointer-events-none"
              fill="#10231c"
              fontSize="17"
            >
              欢迎!
            </text>
          </g>
        </svg>

        {/* Interactive Click Prompt Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#e8b04a]/60 text-[11px] font-medium text-[#4a3508] shadow-xs flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <span>💖</span>
          <span>বন্ধুত্বের আলিঙ্গনের জন্য ক্লিক করুন · Click to Hug</span>
        </div>
      </div>
    </div>
  );
}
