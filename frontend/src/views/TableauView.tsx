/**
 * TableauView — dashboard chiffres clés de l'arbre familial (Lot 5).
 *
 * Responsabilités :
 *   1. Charger GET /api/stats via useStats (mock DEV si backend absent).
 *   2. Afficher 4 StatCards : Personnes, Vivantes, Générations, Complétude.
 *   3. Afficher DuplicateAlert si duplicateSuggestionCount > 0.
 *   4. Afficher RecentCard : 5 dernières personnes consultées (localStorage).
 *   5. Synchroniser useRecentPersons avec selectedPersonId du context.
 *
 * Remplace le PlaceholderView sur /tableau quand VUE_TABLEAU_ENABLED=true.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { colors, fonts, radius, shadows, spacing } from '../theme/tokens';
import { useStats } from '../hooks/useStats';
import { useRecentPersons } from '../hooks/useRecentPersons';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';

// ── Icônes SVG inline ─────────────────────────────────────────────────────────
// Inlinées pour éviter une dépendance externe et conserver le contrôle du rendu.

/** Icône groupe de silhouettes (personnes). */
function IconPersons({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9"  cy="7"  r="3" fill={color} />
      <circle cx="15" cy="7"  r="3" fill={color} opacity=".6" />
      <path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M15 14c1.5 0 5 .75 5 4" stroke={color} strokeWidth="1.5" fill="none" opacity=".6" />
    </svg>
  );
}

/** Icône cœur (vivantes). */
function IconHeart({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.81 3.81 12 4C12.19 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14.5 12 21 12 21Z"
        fill={color}
        opacity=".85"
      />
    </svg>
  );
}

/** Icône flèche bidirectionnelle verticale (générations). */
function IconGenerations({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L8 7h3v10H8l4 4 4-4h-3V7h3L12 3Z" fill={color} />
    </svg>
  );
}

/** Icône checkmark (complétude). */
function IconCheck({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path d="M7.5 12l3 3 5.5-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string | null;
  label: string;
  sublabel?: string;
  /** Couleur d'accentuation de l'icône. Défaut : colors.sepia. */
  accent?: string;
}

function StatCard({ icon, value, label, sublabel, accent = colors.sepia }: StatCardProps) {
  void accent; // accent est utilisé par l'icône parente, conservé pour API complète
  const displayValue = value === null ? '—' : String(value);

  return (
    <div
      data-testid="stat-card"
      style={{
        backgroundColor: colors.cream,
        border: `1px solid ${colors.line2}`,
        borderRadius: radius.md,
        padding: '20px 24px',
        minWidth: 140,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        boxShadow: shadows.xs,
      }}
    >
      {/* Icône */}
      <div style={{ marginBottom: spacing[1] }}>{icon}</div>

      {/* Grand chiffre */}
      <span
        style={{
          fontFamily: fonts.serif,
          fontStyle: 'italic',
          fontSize: 36,
          lineHeight: 1,
          color: colors.ink,
        }}
      >
        {displayValue}
      </span>

      {/* Label */}
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: colors.ink3,
        }}
      >
        {label}
      </span>

      {/* Sous-label optionnel */}
      {sublabel && (
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            color: colors.ink4,
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
}

// ── DuplicateAlert ────────────────────────────────────────────────────────────

interface DuplicateAlertProps {
  count: number;
  ctaLabel: string;
  label: string;
}

function DuplicateAlert({ count, label, ctaLabel }: DuplicateAlertProps) {
  return (
    <div
      data-testid="duplicate-alert"
      role="alert"
      style={{
        backgroundColor: '#fefce8', // jaune très clair, cohérent sépia sans token gold
        border: `1px solid ${colors.gold}`,
        borderRadius: radius.md,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
      }}
    >
      {/* Icône avertissement */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3L2 20h20L12 3Z" fill={colors.gold} opacity=".3" stroke={colors.gold} strokeWidth="1.5" />
        <path d="M12 10v4" stroke={colors.sepia} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1" fill={colors.sepia} />
      </svg>

      <span style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.ink2, flex: 1 }}>
        {label.replace('{{count}}', String(count))}
      </span>

      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.sepia,
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        {ctaLabel}
      </span>
    </div>
  );
}

// ── RecentCard ────────────────────────────────────────────────────────────────

interface RecentCardProps {
  persons: Array<{ id: number; firstName: string; lastName: string; timestamp: number }>;
  onSelect: (id: number) => void;
  emptyLabel: string;
  title: string;
}

function RecentCard({ persons, onSelect, emptyLabel, title }: RecentCardProps) {
  return (
    <div
      data-testid="recent-card"
      style={{
        backgroundColor: colors.cream,
        border: `1px solid ${colors.line2}`,
        borderRadius: radius.md,
        padding: '20px 24px',
        boxShadow: shadows.xs,
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: colors.ink3,
          display: 'block',
          marginBottom: spacing[3],
        }}
      >
        {title}
      </span>

      {persons.length === 0 ? (
        <span
          data-testid="recent-empty"
          style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.ink4, fontStyle: 'italic' }}
        >
          {emptyLabel}
        </span>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
          {persons.map(p => (
            <li key={p.id}>
              <button
                data-testid="recent-item"
                onClick={() => onSelect(p.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: fonts.sans,
                  fontSize: 13,
                  color: colors.ink2,
                  padding: '4px 0',
                  textAlign: 'left',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                {/* Bullet sépia */}
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: colors.sepiaLt,
                    flexShrink: 0,
                  }}
                />
                {p.firstName} {p.lastName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── TableauView ───────────────────────────────────────────────────────────────

export default function TableauView() {
  const { t }                       = useTranslation();
  const navigate                    = useNavigate();
  const { data, loading, error }    = useStats();
  const { persons, selectedPersonId, onPersonSelect } = useFamilyTreeContext();
  const { recentPersons, addRecentPerson }            = useRecentPersons();

  // Synchronisation : chaque fois que selectedPersonId change et qu'on trouve
  // la personne dans la liste, on l'ajoute à l'historique récent.
  useEffect(() => {
    if (selectedPersonId === null) return;
    const found = persons.find(p => p.id === selectedPersonId);
    if (!found) return;
    addRecentPerson({ id: found.id, firstName: found.firstName, lastName: found.lastName });
  }, [selectedPersonId, persons, addRecentPerson]);

  /** Date du jour formatée en français. */
  const todayFormatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  }).format(new Date());

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        data-testid="tableau-loading"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.ink4 }}>
          {t('common.loading')}
        </span>
      </div>
    );
  }

  // ── Erreur ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        data-testid="tableau-error"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.rust }}>
          {t('common.error')} — {error}
        </span>
      </div>
    );
  }

  // ── Pas de données (ne devrait pas arriver si loading=false et error=null) ─
  if (!data) return null;

  // ── Rendu principal ────────────────────────────────────────────────────────

  const showDuplicateAlert =
    data.duplicateSuggestionCount !== null && data.duplicateSuggestionCount > 0;

  /** Navigue vers l'arbre après avoir sélectionné la personne. */
  function handleSelectRecent(id: number) {
    onPersonSelect(id);
    navigate('/');
  }

  return (
    <div
      data-testid="tableau-view"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        padding: 28,
        overflowY: 'auto',
        height: '100%',
        backgroundColor: colors.paper,
        // Aligner le contenu en haut (les cellules de grille ne doivent pas
        // s'étirer sur toute la hauteur disponible).
        alignContent: 'start',
      }}
    >
      {/* ── En-tête : occupe toute la largeur ─────────────────────────────── */}
      <div
        data-testid="tableau-header"
        style={{
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[1],
          marginBottom: spacing[2],
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: fonts.serif,
            fontStyle: 'italic',
            fontSize: 24,
            color: colors.ink,
          }}
        >
          {t('tableau.title')}
        </h1>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            color: colors.ink4,
            textTransform: 'capitalize',
          }}
        >
          {todayFormatted}
        </span>
      </div>

      {/* ── StatCard : Personnes ───────────────────────────────────────────── */}
      <StatCard
        icon={<IconPersons color={colors.sepia} />}
        value={data.personCount}
        label={t('tableau.stat_persons')}
        accent={colors.sepia}
      />

      {/* ── StatCard : Vivantes ────────────────────────────────────────────── */}
      <StatCard
        icon={<IconHeart color={colors.ocean} />}
        value={data.livingCount}
        label={t('tableau.stat_living')}
        accent={colors.ocean}
      />

      {/* ── StatCard : Générations ─────────────────────────────────────────── */}
      <StatCard
        icon={<IconGenerations color={colors.olive} />}
        value={data.generationSpan}
        label={t('tableau.stat_generations')}
        accent={colors.olive}
      />

      {/* ── StatCard : Complétude ──────────────────────────────────────────── */}
      <StatCard
        icon={<IconCheck color={colors.forest} />}
        value={data.completenessPercent != null ? `${data.completenessPercent}%` : null}
        label={t('tableau.stat_completeness')}
        accent={colors.forest}
      />

      {/* ── DuplicateAlert si besoin (pleine largeur) ──────────────────────── */}
      {showDuplicateAlert && (
        <div style={{ gridColumn: '1 / -1' }}>
          <DuplicateAlert
            count={data.duplicateSuggestionCount as number}
            label={t('tableau.duplicate_alert', { count: data.duplicateSuggestionCount })}
            ctaLabel={t('tableau.duplicate_cta')}
          />
        </div>
      )}

      {/* ── RecentCard (pleine largeur) ────────────────────────────────────── */}
      <div style={{ gridColumn: '1 / -1' }}>
        <RecentCard
          persons={recentPersons}
          onSelect={handleSelectRecent}
          emptyLabel={t('tableau.recent_empty')}
          title={t('tableau.recent_title')}
        />
      </div>
    </div>
  );
}
