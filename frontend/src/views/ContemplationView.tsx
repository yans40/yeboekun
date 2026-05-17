/**
 * ContemplationView — wrapper pour la vue éventail SVG (Lot 3, spec v4 hybride).
 *
 * Responsabilités :
 *   1. Lire selectedPersonId depuis FamilyTreeContext.
 *   2. Gérer egoId local : l'ego affiché dans l'éventail (peut diverger de selectedPersonId
 *      quand l'utilisateur utilise "Faire d'elle le centre").
 *   3. Déclencher usePersonTree(egoId, { up:5, down:2 }).
 *   4. Gérer les états loading / error / no-selection.
 *   5. Panneau de détail (slide-in droite) + focus-bar (fil d'ariane) — spec v4 hybride.
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';
import { usePersonTree } from '../hooks/usePersonTree';
import FanCanvasV2 from '../components/FanCanvasV2';
import { colors, fonts } from '../theme/tokens';
import type { PersonTreeNodeDto } from '../types';

export default function ContemplationView() {
  const { t } = useTranslation();
  const { selectedPersonId } = useFamilyTreeContext();

  // ── État local v4 hybride ─────────────────────────────────────────────────
  /**
   * egoId : la personne actuellement au centre de l'éventail.
   * Initialisé à selectedPersonId, peut changer via "Faire d'elle le centre".
   * Remis à selectedPersonId si selectedPersonId change depuis la TopBar.
   */
  const [egoId, setEgoId] = useState<number | null>(selectedPersonId);

  /**
   * selectedNode : le nœud dont le panneau de détail est ouvert.
   * null = panneau fermé.
   */
  const [selectedNode, setSelectedNode] = useState<PersonTreeNodeDto | null>(null);

  // Quand la personne sélectionnée change depuis la TopBar → réinitialiser l'éventail
  useEffect(() => {
    setEgoId(selectedPersonId);
    setSelectedNode(null);
  }, [selectedPersonId]);

  const { data, loading, error } = usePersonTree(egoId, { up: 5, down: 2 });

  // ── Nom de l'ego courant (pour la focus-bar et le bouton retour) ──────────
  const egoNode = data?.nodes.find(n => n.id === egoId);
  const egoName = egoNode
    ? [egoNode.firstName, egoNode.lastName].filter(Boolean).join(' ')
    : '';

  // Nom de la personne d'origine (selectedPersonId) pour le bouton "Retour à…"
  // On le mémorise au premier chargement : si data correspond à selectedPersonId
  // on peut l'extraire, sinon on garde une valeur stable via un ref-like pattern.
  // Ici on cherche dans les nodes actuels ; au pire c'est vide et le bouton
  // affiche "← Retour" sans prénom — acceptable.
  const originalPersonNode = data?.nodes.find(n => n.id === selectedPersonId);
  const originalFirstName = originalPersonNode?.firstName ?? '';

  // La focus-bar est active quand egoId diverge de selectedPersonId
  const hasFocus = egoId !== null && selectedPersonId !== null && egoId !== selectedPersonId;

  // ── Aucune personne sélectionnée ──────────────────────────────────────────
  if (selectedPersonId === null) {
    return (
      <div
        data-testid="contemplation-no-selection"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
          gap: 12,
        }}
      >
        <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 22, color: colors.ink3 }}>
          {t('contemplation.no_selection')}
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.ink4 }}>
          {t('contemplation.no_selection_hint')}
        </span>
      </div>
    );
  }

  // ── Chargement ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        data-testid="contemplation-loading"
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

  // ── Erreur ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        data-testid="contemplation-error"
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

  // ── Données absentes ──────────────────────────────────────────────────────
  if (!data) return null;

  // ── Rendu principal ───────────────────────────────────────────────────────
  // Décalage du panneau quand la focus-bar est active : +56px (hauteur focus-bar)
  const panelTopBase = 32;
  const panelTop = hasFocus ? panelTopBase + 56 : panelTopBase;

  return (
    <div
      data-testid="contemplation-view"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: colors.paper,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Focus-bar (fil d'ariane) ────────────────────────────────────── */}
      {/*
       * Hauteur animée 0 → 56px via max-height + overflow:hidden.
       * On utilise max-height plutôt que height pour éviter un layout shift
       * visible avant l'animation CSS (height:0 est immédiat, max-height laisse
       * le navigateur interpoler proprement).
       */}
      <div
        data-testid="contemplation-focus-bar"
        aria-live="polite"
        style={{
          flexShrink: 0,
          overflow: 'hidden',
          maxHeight: hasFocus ? 56 : 0,
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: colors.ink,
          color: colors.cream,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 32px',
            height: 56,
          }}
        >
          <span
            style={{
              fontFamily: fonts.serif,
              fontStyle: 'italic',
              fontSize: 17,
              color: colors.line,
              letterSpacing: '-0.005em',
            }}
          >
            {'Tu vois le monde de '}
            <strong style={{ color: colors.cream, fontWeight: 500 }}>{egoName}</strong>
          </span>
          <span style={{ flex: 1 }} />
          <button
            data-testid="contemplation-return-btn"
            onClick={() => {
              setEgoId(selectedPersonId);
              setSelectedNode(null);
            }}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.asc2}`,
              color: colors.cream,
              padding: '8px 16px',
              fontFamily: fonts.mono,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = colors.asc1; (e.currentTarget as HTMLButtonElement).style.borderColor = colors.sepia; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = colors.asc2; }}
          >
            {`← Retour à ${originalFirstName}`}
          </button>
        </div>
      </div>

      {/* ── Éventail ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <FanCanvasV2
          data={data}
          onSectorClick={setSelectedNode}
          selectedNodeId={selectedNode?.id}
        />

        {/* ── Panneau de détail ──────────────────────────────────────── */}
        {/*
         * Slide-in depuis la droite : translateX(400px) → translateX(0).
         * top est géré via la variable panelTop (réagit à hasFocus).
         * On ne gère pas le `top` via la classe `has-focus` du prototype HTML
         * (pas de CSS global) — on calcule directement en inline style.
         */}
        <aside
          data-testid="contemplation-detail-panel"
          role="dialog"
          aria-label="Fiche personne"
          aria-live="polite"
          style={{
            position: 'absolute',
            top: panelTop,
            right: 32,
            width: 320,
            backgroundColor: colors.ink,
            color: colors.cream,
            padding: '32px 32px 24px',
            border: `1px solid ${colors.ink2}`,
            zIndex: 10,
            // Slide-in : visible si selectedNode !== null
            transform: selectedNode ? 'translateX(0)' : 'translateX(360px)',
            opacity: selectedNode ? 1 : 0,
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s, top 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            // pointer-events off quand invisible pour ne pas bloquer les clics sur l'éventail
            pointerEvents: selectedNode ? 'auto' : 'none',
          }}
        >
          {selectedNode && (
            <>
              {/* Bouton fermer */}
              <button
                aria-label="Fermer le panneau"
                onClick={() => setSelectedNode(null)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  background: 'transparent',
                  border: 'none',
                  color: colors.cream,
                  fontFamily: fonts.mono,
                  fontSize: 14,
                  cursor: 'pointer',
                  opacity: 0.6,
                  padding: 6,
                  lineHeight: 1,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.6'; }}
              >
                ×
              </button>

              {/* Tag génération */}
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: colors.asc5,
                  marginBottom: 8,
                }}
              >
                {selectedNode.generation < 0
                  ? `ASCENDANT · GÉN ${Math.abs(selectedNode.generation)}`
                  : selectedNode.generation > 0
                    ? `DESCENDANT · GÉN ${selectedNode.generation}`
                    : 'EGO'}
              </div>

              {/* Nom */}
              <div
                style={{
                  fontFamily: fonts.serif,
                  fontStyle: 'italic',
                  fontWeight: 500,
                  fontSize: 28,
                  lineHeight: 1.1,
                  letterSpacing: '-0.015em',
                  color: colors.cream,
                  marginBottom: 10,
                }}
              >
                {[selectedNode.firstName, selectedNode.lastName].filter(Boolean).join(' ') || '?'}
              </div>

              {/* Dates */}
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  color: colors.line,
                  marginBottom: 24,
                }}
              >
                {(() => {
                  const b = selectedNode.birthDate ? selectedNode.birthDate.slice(0, 4) : null;
                  const d = selectedNode.deathDate ? selectedNode.deathDate.slice(0, 4) : null;
                  if (!b && !d) return '—';
                  if (b && d) return `${b} – ${d}`;
                  if (b) return `${b} —`;
                  return `† ${d}`;
                })()}
              </div>

              {/* Bouton recentrer — masqué si c'est déjà l'ego courant */}
              {selectedNode.id !== egoId && (
                <button
                  data-testid="contemplation-recenter-btn"
                  onClick={() => {
                    if (selectedNode) {
                      setEgoId(selectedNode.id);
                      setSelectedNode(null);
                    }
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 16px',
                    backgroundColor: colors.sepia,
                    color: colors.cream,
                    border: 'none',
                    fontFamily: fonts.mono,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    textAlign: 'left',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.asc4; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.sepia; }}
                >
                  {'Faire d\'elle le centre'}
                  <span
                    style={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: 'serif',
                      fontSize: 18,
                    }}
                  >
                    →
                  </span>
                </button>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
