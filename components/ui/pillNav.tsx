'use client';

import React, { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PillNavItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface PillNavProps<T extends string = string> {
  items: PillNavItem<T>[];
  active: T;
  onChange: (id: T) => void;
  /** GSAP ease string. Default: 'power3.easeOut' */
  ease?: string;
  /** Background of the outer rounded container */
  baseColor?: string;
  /** Default fill of each pill button */
  pillColor?: string;
  /** Active pill fill */
  activePillColor?: string;
  /** Active pill border */
  activePillBorder?: string;
  /** Circle fill color that floods in on hover */
  circleFillColor?: string;
  /** Default label color */
  pillTextColor?: string;
  /** Label color rendered on top of the flooding circle */
  hoveredPillTextColor?: string;
  /** Active label color */
  activeLabelColor?: string;
  /** Active dot color shown below the active pill */
  activeDotColor?: string;
  /** Height of the nav bar in px. Default: 42 */
  navHeight?: number;
  /** Horizontal padding inside each pill in px. Default: 16 */
  pillPaddingX?: number;
  /** Gap between pills in px. Default: 3 */
  pillGap?: number;
  className?: string;
}

// ─── Internal timeline shape (avoids importing gsap types at top-level) ───────
type GsapTimeline = {
  tweenTo: (t: number, vars: object) => { kill: () => void };
  duration: () => number;
  kill: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PillNav<T extends string = string>({
  items,
  active,
  onChange,
  ease = 'power3.easeOut',
  baseColor = 'rgba(255,255,255,0.06)',
  pillColor = 'rgba(255,255,255,0.10)',
  activePillColor = 'rgba(139,92,246,0.25)',
  activePillBorder = '1px solid rgba(139,92,246,0.35)',
  circleFillColor = 'rgba(139,92,246,0.5)',
  pillTextColor = 'rgba(255,255,255,0.45)',
  hoveredPillTextColor = '#ffffff',
  activeLabelColor = '#c4b5fd',
  activeDotColor = '#a78bfa',
  navHeight = 42,
  pillPaddingX = 16,
  pillGap = 3,
  className = '',
}: PillNavProps<T>) {
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<GsapTimeline | null>>([]);
  const activeTweenRefs = useRef<Array<{ kill: () => void } | null>>([]);
  const navItemsRef = useRef<HTMLDivElement | null>(null);

  // ── GSAP setup (dynamic import keeps this client-only / SSR-safe) ──────────
  useEffect(() => {
    const initGsap = async () => {
      const { gsap } = await import('gsap');

      const layout = () => {
        circleRefs.current.forEach((circle, index) => {
          if (!circle?.parentElement) return;

          const pill = circle.parentElement as HTMLElement;
          const { width: w, height: h } = pill.getBoundingClientRect();
          if (w === 0 || h === 0) return;

          // ReactBits original geometry: inscribed-circle radius that just
          // covers the pill width, positioned so it "floods" up from the bottom.
          const R = ((w * w) / 4 + h * h) / (2 * h);
          const D = Math.ceil(2 * R) + 2;
          const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
          const originY = D - delta;

          circle.style.width = `${D}px`;
          circle.style.height = `${D}px`;
          circle.style.bottom = `-${delta}px`;

          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`,
          });

          const label = pill.querySelector<HTMLElement>('.pill-label');
          const labelHover = pill.querySelector<HTMLElement>('.pill-label-hover');

          if (label) gsap.set(label, { y: 0 });
          if (labelHover) gsap.set(labelHover, { y: h + 12, opacity: 0 });

          // Kill old timeline, build a fresh one paused at t=0
          tlRefs.current[index]?.kill();
          const tl = gsap.timeline({ paused: true });

          tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

          if (label) {
            tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
          }

          if (labelHover) {
            gsap.set(labelHover, { y: Math.ceil(h + 100), opacity: 0 });
            tl.to(labelHover, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
          }

          tlRefs.current[index] = tl as unknown as GsapTimeline;
        });
      };

      layout();

      // Entrance animation: pill bar expands from 0 → auto width
      const navItems = navItemsRef.current;
      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, { width: 'auto', duration: 0.6, ease });
      }

      const onResize = () => layout();
      window.addEventListener('resize', onResize);
      if (document.fonts) document.fonts.ready.then(layout).catch(() => {});

      return () => window.removeEventListener('resize', onResize);
    };

    const cleanup = initGsap();
    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, [items, ease]);

  // ── Hover handlers ────────────────────────────────────────────────────────
  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    });
  };

  // ── CSS custom-property map (mirrors ReactBits original pattern) ──────────
  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': pillTextColor,
    '--nav-h': `${navHeight}px`,
    '--pill-pad-x': `${pillPaddingX}px`,
    '--pill-gap': `${pillGap}px`,
  } as React.CSSProperties;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <nav aria-label="Tab navigation" style={cssVars} className={className}>
      <div
        ref={navItemsRef}
        className="relative flex items-center rounded-full"
        style={{ height: 'var(--nav-h)', background: 'var(--base)' }}
      >
        <ul
          role="tablist"
          className="list-none flex items-stretch m-0 p-[3px] h-full"
          style={{ gap: 'var(--pill-gap)' }}
        >
          {items.map((item, i) => {
            const isActive = active === item.id;
            const isDisabled = !!item.disabled;

            const pillStyle: React.CSSProperties = {
              background: isActive ? activePillColor : 'var(--pill-bg)',
              color: 'var(--pill-text)',
              paddingLeft: 'var(--pill-pad-x)',
              paddingRight: 'var(--pill-pad-x)',
              border: isActive ? activePillBorder : '1px solid transparent',
              opacity: isDisabled ? 0.35 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              pointerEvents: isDisabled ? 'none' : 'auto',
            };

            return (
              <li key={item.id} role="none" className="flex h-full">
                <button
                  role="tab"
                  aria-selected={isActive}
                  aria-disabled={isDisabled}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onChange(item.id)}
                  onMouseEnter={() => !isDisabled && handleEnter(i)}
                  onMouseLeave={() => !isDisabled && handleLeave(i)}
                  className="relative overflow-hidden inline-flex items-center justify-center gap-1.5 h-full rounded-full font-semibold text-[13px] leading-none tracking-[0.1px] whitespace-nowrap select-none transition-colors duration-200"
                  style={pillStyle}
                >
                  {/* ── GSAP flood circle (ReactBits geometry) ── */}
                  <span
                    className="absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{ background: circleFillColor, willChange: 'transform' }}
                    aria-hidden="true"
                    ref={(el) => { circleRefs.current[i] = el; }}
                  />

                  {/* ── Optional icon ── */}
                  {item.icon && (
                    <span className="relative z-[2] w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center">
                      {item.icon}
                    </span>
                  )}

                  {/* ── Label stack: scrolls up on hover, duplicate rises in ── */}
                  <span
                    className="label-stack relative z-[2] inline-block leading-none overflow-hidden"
                    style={{ height: '1.1em' }}
                  >
                    <span
                      className="pill-label relative z-[2] inline-block leading-none"
                      style={{
                        willChange: 'transform',
                        color: isActive ? activeLabelColor : 'var(--pill-text)',
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block leading-none"
                      style={{ color: 'var(--hover-text)', willChange: 'transform, opacity' }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>

                  {/* ── Active dot ── */}
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 w-2 h-2 rounded-full z-[4]"
                      style={{ background: activeDotColor }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}