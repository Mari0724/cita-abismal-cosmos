export interface Frase {
  id: number;
  texto: string;
  autor: string;
  tema: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  favoritos: number[];
}