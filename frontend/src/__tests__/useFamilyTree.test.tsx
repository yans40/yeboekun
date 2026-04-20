import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFamilyTree } from '../hooks/useFamilyTree';
import apiService from '../services/api';

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    getFamilyData: jest.fn(),
  },
}));

const mockedGetFamilyData = apiService.getFamilyData as jest.Mock;

const makePerson = (id: number, firstName = 'X') => ({
  id,
  firstName,
  lastName: 'Y',
  gender: 'M',
  isAlive: true,
  fullName: `${firstName} Y`,
  createdAt: '',
  updatedAt: '',
});

describe('useFamilyTree', () => {
  beforeEach(() => {
    mockedGetFamilyData.mockReset();
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useFamilyTree());

    expect(result.current.familyData).toBeNull();
    expect(result.current.layout).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('loads family data and builds the layout', async () => {
    mockedGetFamilyData.mockResolvedValue({
      person: makePerson(1),
      parents: [makePerson(2, 'Father'), makePerson(3, 'Mother')],
      children: [makePerson(10, 'Child')],
      siblings: [],
      spouses: [],
    });

    const { result } = renderHook(() => useFamilyTree());

    await act(async () => {
      await result.current.loadFamilyTree(1);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.familyData).not.toBeNull();
    expect(result.current.familyData!.parents).toHaveLength(2);
    expect(result.current.layout).not.toBeNull();
    expect(result.current.layout!.positions.length).toBeGreaterThan(0);
  });

  it('normalizes singular "spouse" field to spouses array', async () => {
    mockedGetFamilyData.mockResolvedValue({
      person: makePerson(1),
      parents: [],
      children: [],
      siblings: [],
      spouse: makePerson(20, 'Spouse'),
    });

    const { result } = renderHook(() => useFamilyTree());

    await act(async () => {
      await result.current.loadFamilyTree(1);
    });

    expect(result.current.familyData!.spouses).toHaveLength(1);
    expect(result.current.familyData!.spouses[0].spouse.id).toBe(20);
  });

  it('sets an error message when the API rejects', async () => {
    mockedGetFamilyData.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useFamilyTree());

    await act(async () => {
      await result.current.loadFamilyTree(1);
    });

    expect(result.current.error).toBe('boom');
    expect(result.current.familyData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('clearTree resets the state', async () => {
    mockedGetFamilyData.mockResolvedValue({
      person: makePerson(1),
      parents: [],
      children: [],
      siblings: [],
      spouses: [],
    });

    const { result } = renderHook(() => useFamilyTree());

    await act(async () => {
      await result.current.loadFamilyTree(1);
    });

    expect(result.current.familyData).not.toBeNull();

    act(() => {
      result.current.clearTree();
    });

    expect(result.current.familyData).toBeNull();
    expect(result.current.layout).toBeNull();
  });
});
