import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemplateUse = 'broadcast' | 'postsale' | 'ambas';

interface TemplateMetaState {
  uses: Record<string, TemplateUse>;
  setUse(name: string, use: TemplateUse): void;
  getUse(name: string): TemplateUse;
}

export const useTemplateMetaStore = create<TemplateMetaState>()(
  persist(
    (set, get) => ({
      uses: {},
      setUse(name, use) {
        set((s) => ({ uses: { ...s.uses, [name]: use } }));
      },
      getUse(name) {
        return get().uses[name] ?? 'ambas';
      },
    }),
    { name: 'lid-template-meta', version: 1 },
  ),
);
