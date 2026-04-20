import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Person } from '../types';

interface AppSidebarProps {
  persons: Person[];
  selectedPersonId: number | null;
  onPersonSelect: (personId: number) => void;
  onAddPerson: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  ancestorCount?: number;
  generationDepth?: number;
  canEdit?: boolean;
  onEnterEditMode?: () => void;
  onExitEditMode?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  persons,
  selectedPersonId,
  onPersonSelect,
  onAddPerson,
  collapsed,
  onToggleCollapse,
  ancestorCount,
  generationDepth,
  canEdit = false,
  onEnterEditMode,
  onExitEditMode,
}) => {
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ferme le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sidebarStyle: React.CSSProperties = {
    width: collapsed ? 72 : 240,
    minWidth: collapsed ? 72 : 240,
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 200ms ease, min-width 200ms ease',
    flexShrink: 0,
    zIndex: 100,
  };

  const logoSectionStyle: React.CSSProperties = {
    padding: collapsed ? '20px 16px' : '20px 16px 20px 20px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'space-between',
    gap: 8,
    flexShrink: 0,
  };

  const collapseBtnStyle: React.CSSProperties = {
    width: 28,
    height: 28,
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    cursor: 'pointer',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transform: collapsed ? 'rotate(180deg)' : 'none',
    transition: 'transform 200ms',
    padding: 0,
    color: '#6B7280',
  };

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: collapsed ? '10px 0' : '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    backgroundColor: active ? '#EEF2FF' : 'transparent',
    color: active ? '#3B82F6' : '#4B5563',
    fontWeight: active ? 600 : 400,
    fontSize: 14,
    justifyContent: collapsed ? 'center' : 'flex-start',
    transition: 'background 150ms',
    userSelect: 'none',
    margin: '0 8px',
  });

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '0 20px',
    marginBottom: 6,
  };

  const filteredPersons = search.trim()
    ? persons.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()))
    : persons;

  const selectedPerson = persons.find(p => p.id === selectedPersonId);

  const handleSearchSelect = (person: Person) => {
    onPersonSelect(person.id);
    setSearch('');
    setDropdownOpen(false);
  };

  const addBtnStyle: React.CSSProperties = {
    width: collapsed ? 40 : 'calc(100% - 32px)',
    height: 36,
    backgroundColor: '#3B82F6',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    margin: collapsed ? '0 auto' : '0 16px',
    transition: 'background 150ms',
    flexShrink: 0,
  };

  const editModeBtnStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    color: canEdit ? '#DC2626' : '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 10px',
  };

  return (
    <div style={sidebarStyle}>
      {/* Logo */}
      <div style={logoSectionStyle}>
        {!collapsed && (
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap' }}>
            🌳 GegeDot
          </span>
        )}
        {collapsed && <span style={{ fontSize: 20 }}>🌳</span>}
        <button style={collapseBtnStyle} onClick={onToggleCollapse} title={collapsed ? 'Développer' : 'Réduire'}>
          ‹
        </button>
      </div>

      {/* Navigation */}
      <div style={{ padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div style={navItemStyle(true)}>
          <span style={{ fontSize: 16 }}>🌲</span>
          {!collapsed && <span>Vue éventail</span>}
        </div>
        <div style={navItemStyle(false)}>
          <span style={{ fontSize: 16 }}>📋</span>
          {!collapsed && <span>Liste</span>}
        </div>
      </div>

      {/* Person selector */}
      <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
        {!collapsed && (
          <>
            <div style={sectionLabelStyle}>Choisir une personne</div>

            {/* Personne sélectionnée */}
            {selectedPerson && (
              <div style={{
                fontSize: 13,
                color: '#1F2937',
                backgroundColor: '#EEF2FF',
                borderRadius: 8,
                padding: '6px 10px',
                marginBottom: 8,
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>{selectedPerson.fullName}</span>
                <span
                  style={{ cursor: 'pointer', color: '#9CA3AF', fontSize: 16, lineHeight: 1 }}
                  onClick={() => onPersonSelect(selectedPerson.id)}
                  title="Désélectionner"
                >
                  ×
                </span>
              </div>
            )}

            {/* Autocomplete */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => { setSearch(e.target.value); setDropdownOpen(true); }}
                onFocus={() => setDropdownOpen(true)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#1F2937',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {dropdownOpen && filteredPersons.length > 0 && ReactDOM.createPortal(
                <div style={{
                  position: 'fixed',
                  top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom : 0,
                  left: inputRef.current ? inputRef.current.getBoundingClientRect().left : 0,
                  width: inputRef.current ? inputRef.current.getBoundingClientRect().width : 200,
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  maxHeight: 220,
                  overflowY: 'auto',
                  zIndex: 9999,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }}>
                  {filteredPersons.map(p => (
                    <div
                      key={p.id}
                      onMouseDown={() => handleSearchSelect(p)}
                      style={{
                        padding: '8px 10px',
                        fontSize: 13,
                        color: p.id === selectedPersonId ? '#3B82F6' : '#1F2937',
                        backgroundColor: p.id === selectedPersonId ? '#EEF2FF' : 'transparent',
                        cursor: 'pointer',
                        fontWeight: p.id === selectedPersonId ? 600 : 400,
                        borderBottom: '1px solid #F3F4F6',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#F9FAFB'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = p.id === selectedPersonId ? '#EEF2FF' : 'transparent'; }}
                    >
                      {p.fullName}
                    </div>
                  ))}
                </div>,
                document.body
              )}
              {dropdownOpen && search.trim() && filteredPersons.length === 0 && ReactDOM.createPortal(
                <div style={{
                  position: 'fixed',
                  top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom : 0,
                  left: inputRef.current ? inputRef.current.getBoundingClientRect().left : 0,
                  width: inputRef.current ? inputRef.current.getBoundingClientRect().width : 200,
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  padding: '8px 10px',
                  fontSize: 13,
                  color: '#9CA3AF',
                  zIndex: 9999,
                }}>
                  Aucun résultat
                </div>,
                document.body
              )}
            </div>
          </>
        )}
        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', fontSize: 20 }}>👤</div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Ancestral info (expanded only) */}
      {!collapsed && ancestorCount !== undefined && generationDepth !== undefined && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Ancestral Info
          </div>
          <div style={{ fontSize: 13, color: '#4B5563' }}>
            {ancestorCount} ancêtre{ancestorCount !== 1 ? 's' : ''} • {generationDepth} génération{generationDepth !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Add person button (admin only) */}
      {canEdit && (
        <div style={{ padding: '12px 0 0', flexShrink: 0 }}>
          <button style={addBtnStyle} onClick={onAddPerson}>
            <span>+</span>
            {!collapsed && <span>Ajouter</span>}
          </button>
        </div>
      )}

      {/* Edit mode toggle button */}
      <div style={{ padding: canEdit ? '8px 0 16px' : '12px 0 16px', flexShrink: 0, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : 16 }}>
        <button
          onClick={() => (canEdit ? onExitEditMode?.() : onEnterEditMode?.())}
          title={canEdit ? 'Quitter le mode édition' : 'Mode édition'}
          style={editModeBtnStyle}
        >
          <span>{canEdit ? '🔓' : '🔒'}</span>
          {!collapsed && <span>{canEdit ? 'Quitter édition' : 'Mode édition'}</span>}
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
