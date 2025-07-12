import type { Frase, Usuario } from '../types';

class ApiService {
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  }

  async getFrases(): Promise<Frase[]> {
    return this.fetchData<Frase[]>('/frases.json');
  }

  async getUsuarios(): Promise<Usuario[]> {
    return this.fetchData<Usuario[]>('/usuarios.json');
  }

  async getFraseAleatoria(): Promise<Frase> {
    const frases = await this.getFrases();
    const randomIndex = Math.floor(Math.random() * frases.length);
    return frases[randomIndex];
  }

  async authenticateUser(email: string, password: string): Promise<Usuario | null> {
    const usuarios = await this.getUsuarios();
    return usuarios.find(u => u.email === email && u.password === password) || null;
  }

  async getFrasesByIds(ids: number[]): Promise<Frase[]> {
    const frases = await this.getFrases();
    return frases.filter(frase => ids.includes(frase.id));
  }

  // Simulación de funciones CRUD (en una app real serían llamadas al backend)
  async createUser(userData: Omit<Usuario, 'id'>): Promise<Usuario> {
    // Simular creación de usuario
    const newUser: Usuario = {
      ...userData,
      id: Date.now(),
    };
    return newUser;
  }
}

export const apiService = new ApiService();