import { buildLayout, CANVAS_CENTER_X, CARD_WIDTH, MIN_SPACING, LEVEL_HEIGHT, START_Y } from '../utils/familyTreeLayout';
import { FamilyData, Person } from '../types';

const person = (id: number, firstName = `P${id}`, birthDate?: string): Person => ({
  id,
  firstName,
  lastName: 'Test',
  gender: 'M',
  isAlive: true,
  fullName: `${firstName} Test`,
  createdAt: '',
  updatedAt: '',
  birthDate,
});

const emptyFamily = (central: Person): FamilyData => ({
  person: central,
  parents: [],
  children: [],
  siblings: [],
  spouses: [],
});

describe('familyTreeLayout.buildLayout', () => {
  it('lays out a single person centered on the canvas', () => {
    const layout = buildLayout(emptyFamily(person(1)));

    expect(layout.positions).toHaveLength(1);
    const [pos] = layout.positions;
    expect(pos.isCentral).toBe(true);
    expect(pos.x).toBe(CANVAS_CENTER_X);
    expect(pos.level).toBe(0);
  });

  it('places parents above the central person', () => {
    const central = person(1);
    const family: FamilyData = {
      ...emptyFamily(central),
      parents: [person(2, 'Father'), person(3, 'Mother')],
    };

    const layout = buildLayout(family);

    const parentsPositions = layout.positions.filter(p => p.level === 1);
    const centralPos = layout.positions.find(p => p.isCentral)!;

    expect(parentsPositions).toHaveLength(2);
    for (const p of parentsPositions) {
      expect(p.y).toBeLessThan(centralPos.y);
    }
  });

  it('places children below the central person', () => {
    const central = person(1);
    const family: FamilyData = {
      ...emptyFamily(central),
      children: [person(10), person(11)],
    };

    const layout = buildLayout(family);

    const childrenPositions = layout.positions.filter(p => p.isChild);
    const centralPos = layout.positions.find(p => p.isCentral)!;

    expect(childrenPositions).toHaveLength(2);
    for (const c of childrenPositions) {
      expect(c.y).toBeGreaterThan(centralPos.y);
      expect(c.level).toBe(-1);
    }
  });

  it('marks siblings on level 0 but not central', () => {
    const central = person(1);
    const family: FamilyData = {
      ...emptyFamily(central),
      siblings: [person(2)],
    };

    const layout = buildLayout(family);

    const siblings = layout.positions.filter(p => p.isSibling);
    expect(siblings).toHaveLength(1);
    expect(siblings[0].isCentral).toBe(false);
    expect(siblings[0].level).toBe(0);
  });

  it('respects MIN_SPACING between cards on the same generation', () => {
    const central = person(1);
    const family: FamilyData = {
      ...emptyFamily(central),
      children: Array.from({ length: 5 }, (_, i) => person(100 + i)),
    };

    const layout = buildLayout(family);
    const childrenX = layout.positions
      .filter(p => p.isChild)
      .map(p => p.x)
      .sort((a, b) => a - b);

    for (let i = 1; i < childrenX.length; i++) {
      expect(childrenX[i] - childrenX[i - 1]).toBeGreaterThanOrEqual(MIN_SPACING - 0.01);
    }
  });

  it('computes a bounded totalWidth/totalHeight', () => {
    const layout = buildLayout({
      ...emptyFamily(person(1)),
      parents: [person(2), person(3)],
      children: [person(10)],
    });

    expect(layout.totalWidth).toBeGreaterThan(CARD_WIDTH);
    expect(layout.totalHeight).toBeGreaterThan(LEVEL_HEIGHT);
    expect(Number.isFinite(layout.totalWidth)).toBe(true);
    expect(Number.isFinite(layout.totalHeight)).toBe(true);
  });

  it('sorts siblings by birthdate around the central person when there are parents', () => {
    const central = person(1, 'Central', '1990-01-01');
    const elder = person(2, 'Elder', '1985-01-01');
    const younger = person(3, 'Younger', '1995-01-01');

    const layout = buildLayout({
      ...emptyFamily(central),
      parents: [person(100, 'Parent')],
      siblings: [younger, elder],
    });

    const positionOf = (id: number) => layout.positions.find(p => p.personId === id)!;

    expect(positionOf(elder.id).x).toBeLessThan(positionOf(central.id).x);
    expect(positionOf(younger.id).x).toBeGreaterThan(positionOf(central.id).x);
  });

  it('places father (M) to the left of mother (F) regardless of input order', () => {
    const child = person(1);
    const mother = { ...person(2, 'Mother'), gender: 'F' as const };
    const father = { ...person(3, 'Father'), gender: 'M' as const };

    const layout = buildLayout({
      ...emptyFamily(child),
      parents: [mother, father],
    });

    const fatherPos = layout.positions.find(p => p.personId === father.id)!;
    const motherPos = layout.positions.find(p => p.personId === mother.id)!;
    expect(fatherPos.x).toBeLessThan(motherPos.x);
  });

  it('uses default canvas center when only the central person is present', () => {
    const layout = buildLayout(emptyFamily(person(1)));

    expect(layout.centralX).toBe(CANVAS_CENTER_X);
    expect(layout.centralY).toBeGreaterThanOrEqual(START_Y);
  });
});
