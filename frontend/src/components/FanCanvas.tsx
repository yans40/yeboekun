import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FamilyData, FamilyTreeLayout, CardPosition } from '../types';
import { GenealogyCard } from './GenealogyCard';
import { ConnectionLayer } from './ConnectionLayer';

interface FanCanvasProps {
  familyData: FamilyData | null;
  layout: FamilyTreeLayout | null;
  loading: boolean;
  onPersonSelect: (personId: number) => void;
  onPersonEdit: (personId: number) => void;
}

const ZOOM_MIN = 0.3;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.15;

export const FanCanvas: React.FC<FanCanvasProps> = ({
  familyData,
  layout,
  loading,
  onPersonSelect,
  onPersonEdit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; panX: number; panY: number }>({
    active: false, startX: 0, startY: 0, panX: 0, panY: 0,
  });

  // Centre la vue sur la personne centrale quand le layout change
  useEffect(() => {
    if (!layout || !containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const newPanX = clientWidth / 2 - layout.centralX * zoom - 100;
    const newPanY = clientHeight / 2 - layout.centralY * zoom - 90;
    setPan({ x: newPanX, y: newPanY });
  }, [layout]); // intentionally omit zoom to not re-center on every zoom change

  const resetView = useCallback(() => {
    if (!layout || !containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setZoom(1);
    setPan({
      x: clientWidth / 2 - layout.centralX - 100,
      y: clientHeight / 2 - layout.centralY - 90,
    });
  }, [layout]);

  // ── Mouse drag ──────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    setPan({ x: d.panX + (e.clientX - d.startX), y: d.panY + (e.clientY - d.startY) });
  }, []);

  const onMouseUp = useCallback(() => { dragRef.current.active = false; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  // ── Wheel zoom ──────────────────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom(prev => {
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev + delta));
      const scale = next / prev;
      setPan(p => ({
        x: cursorX - (cursorX - p.x) * scale,
        y: cursorY - (cursorY - p.y) * scale,
      }));
      return next;
    });
  }, []);

  // ── Build connection maps from layout + familyData ──────────────────────────
  const parentChildMap = new Map<number, number[]>();
  const childParentMap = new Map<number, number[]>();
  let centralPersonId = 0;

  if (familyData && layout) {
    centralPersonId = familyData.person.id;
    // Central person's parents
    if (familyData.parents.length > 0) {
      const parentIds = familyData.parents.map(p => p.id);
      const posSet = new Set(layout.positions.map(p => p.personId));
      const visibleParents = parentIds.filter(id => posSet.has(id));
      if (visibleParents.length > 0) {
        parentChildMap.set(centralPersonId, visibleParents);
      }
    }
    // Central person's children
    if (familyData.children.length > 0) {
      childParentMap.set(centralPersonId, familyData.children.map(c => c.id));
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#F7F9FC',
    cursor: dragRef.current.active ? 'grabbing' : 'grab',
  };

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    width: 3000,
    height: 3000,
    transformOrigin: '0 0',
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    willChange: 'transform',
  };

  const zoomBtnBase: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: '1px solid #E5E7EB',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'background 150ms',
  };

  return (
    <div ref={containerRef} style={containerStyle} onMouseDown={onMouseDown} onWheel={onWheel}>
      {/* Virtual canvas */}
      <div style={canvasStyle}>
        {layout && familyData && (
          <>
            <ConnectionLayer
              positions={layout.positions}
              centralPersonId={centralPersonId}
              parentChildMap={parentChildMap}
              childParentMap={childParentMap}
            />
            {layout.positions.map((pos: CardPosition) => {
              const person = [
                familyData.person,
                ...familyData.parents,
                ...familyData.siblings,
                ...familyData.children,
              ].find(p => p.id === pos.personId);
              if (!person) return null;
              return (
                <GenealogyCard
                  key={pos.personId}
                  person={person}
                  x={pos.x}
                  y={pos.y}
                  isCentral={pos.isCentral}
                  isChild={pos.isChild}
                  isSibling={pos.isSibling}
                  onPersonClick={onPersonSelect}
                  onPersonEdit={onPersonEdit}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Welcome placeholder */}
      {!layout && !loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌳</div>
            <div style={{ fontSize: 16 }}>Sélectionnez une personne pour explorer l'arbre</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(247,249,252,0.8)',
        }}>
          <div style={{ color: '#6B7280', fontSize: 15 }}>Chargement…</div>
        </div>
      )}

      {/* Zoom controls */}
      <div style={{
        position: 'absolute', bottom: 20, right: 20,
        display: 'flex', flexDirection: 'column', gap: 6, zIndex: 50,
      }}>
        <button style={zoomBtnBase} onClick={() => setZoom(z => Math.min(ZOOM_MAX, z + ZOOM_STEP))} title="Zoom +">+</button>
        <button style={zoomBtnBase} onClick={() => setZoom(z => Math.max(ZOOM_MIN, z - ZOOM_STEP))} title="Zoom −">−</button>
        <button style={zoomBtnBase} onClick={resetView} title="Recentrer">⌂</button>
      </div>
    </div>
  );
};

export default FanCanvas;
