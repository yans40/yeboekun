import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Person, CreatePersonDto, UpdatePersonDto, Relationship, CreateRelationshipDto, Tree, CreateTreeDto } from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour les requêtes
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error: unknown) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Intercepteur pour les réponses
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`Response from ${response.config.url}:`, response.status);
        return response;
      },
      (error: unknown) => {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error('Response error:', err.response?.data || err.message);
        return Promise.reject(error);
      }
    );
  }

  // Person API
  async getPersons(): Promise<Person[]> {
    const response = await this.api.get<Person[]>('/persons');
    return response.data;
  }

  async getPersonById(id: number): Promise<Person> {
    const response = await this.api.get<Person>(`/persons/${id}`);
    return response.data;
  }

  async getPersonWithRelationships(id: number): Promise<Person> {
    const response = await this.api.get<Person>(`/persons/${id}/relationships`);
    return response.data;
  }

  async getChildren(id: number): Promise<Person[]> {
    const response = await this.api.get<Person[]>(`/persons/${id}/children`);
    return response.data;
  }

  async getParents(id: number): Promise<Person[]> {
    const response = await this.api.get<Person[]>(`/persons/${id}/parents`);
    return response.data;
  }

  async getSiblings(id: number): Promise<Person[]> {
    const response = await this.api.get<Person[]>(`/persons/${id}/siblings`);
    return response.data;
  }

  async searchPersons(searchTerm: string): Promise<Person[]> {
    const response = await this.api.get<Person[]>(`/persons/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }

  async createPerson(person: CreatePersonDto): Promise<Person> {
    const response = await this.api.post<Person>('/persons', person);
    return response.data;
  }

  async updatePerson(id: number, person: UpdatePersonDto): Promise<void> {
    await this.api.put(`/persons/${id}`, person);
  }

  async deletePerson(id: number): Promise<void> {
    await this.api.delete(`/persons/${id}`);
  }

  // Relationship API (pour plus tard)
  async getRelationships(): Promise<Relationship[]> {
    const response = await this.api.get<Relationship[]>('/relationships');
    return response.data;
  }

  async createRelationship(relationship: CreateRelationshipDto): Promise<Relationship> {
    const response = await this.api.post<Relationship>('/relationships', relationship);
    return response.data;
  }

  // Tree API (pour plus tard)
  async getTrees(): Promise<Tree[]> {
    const response = await this.api.get<Tree[]>('/trees');
    return response.data;
  }

  async createTree(tree: CreateTreeDto): Promise<Tree> {
    const response = await this.api.post<Tree>('/trees', tree);
    return response.data;
  }
}


// Instance singleton
export const apiService = new ApiService();
export default apiService;

// Export direct pour les tests
export const fetchPersons = apiService.getPersons.bind(apiService);
