import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../theme/tokens';
import { fetchPersons } from '../services/api';
import type { Person } from '../types';

interface WelcomeViewProps {
  onEnter: (personId: number | null) => void;
}

interface NameItem {
  person: Person;
  initX: number;
  initY: number;
  size: number;
}

function getRelationHint(person: Person, t: (k: string) => string): string {
  if (person.deathDate) return t('welcome.relation_ancestor');
  const birthYear = person.birthDate ? new Date(person.birthDate).getFullYear() : null;
  if (birthYear && birthYear > 2000) return t('welcome.relation_child');
  return t('welcome.relation_relative');
}

export default function WelcomeView({ onEnter }: WelcomeViewProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const posRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);
  const elRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeRef = useRef(0);

  const [nameItems, setNameItems] = useState<NameItem[]>([]);
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none)').matches;

  useEffect(() => {
    fetchPersons()
      .then(persons => {
        if (!containerRef.current || !persons.length) return;
        const W = containerRef.current.clientWidth || window.innerWidth;
        const H = containerRef.current.clientHeight || window.innerHeight;
        const cx = W / 2;
        const cy = H / 2;

        const items: NameItem[] = persons.slice(0, 60).map((person) => {
          let x = 0, y = 0, attempts = 0;
          do {
            x = 40 + Math.random() * (W - 160);
            y = 40 + Math.random() * (H - 80);
            attempts++;
          } while (Math.abs(x - cx) < 180 && Math.abs(y - cy) < 90 && attempts < 25);
          return {
            person,
            initX: x,
            initY: y,
            size: 12 + Math.floor(Math.random() * 7),
          };
        });

        posRef.current = items.map(item => {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.008 + Math.random() * 0.012;
          return { x: item.initX, y: item.initY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
        });

        setNameItems(items);
      })
      .catch(() => {});
  }, []);

  // rAF loop — skipped for reduced-motion and touch devices
  useEffect(() => {
    if (!nameItems.length || prefersReduced || noHover) return;

    const loop = (timestamp: number) => {
      timeRef.current = timestamp;
      const container = containerRef.current;
      if (!container) return;
      const W = container.clientWidth;
      const H = container.clientHeight;
      const { x: mx, y: my } = mouseRef.current;

      posRef.current.forEach((p, i) => {
        const el = elRefs.current[i];
        if (!el) return;

        p.x += p.vx;
        p.y += p.vy;

        const elW = el.offsetWidth || 80;
        const elH = el.offsetHeight || 20;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x + elW > W) { p.x = W - elW; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y + elH > H) { p.y = H - elH; p.vy = -Math.abs(p.vy); }

        const dx = p.x + elW / 2 - mx;
        const dy = p.y + elH / 2 - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 120);

        // Ambient oscillation when mouse is far
        const ambient = 0.08 * Math.sin(timestamp * 0.0007 + i * 0.9);
        const opacity = 0.22 + ambient + proximity * 0.78;
        const clampedOpacity = Math.min(1, Math.max(0.1, opacity));

        el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
        el.style.opacity = clampedOpacity.toFixed(2);
        el.style.color = proximity > 0.45 ? colors.ink : colors.ink4;
        el.style.fontWeight = proximity > 0.45 ? '500' : '400';
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [nameItems, prefersReduced, noHover]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleNameClick = useCallback((person: Person, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePerson(person);
    setMenuPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMenuAction = useCallback((personId: number) => {
    setActivePerson(null);
    setMenuPos(null);
    onEnter(personId);
  }, [onEnter]);

  // Mobile: dense tag-cloud grid
  if (noHover) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colors.paper }}>
        {/* Header fixe */}
        <div style={{ padding: '48px 24px 24px', textAlign: 'center', flexShrink: 0 }}>
          <p style={{ fontFamily: fonts.serif, fontSize: '1.4rem', fontWeight: 500, color: colors.ink, margin: '0 0 6px' }}>
            {t('welcome.title')}
          </p>
          <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.ink3, margin: 0 }}>
            {t('welcome.hint_move')}
          </p>
        </div>

        {/* Nuage scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', justifyContent: 'center' }}>
            {nameItems.map(({ person, size }, i) => {
              const opacity = 0.35 + ((i * 7 + 3) % 10) * 0.065;
              const fontSize = size;
              return (
                <button
                  key={person.id}
                  onClick={e => handleNameClick(person, e)}
                  style={{
                    fontFamily: fonts.serif,
                    fontStyle: 'italic',
                    fontSize,
                    color: colors.ink4,
                    opacity,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '3px 5px',
                    lineHeight: 1.3,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {person.firstName} {person.lastName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skip fixe en bas */}
        <div style={{ padding: '16px 24px 32px', textAlign: 'center', flexShrink: 0 }}>
          <button
            onClick={() => onEnter(null)}
            style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.ink4, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {t('welcome.skip')}
          </button>
        </div>

        {activePerson && menuPos && (
          <MiniMenu
            person={activePerson}
            pos={menuPos}
            relationHint={getRelationHint(activePerson, t)}
            onAction={() => handleMenuAction(activePerson.id)}
            onClose={() => { setActivePerson(null); setMenuPos(null); }}
            t={t}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => { setActivePerson(null); setMenuPos(null); }}
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: colors.paper, cursor: 'default' }}
    >
      {nameItems.map(({ person, initX, initY, size }, i) => (
        <div
          key={person.id}
          ref={el => { elRefs.current[i] = el; }}
          role="button"
          tabIndex={0}
          aria-label={`${person.firstName} ${person.lastName}`}
          onClick={e => handleNameClick(person, e)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNameClick(person, e as unknown as React.MouseEvent); } }}
          style={{
            position: 'absolute',
            transform: `translate(${initX}px, ${initY}px)`,
            fontFamily: fonts.serif,
            fontStyle: 'italic',
            fontSize: size,
            color: colors.ink4,
            opacity: 0.22,
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            outline: 'none',
            border: 'none',
            background: 'none',
            padding: 0,
            transition: prefersReduced ? 'none' : 'color 200ms',
          }}
        >
          {person.firstName} {person.lastName}
        </div>
      ))}

      {/* Titre central */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          padding: '0 20px',
        }}
      >
        <p style={{ fontFamily: fonts.serif, fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 500, color: colors.ink, margin: 0, lineHeight: 1.3 }}>
          {t('welcome.title')}
        </p>
        <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.ink3, marginTop: 10, marginBottom: 0 }}>
          {t('welcome.hint_move')}
        </p>
      </div>

      {/* Skip */}
      <button
        onClick={e => { e.stopPropagation(); onEnter(null); }}
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: fonts.sans,
          fontSize: 12,
          color: colors.ink4,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
          zIndex: 10,
          whiteSpace: 'nowrap',
        }}
      >
        {t('welcome.skip')}
      </button>

      {/* Mini-menu */}
      {activePerson && menuPos && (
        <MiniMenu
          person={activePerson}
          pos={menuPos}
          relationHint={getRelationHint(activePerson, t)}
          onAction={() => handleMenuAction(activePerson.id)}
          onClose={() => { setActivePerson(null); setMenuPos(null); }}
          t={t}
        />
      )}
    </div>
  );
}

interface MiniMenuProps {
  person: Person;
  pos: { x: number; y: number };
  relationHint: string;
  onAction: () => void;
  onClose: () => void;
  t: (k: string) => string;
}

function MiniMenu({ person, pos, relationHint, onAction, onClose, t }: MiniMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', esc); };
  }, [onClose]);

  // Clamp horizontally so menu stays in viewport
  const left = Math.min(pos.x, window.innerWidth - 208);
  const top = Math.min(pos.y + 8, window.innerHeight - 120);

  return (
    <div
      ref={menuRef}
      role="menu"
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed',
        top,
        left,
        zIndex: 200,
        backgroundColor: colors.cream,
        border: `1px solid ${colors.line2}`,
        borderRadius: 4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        padding: '4px 0',
        minWidth: 200,
      }}
    >
      <div style={{ padding: '6px 14px 6px', fontFamily: fonts.mono, fontSize: 10, color: colors.ink4, letterSpacing: '0.04em', display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span>{person.firstName} {person.lastName}</span>
        <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 11, color: colors.ink3 }}>{relationHint}</span>
      </div>
      {[
        { key: 'its_me', label: t('welcome.action_its_me') },
        { key: 'see_tree', label: t('welcome.action_see_tree') },
      ].map(({ key, label }) => (
        <button
          key={key}
          role="menuitem"
          onClick={onAction}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '8px 16px',
            fontFamily: fonts.sans,
            fontSize: 13,
            color: colors.ink,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.paper2; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
