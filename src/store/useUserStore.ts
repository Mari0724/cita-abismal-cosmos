import { create } from 'zustand';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  favoritos: number[];
}

interface UserStore {
  usuario: Usuario | null;
  isLoggedIn: boolean;
  setUsuario: (usuario: Usuario) => void;
  logout: () => void;
  addFavorito: (fraseId: number) => void;
  removeFavorito: (fraseId: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  usuario: null,
  isLoggedIn: false,
  setUsuario: (usuario) => set({ usuario, isLoggedIn: true }),
  logout: () => set({ usuario: null, isLoggedIn: false }),
  addFavorito: (fraseId) => set((state) => {
    if (!state.usuario) return state;
    return {
      usuario: {
        ...state.usuario,
        favoritos: [...state.usuario.favoritos, fraseId]
      }
    };
  }),
  removeFavorito: (fraseId) => set((state) => {
    if (!state.usuario) return state;
    return {
      usuario: {
        ...state.usuario,
        favoritos: state.usuario.favoritos.filter(id => id !== fraseId)
      }
    };
  }),
}));