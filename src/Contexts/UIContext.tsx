import React, { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

// Types
type UIState = Record<string, any>;
type Listener = () => void;

type UIStore = {
  get: (id: string) => UIState | undefined;
  set: (id: string, partial: Partial<UIState>) => void;
  setInitial: (id: string, initialObj?: UIState) => void;
  remove: (id: string) => void;
  subscribeId: (id: string, cb: Listener) => () => void;
};

function createUIStore(): UIStore {
  const state = new Map<string, UIState>();
  const listeners = new Map<string, Set<Listener>>();

  const ensureListeners = (id: string) => {
    if (!listeners.has(id)) listeners.set(id, new Set());
    return listeners.get(id)!;
  };

  const get = (id: string) => state.get(id);
  const set = (id: string, partial: Partial<UIState>) => {
    const prev = state.get(id);
    if (!prev) {
      return;
    }

    const next = { ...prev, ...partial };
    state.set(id, next);

    const setOf = listeners.get(id);
    if (setOf) setOf.forEach((cb) => cb());
  };

  const setInitial = (id: string, initialObj?: UIState) => {
    if (!state.has(id)) {
      state.set(id, { ...(initialObj || {}) });
      const setOf = listeners.get(id);
      if (setOf) setOf.forEach((cb) => cb());
    }
  };

  const remove = (id: string) => {
    const existed = state.delete(id);
    if (existed) {
      const setOf = listeners.get(id);
      if (setOf) setOf.forEach((cb) => cb());
    }
  };

  const subscribeId = (id: string, cb: Listener) => {
    const setOf = ensureListeners(id);
    setOf.add(cb);
    return () => setOf.delete(cb);
  };

  return {
    get,
    set,
    setInitial,
    remove,
    subscribeId,
  };
}

const UIContext = createContext<UIStore | undefined>(undefined);

export function UIContextProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => createUIStore(), []); // useMemo so that it won't create a new store each time
  return <UIContext.Provider value={store}>{children}</UIContext.Provider>;
}

export function UIRegister(
  id: string,
  initialState?: UIState,
  opts: { removeOnUnmount?: boolean } = { removeOnUnmount: false }
) {
  const store = useContext(UIContext);
  if (!store) throw new Error("UIRegister must be used within a UIContextProvider.");

  useEffect(() => {
    store.setInitial(id, initialState || {});
    return () => {
      if (opts.removeOnUnmount) store.remove(id);
    };
    // only depend on id and opts.removeOnUnmount to avoid unnecessary resets
  }, [id, opts.removeOnUnmount]);
}

export function useUI(id: string): [UIState | null, (partial: Partial<UIState>) => void, () => void] {
  const store = useContext(UIContext);
  if (!store) throw new Error("useUI must be used within a UIContextProvider.");

  const slice = useSyncExternalStore<UIState | null>(
    (cb) => store.subscribeId(id, cb),
    () => store.get(id) || null,
    () => store.get(id) || null
  );

  const update = (partial: Partial<UIState>) => store.set(id, partial);
  const remove = () => store.remove(id);

  return [slice, update, remove];
}