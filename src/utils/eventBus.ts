type Listener = () => void;

const listeners = new Set<Listener>();

export function emitMutation(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeMutations(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}