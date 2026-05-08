/**
 * AtelierView — vue split layout pour la création et l'édition de personnes (Lot 4).
 *
 * Layout : panneau gauche fixe (liste des personnes) + panneau droit (PersonForm inline).
 *
 * Responsabilités :
 *   1. Charger et maintenir sa propre liste de personnes (indépendant du context global).
 *   2. Exposer un composant interne PersonList (facilement extensible : search, filtres).
 *   3. Déléguer le rendu du formulaire à PersonForm en mode inline.
 *   4. Appeler apiService directement pour CRUD — pas de dépendance sur AppShell.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import PersonForm from '../components/PersonForm';
import { colors, fonts, spacing } from '../theme/tokens';
import type { CreatePersonDto, Person, UpdatePersonDto } from '../types';

// ── Détection viewport mobile (< 768 px) ──────────────────────────────────────
// Même pattern que TopBar — hook local, pas de dépendance MUI useMediaQuery.
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

// ── Largeur du panneau gauche ─────────────────────────────────────────────────
const LEFT_PANEL_WIDTH = 260;

// ─────────────────────────────────────────────────────────────────────────────
// Composant interne : PersonList
// Extracté pour faciliter l'ajout futur d'une search-bar ou de filtres
// sans toucher AtelierView.
// ─────────────────────────────────────────────────────────────────────────────

interface PersonListProps {
  persons: Person[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
}

const PersonList: React.FC<PersonListProps> = ({ persons, selectedId, onSelect, onNew }) => {
  const { t } = useTranslation();

  // Tri alphabétique par lastName (puis firstName si égalité)
  const sorted = [...persons].sort((a, b) => {
    const byLast = a.lastName.localeCompare(b.lastName, 'fr');
    if (byLast !== 0) return byLast;
    return a.firstName.localeCompare(b.firstName, 'fr');
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* En-tête sticky */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: colors.cream,
        padding: `${spacing[3]}px ${spacing[3]}px ${spacing[2]}px`,
        borderBottom: `1px solid ${colors.line2}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[2],
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: fonts.serif,
          fontSize: 16,
          fontWeight: 600,
          color: colors.ink,
          whiteSpace: 'nowrap',
        }}>
          {t('atelier.title')}
        </span>
        <button
          onClick={onNew}
          aria-label={t('atelier.new_person')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: `${spacing[1]}px ${spacing[2]}px`,
            fontFamily: fonts.sans,
            fontSize: 12,
            fontWeight: 500,
            color: colors.ocean,
            border: `1px solid ${colors.ocean}`,
            borderRadius: 4,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            lineHeight: 1.5,
          }}
        >
          {t('atelier.new_person')}
        </button>
      </div>

      {/* Liste défilable */}
      <ul role="list" style={{ overflowY: 'auto', flex: 1, listStyle: 'none', margin: 0, padding: 0 }}>
        {sorted.map(p => {
          const isActive = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                onClick={() => onSelect(p.id)}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: `10px ${spacing[4]}px`,
                  fontFamily: fonts.sans,
                  fontSize: 14,
                  color: isActive ? colors.ink : colors.ink2,
                  backgroundColor: isActive ? colors.paper2 : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? colors.ink : 'transparent'}`,
                  cursor: 'pointer',
                  lineHeight: 1.4,
                  transition: 'background-color 120ms ease',
                }}
              >
                {p.firstName} {p.lastName}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AtelierView
// ─────────────────────────────────────────────────────────────────────────────

export default function AtelierView() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // ── State local (indépendant de FamilyTreeContext) ─────────────────────────
  const [persons, setPersons] = useState<Person[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  // Onglet actif sur mobile : 'list' | 'form'
  const [mobileTab, setMobileTab] = useState<'list' | 'form'>('list');

  // ── Chargement initial de la liste ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);
    apiService.getPersons()
      .then(data => { if (!cancelled) setPersons(data); })
      .finally(() => { if (!cancelled) setLoadingList(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Personne sélectionnée ──────────────────────────────────────────────────
  const selectedPerson = persons.find(p => p.id === localSelectedId) ?? null;

  // ── Handlers CRUD ──────────────────────────────────────────────────────────

  const handleCreate = useCallback(async (
    dto: CreatePersonDto | UpdatePersonDto,
    parentIds?: number[],
  ): Promise<void> => {
    const created = await apiService.createPerson(dto as CreatePersonDto);
    if (parentIds && parentIds.length > 0) {
      await Promise.all(
        parentIds.map(pid => apiService.addParentChildRelationship(pid, created.id)),
      );
    }
    setPersons(prev => [...prev, created]);
    setIsCreating(false);
    setLocalSelectedId(created.id);
  }, []);

  const handleUpdate = useCallback(async (
    dto: CreatePersonDto | UpdatePersonDto,
  ): Promise<void> => {
    if (localSelectedId === null) return;
    await apiService.updatePerson(localSelectedId, dto as UpdatePersonDto);
    // Actualiser la liste locale — re-fetch la personne pour avoir le fullName à jour
    const updated = await apiService.getPersonById(localSelectedId);
    setPersons(prev => prev.map(p => p.id === localSelectedId ? updated : p));
  }, [localSelectedId]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (localSelectedId === null) return;
    await apiService.deletePerson(localSelectedId);
    setPersons(prev => prev.filter(p => p.id !== localSelectedId));
    setLocalSelectedId(null);
  }, [localSelectedId]);

  // ── Sélection dans la liste gauche ─────────────────────────────────────────
  const handleSelect = (id: number) => {
    setIsCreating(false);
    setLocalSelectedId(id);
    // Sur mobile, basculer vers l'onglet formulaire après sélection
    if (isMobile) setMobileTab('form');
  };

  // ── Bouton "+ Nouvelle personne" ───────────────────────────────────────────
  const handleNew = () => {
    setLocalSelectedId(null);
    setIsCreating(true);
    // Sur mobile, basculer vers l'onglet formulaire
    if (isMobile) setMobileTab('form');
  };

  // ── Contenu du panneau droit (partagé desktop/mobile) ─────────────────────
  const rightPanel = (
    <div style={{
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.paper,
    }}>
      {/* Aucune sélection, pas en mode création */}
      {!isCreating && localSelectedId === null && (
        <div
          data-testid="atelier-no-selection"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <span style={{
            fontFamily: fonts.serif,
            fontStyle: 'italic',
            fontSize: 22,
            color: colors.ink3,
          }}>
            {t('atelier.no_selection')}
          </span>
          <span style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            color: colors.ink4,
          }}>
            {t('atelier.no_selection_hint')}
          </span>
        </div>
      )}

      {/* Formulaire d'édition */}
      {!isCreating && selectedPerson !== null && (
        <PersonForm
          inline
          open={true}
          person={selectedPerson}
          persons={persons}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setLocalSelectedId(null)}
          onSaved={() => { /* no-op : rester sur la personne éditée après save */ }}
          title={`${selectedPerson.firstName} ${selectedPerson.lastName}`}
        />
      )}

      {/* Formulaire de création */}
      {isCreating && (
        <PersonForm
          inline
          open={true}
          persons={persons}
          onSubmit={handleCreate}
          onClose={() => setIsCreating(false)}
          title={t('atelier.title') + ' — ' + t('atelier.new_person').replace('+ ', '')}
        />
      )}
    </div>
  );

  // ── Contenu du panneau gauche (partagé desktop/mobile) ────────────────────
  const leftPanel = loadingList ? (
    <div style={{
      padding: spacing[4],
      fontFamily: fonts.mono,
      fontSize: 12,
      color: colors.ink4,
    }}>
      {t('common.loading')}
    </div>
  ) : (
    <PersonList
      persons={persons}
      selectedId={isCreating ? null : localSelectedId}
      onSelect={handleSelect}
      onNew={handleNew}
    />
  );

  // ── Rendu ──────────────────────────────────────────────────────────────────

  // Layout mobile : barre d'onglets + contenu plein écran
  if (isMobile) {
    return (
      <div
        data-testid="atelier-view"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Barre d'onglets native */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            borderBottom: `1px solid ${colors.line2}`,
            backgroundColor: colors.cream,
            flexShrink: 0,
          }}
        >
          {(['list', 'form'] as const).map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={mobileTab === tab}
              onClick={() => setMobileTab(tab)}
              style={{
                flex: 1,
                padding: '12px 0',
                fontFamily: fonts.sans,
                fontSize: 13,
                fontWeight: mobileTab === tab ? 500 : 400,
                color: mobileTab === tab ? colors.ink : colors.ink3,
                background: 'transparent',
                border: 'none',
                borderBottom: mobileTab === tab ? `2px solid ${colors.ink}` : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab === 'list' ? t('atelier.tab_list') : t('atelier.tab_form')}
            </button>
          ))}
        </div>

        {/* Contenu plein écran selon l'onglet actif */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: colors.cream }}>
          {mobileTab === 'list' && leftPanel}
          {mobileTab === 'form' && rightPanel}
        </div>
      </div>
    );
  }

  // Layout desktop : split horizontal
  return (
    <div
      data-testid="atelier-view"
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* ── Panneau gauche ─────────────────────────────────────────────────── */}
      <div style={{
        width: LEFT_PANEL_WIDTH,
        flexShrink: 0,
        borderRight: `1px solid ${colors.line2}`,
        backgroundColor: colors.cream,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {leftPanel}
      </div>

      {/* ── Panneau droit ──────────────────────────────────────────────────── */}
      {rightPanel}
    </div>
  );
}
