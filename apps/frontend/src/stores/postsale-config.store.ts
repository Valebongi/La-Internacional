import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Intervalos y templates fijos — solo modificables desde código
export const POSTSALE_STATIC = {
  postventa: {
    intervalDays: 7,
    templateName: 'prueba_imagen',
  },
  recuperar: {
    intervalDays: 20,
    templateName: 'plantilla_de_testeo',
  },
} as const;

interface PostsaleConfigState {
  postventaActive: boolean;
  recuperarActive: boolean;
  togglePostventa(): void;
  toggleRecuperar(): void;
}

export const usePostsaleConfigStore = create<PostsaleConfigState>()(
  persist(
    (set) => ({
      postventaActive: true,
      recuperarActive: true,
      togglePostventa() { set((s) => ({ postventaActive: !s.postventaActive })); },
      toggleRecuperar() { set((s) => ({ recuperarActive: !s.recuperarActive })); },
    }),
    { name: 'lid-postsale-config', version: 2 },
  ),
);
