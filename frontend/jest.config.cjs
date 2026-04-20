/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).(ts|tsx|js|jsx)',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__tests__/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    // Scope de gate : couches métier/utilitaires avec tests unitaires solides.
    // Les composants React (PersonForm, PersonCard, FamilyTree, App, ...) ont
    // des tests partiels mais pas encore suffisants pour entrer dans le gate.
    // Ils seront ajoutés ici au fur et à mesure que la couverture RTL monte
    // (suivi dans l'issue de tests de composants).
    'src/services/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    // Seuil branches < 70 parce que familyTreeLayout contient du code défensif
    // pour des générations (grand-parents, arrière-enfants) non encore
    // exposées par FamilyData ; à remonter quand ces cas seront implémentés.
    global: { branches: 60, functions: 70, lines: 80, statements: 80 },
    './src/hooks/**/*.ts': { branches: 80, functions: 100, lines: 90, statements: 90 },
  },
};
