import React from 'react';
import { CardPosition, SpousePair } from '../types';
import { CARD_WIDTH, CARD_HEIGHT, CHILD_CARD_WIDTH } from '../utils/familyTreeLayout';

interface ConnectionLayerProps {
  positions: CardPosition[];
  centralPersonId: number;
  /** childId → parentIds (ancestors) */
  parentChildMap: Map<number, number[]>;
  /** parentId → childIds (descendants of central person) */
  childParentMap: Map<number, number[]>;
  /** Réservé pour usage futur (affichage conjoint) */
  spousePairs: SpousePair[];
}

interface LineProps {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

function Line({ x, y, w, h, color }: LineProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: color,
        pointerEvents: 'none',
      }}
    />
  );
}

export const ConnectionLayer: React.FC<ConnectionLayerProps> = ({
  positions,
  parentChildMap,
  childParentMap,
}) => {
  const posMap = new Map<number, CardPosition>(positions.map(p => [p.personId, p]));

  const lines: LineProps[] = [];
  const ancestorColor = '#D1D5DB';
  const childColor = '#9CA3AF';

  // ── Ancestor connections (child → parents) ─────────────────────────────────
  parentChildMap.forEach((parentIds, childId) => {
    const childPos = posMap.get(childId);
    if (!childPos) return;

    const parentPositions = parentIds
      .map(pid => posMap.get(pid))
      .filter((p): p is CardPosition => p !== undefined);
    if (parentPositions.length === 0) return;

    const childCenterX = childPos.x + CARD_WIDTH / 2;
    const childTopY = childPos.y;

    const parentBottomYs = parentPositions.map(p => p.y + CARD_HEIGHT);
    const parentCenterXs = parentPositions.map(p => p.x + CARD_WIDTH / 2);
    const maxParentBottomY = Math.max(...parentBottomYs);
    const minParentCenterX = Math.min(...parentCenterXs);
    const maxParentCenterX = Math.max(...parentCenterXs);
    const midX = (minParentCenterX + maxParentCenterX) / 2;
    const connectionY = maxParentBottomY + 20;

    // Horizontal bar between parents
    if (parentPositions.length > 1) {
      lines.push({
        x: minParentCenterX,
        y: connectionY,
        w: maxParentCenterX - minParentCenterX,
        h: 2,
        color: ancestorColor,
      });
    }

    // Vertical from each parent bottom → connectionY
    parentPositions.forEach(p => {
      const px = p.x + CARD_WIDTH / 2;
      const py = p.y + CARD_HEIGHT;
      lines.push({ x: px - 1, y: py, w: 2, h: connectionY - py, color: ancestorColor });
    });

    // Vertical from connectionY → child top
    lines.push({ x: midX - 1, y: connectionY, w: 2, h: childTopY - connectionY, color: ancestorColor });

    // Horizontal from child center → midX (if needed)
    if (Math.abs(childCenterX - midX) > 4) {
      lines.push({
        x: Math.min(childCenterX, midX),
        y: connectionY,
        w: Math.abs(childCenterX - midX),
        h: 2,
        color: ancestorColor,
      });
    }
  });

  // ── Descendant connections (central person → children) ─────────────────────
  childParentMap.forEach((childIds, parentId) => {
    const parentPos = posMap.get(parentId);
    if (!parentPos) return;

    const parentCenterX = parentPos.x + CARD_WIDTH / 2;
    const parentBottomY = parentPos.y + CARD_HEIGHT;
    const connectionY = parentBottomY + 20;

    childIds.forEach(childId => {
      const childPos = posMap.get(childId);
      if (!childPos) return;

      const childW = childPos.isChild ? CHILD_CARD_WIDTH : CARD_WIDTH;
      const childCenterX = childPos.x + childW / 2;
      const childTopY = childPos.y;

      // Vertical from parent bottom → connectionY
      lines.push({ x: parentCenterX - 1, y: parentBottomY, w: 2, h: connectionY - parentBottomY, color: childColor });

      // Horizontal from parentCenterX → childCenterX at connectionY
      if (Math.abs(childCenterX - parentCenterX) > 4) {
        lines.push({
          x: Math.min(parentCenterX, childCenterX),
          y: connectionY,
          w: Math.abs(childCenterX - parentCenterX),
          h: 2,
          color: childColor,
        });
      }

      // Vertical from connectionY → child top
      lines.push({ x: childCenterX - 1, y: connectionY, w: 2, h: childTopY - connectionY, color: childColor });
    });
  });

  return (
    <>
      {lines.map((l, i) => (
        <Line key={i} {...l} />
      ))}
    </>
  );
};

export default ConnectionLayer;
