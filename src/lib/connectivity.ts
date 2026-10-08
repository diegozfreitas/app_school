import { useSyncExternalStore } from 'react';

// Estado global "a API está inacessível?", atualizado pelo api-client a cada requisição.
// Não depende do sinal de rede do aparelho: também cobre o caso da API fora do ar.
let offline = false;
const listeners = new Set<() => void>();

export function setOffline(value: boolean) {
  if (offline === value) return;
  offline = value;
  listeners.forEach((listener) => listener());
}

export function isOffline() {
  return offline;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIsOffline() {
  return useSyncExternalStore(subscribe, isOffline, isOffline);
}
