import { FamilyData, CardPosition, FamilyTreeLayout } from '../types';

// ─── Layout constants ─────────────────────────────────────────────────────────
export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 180;
export const CHILD_CARD_WIDTH = 160;
export const LEVEL_HEIGHT = 220;
export const BASE_CARD_SPACING = 250;
export const START_Y = 50;
export const MIN_SPACING = CARD_WIDTH + 30;
export const CANVAS_CENTER_X = 1500;

interface GenerationEntry {
  person: { id: number; birthDate?: string; fullName: string };
  level: number;
  isCentral: boolean;
}

type Generations = Map<number, GenerationEntry[]>;

/**
 * Builds the absolute-position layout for all cards from a FamilyData object.
 * Level 0  = central person + siblings
 * Level >0 = ancestors (1=parents, 2=grandparents …)
 * Level -1 = children
 */
export function buildLayout(familyData: FamilyData): FamilyTreeLayout {
  const { person, parents, siblings, children } = familyData;

  const generations: Generations = new Map();

  // Level 0 — central + siblings
  generations.set(0, [
    { person, level: 0, isCentral: true },
    ...siblings.map(s => ({ person: s, level: 0, isCentral: false })),
  ]);

  // Level 1 — parents : père (M) à gauche, mère (F) à droite
  if (parents.length > 0) {
    const sortedParents = [...parents].sort((a, b) => {
      const order = (g: string | null) => g === 'M' ? 0 : g === 'F' ? 1 : 2;
      return order(a.gender) - order(b.gender);
    });
    generations.set(1, sortedParents.map(p => ({ person: p, level: 1, isCentral: false })));
  }

  // Level -1 — children
  if (children.length > 0) {
    generations.set(-1, children.map(c => ({ person: c, level: -1, isCentral: false })));
  }

  const levels = Array.from(generations.keys()).sort((a, b) => a - b);
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);

  // ── 1. Compute X positions top-down ────────────────────────────────────────
  const cardX = new Map<number, number>();

  for (let level = maxLevel; level >= minLevel; level--) {
    const gen = generations.get(level);
    if (!gen) continue;

    if (level === -1) {
      // Children: centre under the central person
      const centralX = cardX.get(person.id) ?? CANVAS_CENTER_X;
      const centerX = centralX + CARD_WIDTH / 2;
      const spacing = Math.max(BASE_CARD_SPACING, MIN_SPACING);
      const totalW = (gen.length - 1) * spacing + CHILD_CARD_WIDTH;
      const startX = centerX - totalW / 2;
      gen.forEach((e, i) => cardX.set(e.person.id, startX + i * spacing));
      continue;
    }

    if (level === maxLevel) {
      // Top generation: sequential centred on canvas
      const spacing = Math.max(BASE_CARD_SPACING, MIN_SPACING);
      const totalW = (gen.length - 1) * spacing;
      const startX = CANVAS_CENTER_X - totalW / 2;
      gen.forEach((e, i) => cardX.set(e.person.id, startX + i * spacing));
    } else if (level === 0) {
      // Central level: sort siblings by birthdate around the central person
      const sorted = [...gen].sort((a, b) => {
        if (a.person.birthDate && b.person.birthDate)
          return new Date(a.person.birthDate).getTime() - new Date(b.person.birthDate).getTime();
        if (a.isCentral) return -1;
        if (b.isCentral) return 1;
        return 0;
      });
      const ci = sorted.findIndex(e => e.isCentral);
      const baseX = cardX.get(person.id) ?? CANVAS_CENTER_X;
      sorted.forEach((e, i) => {
        cardX.set(e.person.id, baseX + (i - ci) * BASE_CARD_SPACING);
      });
    } else {
      // Middle generations: centre under the generation above
      const parentGen = generations.get(level + 1);
      const spacing = Math.max(BASE_CARD_SPACING, MIN_SPACING);
      if (parentGen && parentGen.length > 0) {
        const parentXs = parentGen
          .map(p => cardX.get(p.person.id))
          .filter((x): x is number => x !== undefined);
        const avgCenter =
          parentXs.reduce((s, x) => s + x + CARD_WIDTH / 2, 0) / parentXs.length;
        const totalW = (gen.length - 1) * spacing;
        const startX = avgCenter - totalW / 2 - CARD_WIDTH / 2;
        gen.forEach((e, i) => cardX.set(e.person.id, startX + i * spacing));
      } else {
        const totalW = (gen.length - 1) * spacing;
        gen.forEach((e, i) =>
          cardX.set(e.person.id, CANVAS_CENTER_X - totalW / 2 + i * spacing),
        );
      }
    }
  }

  // ── 2. Overlap correction within each generation ───────────────────────────
  for (const level of levels) {
    const gen = generations.get(level);
    if (!gen || gen.length <= 1) continue;
    const sorted = gen
      .map(e => ({ id: e.person.id, x: cardX.get(e.person.id) ?? CANVAS_CENTER_X }))
      .sort((a, b) => a.x - b.x);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (curr.x - prev.x < MIN_SPACING) {
        const newX = prev.x + MIN_SPACING;
        cardX.set(curr.id, newX);
        sorted[i].x = newX;
      }
    }
  }

  // ── 3. Build CardPosition array ────────────────────────────────────────────
  const centralPersonY = START_Y + maxLevel * LEVEL_HEIGHT;
  const positions: CardPosition[] = [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (const level of levels) {
    const gen = generations.get(level);
    if (!gen) continue;

    const y =
      level === -1
        ? centralPersonY + LEVEL_HEIGHT
        : START_Y + (maxLevel - level) * LEVEL_HEIGHT;

    gen.forEach(entry => {
      const x = cardX.get(entry.person.id) ?? CANVAS_CENTER_X;
      positions.push({
        personId: entry.person.id,
        x,
        y,
        level,
        isCentral: entry.isCentral,
        isChild: level === -1,
        isSibling: level === 0 && !entry.isCentral,
        isSpouse: false,
      });
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + CARD_WIDTH);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + CARD_HEIGHT);
    });
  }

  const centralPos = positions.find(p => p.isCentral);

  return {
    positions,
    totalWidth: isFinite(maxX - minX) ? maxX - minX + 200 : 3000,
    totalHeight: isFinite(maxY - minY) ? maxY - minY + 200 : 2000,
    centralX: centralPos?.x ?? CANVAS_CENTER_X,
    centralY: centralPos?.y ?? centralPersonY,
    spousePairs: [],
  };
}
