import React from 'react';
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
}) => {
  const sidebarStyle: React.CSSProperties = {
    width: collapsed ? 72 : 240,
    minWidth: collapsed ? 72 : 240,
    height: '100vh',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 200ms ease, min-width 200ms ease',
    overflow: 'hidden',
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

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    fontSize: 13,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
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
            <select
              style={selectStyle}
              value={selectedPersonId ?? ''}
              onChange={e => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) onPersonSelect(val);
              }}
            >
              <option value="">— Sélectionner —</option>
              {persons.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
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

      {/* Add person button */}
      <div style={{ padding: '12px 0 16px', flexShrink: 0 }}>
        <button style={addBtnStyle} onClick={onAddPerson}>
          <span>+</span>
          {!collapsed && <span>Ajouter</span>}
        </button>
      </div>
    </div>
  );
};

export default AppSidebar;
