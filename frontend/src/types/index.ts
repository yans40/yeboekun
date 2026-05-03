// Types pour les personnes
export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  photoUrl?: string;
  biography?: string;
  gender: 'M' | 'F' | 'O' | null;
  isAlive: boolean;
  fullName: string;
  age?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  photoUrl?: string;
  biography?: string;
  gender: 'M' | 'F' | 'O';
  isAlive: boolean;
}

export interface UpdatePersonDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  photoUrl?: string;
  biography?: string;
  gender: 'M' | 'F' | 'O' | null;
  isAlive: boolean;
}

// Types pour les relations
export interface Relationship {
  id: number;
  person1Id: number;
  person2Id: number;
  person1Name: string;
  person2Name: string;
  relationshipType: number;
  relationshipTypeName: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateRelationshipDto {
  person1Id: number;
  person2Id: number;
  relationshipType: number;
  startDate?: string;
  endDate?: string;
  notes?: string;
  isActive: boolean;
}

// Types pour les arbres
export interface Tree {
  id: number;
  name: string;
  description?: string;
  rootPersonId?: number;
  rootPersonName?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreeDto {
  name: string;
  description?: string;
  rootPersonId?: number;
  isPublic: boolean;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Types pour les nœuds de l'arbre généalogique
export interface TreeNode {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  gender: 'M' | 'F' | 'O';
  photoUrl?: string;
  children: TreeNode[];
  parents: TreeNode[];
  siblings: TreeNode[];
  x?: number;
  y?: number;
  level?: number;
}

// Types pour les formulaires
export interface PersonFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  deathDate: string;
  birthPlace: string;
  deathPlace: string;
  photoUrl: string;
  biography: string;
  gender: 'M' | 'F' | 'O';
  isAlive: boolean;
}

// Types pour les filtres et recherche
export interface PersonFilters {
  searchTerm: string;
  gender?: 'M' | 'F' | 'O';
  isAlive?: boolean;
  birthYearFrom?: number;
  birthYearTo?: number;
}

// Types pour les statistiques
export interface TreeStatistics {
  totalPersons: number;
  totalRelationships: number;
  generations: number;
  oldestPerson?: Person;
  youngestPerson?: Person;
  mostCommonSurname?: string;
}

// ─── Family tree visualization types ─────────────────────────────────────────

export interface SpouseInfo {
  spouse: Person;
  marriageStartDate?: string;
  marriageEndDate?: string;
  marriageNotes?: string;
}

/** Response from GET /persons/{id}/family */
export interface FamilyData {
  person: Person;
  parents: Person[];
  siblings: Person[];
  children: Person[];
  spouses: SpouseInfo[];
}

/** Position of a single card in the virtual canvas */
export interface CardPosition {
  personId: number;
  x: number;
  y: number;
  level: number;      // 0=central, >0=ancestors, -1=children
  isCentral: boolean;
  isChild: boolean;
  isSibling: boolean;
  isSpouse: boolean;
}

/** A married couple represented in the layout */
export interface SpousePair {
  person1Id: number;
  person2Id: number;
}

/** Result of the layout algorithm */
export interface FamilyTreeLayout {
  positions: CardPosition[];
  totalWidth: number;
  totalHeight: number;
  centralX: number;
  centralY: number;
  spousePairs: SpousePair[];
}

/** Extended person with relationship IDs (for form submission) */
export interface PersonWithRelations extends Person {
  parent1Id?: number;
  parent2Id?: number;
}

// ─── Vue Rivière types (endpoint GET /api/persons/{id}/river-view) ─────────────

export interface RiverViewNode {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  deathDate: string | null;
  isAlive: boolean;
  /** M=Masculin, F=Féminin, O=Autre (aligné Person / backend) */
  gender: 'M' | 'F' | 'O';
  photoUrl: string | null;
  /** 0=racine, négatif=ascendant, positif=descendant */
  generation: number;
}

export interface RiverViewEdge {
  sourceId: number;
  targetId: number;
  type: 'Parent' | 'Spouse' | 'Sibling';
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

export interface RiverViewData {
  rootId: number;
  depth: number;
  nodes: RiverViewNode[];
  edges: RiverViewEdge[];
  generationRange: { min: number; max: number };
}
