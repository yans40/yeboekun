jest.mock('axios', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();
  const mockInstance = {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockInstance),
    },
    __mocks: { mockGet, mockPost, mockPut, mockDelete, mockInstance },
  };
});

import apiService, { fetchPersons } from '../services/api';

const axiosModule = jest.requireMock('axios') as {
  __mocks: {
    mockGet: jest.Mock;
    mockPost: jest.Mock;
    mockPut: jest.Mock;
    mockDelete: jest.Mock;
  };
};

const { mockGet, mockPost, mockPut, mockDelete } = axiosModule.__mocks;

describe('ApiService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
    mockPut.mockReset();
    mockDelete.mockReset();
  });

  describe('persons', () => {
    it('getPersons returns the list', async () => {
      mockGet.mockResolvedValue({
        data: [
          { id: 1, firstName: 'Jean', lastName: 'Dupont', gender: 'M', isAlive: true, fullName: 'Jean Dupont', createdAt: '', updatedAt: '' },
        ],
      });

      const result = await apiService.getPersons();

      expect(mockGet).toHaveBeenCalledWith('/persons');
      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('Jean');
    });

    it('fetchPersons alias works', async () => {
      mockGet.mockResolvedValue({ data: [] });

      const result = await fetchPersons();

      expect(Array.isArray(result)).toBe(true);
    });

    it('getPersonById hits /persons/:id', async () => {
      mockGet.mockResolvedValue({ data: { id: 7 } });

      await apiService.getPersonById(7);

      expect(mockGet).toHaveBeenCalledWith('/persons/7');
    });

    it('searchPersons url-encodes the query', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await apiService.searchPersons('jean dupont');

      expect(mockGet).toHaveBeenCalledWith('/persons/search?q=jean%20dupont');
    });

    it('createPerson posts the payload', async () => {
      const dto = { firstName: 'A', lastName: 'B', gender: 'M' as const, isAlive: true };
      mockPost.mockResolvedValue({
        data: { id: 1, ...dto, fullName: 'A B', createdAt: '', updatedAt: '' },
      });

      await apiService.createPerson(dto);

      expect(mockPost).toHaveBeenCalledWith('/persons', dto);
    });

    it('updatePerson appends ?force=true to bypass duplicate check', async () => {
      const dto = { firstName: 'A', lastName: 'B', gender: 'M' as const, isAlive: true };
      mockPut.mockResolvedValue({ data: null });

      await apiService.updatePerson(42, dto);

      expect(mockPut).toHaveBeenCalledWith('/persons/42?force=true', dto);
    });

    it('deletePerson hits the correct url', async () => {
      mockDelete.mockResolvedValue({ data: null });

      await apiService.deletePerson(3);

      expect(mockDelete).toHaveBeenCalledWith('/persons/3');
    });
  });

  describe('family tree', () => {
    it('getFamilyData hits /persons/:id/family', async () => {
      mockGet.mockResolvedValue({
        data: { person: { id: 1 }, parents: [], children: [], siblings: [], spouses: [] },
      });

      await apiService.getFamilyData(1);

      expect(mockGet).toHaveBeenCalledWith('/persons/1/family');
    });

    it('getSpouses hits /persons/:id/spouses', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await apiService.getSpouses(5);

      expect(mockGet).toHaveBeenCalledWith('/persons/5/spouses');
    });
  });

  describe('persons — lookups', () => {
    it('getPersonWithRelationships hits /persons/:id/relationships', async () => {
      mockGet.mockResolvedValue({ data: { id: 1 } });

      await apiService.getPersonWithRelationships(1);

      expect(mockGet).toHaveBeenCalledWith('/persons/1/relationships');
    });

    it('getChildren hits /persons/:id/children', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await apiService.getChildren(7);

      expect(mockGet).toHaveBeenCalledWith('/persons/7/children');
    });

    it('getParents hits /persons/:id/parents', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await apiService.getParents(7);

      expect(mockGet).toHaveBeenCalledWith('/persons/7/parents');
    });

    it('getSiblings hits /persons/:id/siblings', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await apiService.getSiblings(7);

      expect(mockGet).toHaveBeenCalledWith('/persons/7/siblings');
    });
  });

  describe('parent-child relationships', () => {
    it('addParentChildRelationship posts to /persons/:parentId/children/:childId', async () => {
      mockPost.mockResolvedValue({ data: undefined });

      await apiService.addParentChildRelationship(3, 7);

      expect(mockPost).toHaveBeenCalledWith('/persons/3/children/7');
    });

    it('deleteParentChildRelationship deletes /persons/:parentId/children/:childId', async () => {
      mockDelete.mockResolvedValue({ data: undefined });

      await apiService.deleteParentChildRelationship(3, 7);

      expect(mockDelete).toHaveBeenCalledWith('/persons/3/children/7');
    });
  });

  describe('relationships', () => {
    it('getRelationships hits /relationships', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await apiService.getRelationships();

      expect(mockGet).toHaveBeenCalledWith('/relationships');
    });

    it('createRelationship posts to /relationships', async () => {
      const dto = { person1Id: 1, person2Id: 2, relationshipType: 1, isActive: true };
      mockPost.mockResolvedValue({ data: { id: 1, ...dto } });

      await apiService.createRelationship(dto);

      expect(mockPost).toHaveBeenCalledWith('/relationships', dto);
    });
  });

  describe('trees', () => {
    it('getTrees hits /trees', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await apiService.getTrees();

      expect(mockGet).toHaveBeenCalledWith('/trees');
    });

    it('createTree posts to /trees', async () => {
      const dto = { name: 'Famille Dupont', isPublic: true };
      mockPost.mockResolvedValue({ data: { id: 1, ...dto } });

      await apiService.createTree(dto);

      expect(mockPost).toHaveBeenCalledWith('/trees', dto);
    });
  });
});
