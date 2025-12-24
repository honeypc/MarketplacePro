import { create } from 'zustand';

type ModelId = string | number;

export interface ModelStore<T extends { id: ModelId }> {
  items: T[];
  byId: Record<string, T>;
  setItems: (items: T[]) => void;
  upsertItem: (item: T) => void;
  upsertItems: (items: T[]) => void;
  removeItem: (id: ModelId) => void;
  clear: () => void;
}

const toKey = (id: ModelId) => String(id);

const indexById = <T extends { id: ModelId }>(items: T[]) => {
  const byId: Record<string, T> = {};
  for (const item of items) {
    byId[toKey(item.id)] = item;
  }
  return byId;
};

export const createModelStore = <T extends { id: ModelId }>() =>
  create<ModelStore<T>>((set, get) => ({
    items: [],
    byId: {},
    setItems: (items) => set({ items, byId: indexById(items) }),
    upsertItem: (item) => {
      const key = toKey(item.id);
      const { items, byId } = get();
      const nextById = { ...byId, [key]: item };
      const existingIndex = items.findIndex((entry) => toKey(entry.id) === key);
      const nextItems = [...items];

      if (existingIndex >= 0) {
        nextItems[existingIndex] = item;
      } else {
        nextItems.push(item);
      }

      set({ items: nextItems, byId: nextById });
    },
    upsertItems: (itemsToUpsert) => {
      if (itemsToUpsert.length === 0) {
        return;
      }

      const { items, byId } = get();
      const nextItems = [...items];
      const nextById = { ...byId };

      for (const item of itemsToUpsert) {
        const key = toKey(item.id);
        nextById[key] = item;
        const existingIndex = nextItems.findIndex((entry) => toKey(entry.id) === key);
        if (existingIndex >= 0) {
          nextItems[existingIndex] = item;
        } else {
          nextItems.push(item);
        }
      }

      set({ items: nextItems, byId: nextById });
    },
    removeItem: (id) => {
      const key = toKey(id);
      const { items, byId } = get();
      if (!byId[key]) {
        return;
      }

      const nextItems = items.filter((item) => toKey(item.id) !== key);
      const nextById = { ...byId };
      delete nextById[key];

      set({ items: nextItems, byId: nextById });
    },
    clear: () => set({ items: [], byId: {} }),
  }));
