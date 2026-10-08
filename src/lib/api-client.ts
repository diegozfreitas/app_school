import Constants from 'expo-constants';

import { setOffline } from '@/lib/connectivity';

// Em desenvolvimento, usa o mesmo IP do servidor do Expo para alcançar o json-server
// (funciona em emulador e em aparelho físico na mesma rede).
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';

// `||` (e não `??`) para que uma variável vazia no .env também caia no endereço automático.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${devHost}:3000`;

// Sem rede, o fetch pode ficar pendurado por muito tempo antes de falhar.
const REQUEST_TIMEOUT_MS = 6000;

// A API não respondeu (sem rede, API fora do ar ou timeout) — diferente de um erro HTTP.
export class NetworkError extends Error {
  constructor() {
    super('Sem conexão com o servidor.');
    this.name = 'NetworkError';
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    setOffline(true);
    throw new NetworkError();
  } finally {
    clearTimeout(timeout);
  }

  setOffline(false);

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar ${path}`);
  }

  return response.json() as Promise<T>;
}

// Tenta a API; se ela estiver inacessível, usa a cópia offline (quando existir).
export async function withOfflineFallback<T>(
  online: () => Promise<T>,
  offline: () => Promise<T | undefined>
): Promise<T> {
  try {
    return await online();
  } catch (error) {
    if (!(error instanceof NetworkError)) throw error;
    const cached = await offline();
    if (cached === undefined) throw error;
    return cached;
  }
}

// Mensagem para falhas ao salvar/excluir: sem conexão as alterações não são feitas offline.
export function writeErrorMessage(error: unknown, fallback: string) {
  return error instanceof NetworkError
    ? 'Você está sem conexão. Conecte-se para salvar ou excluir dados.'
    : fallback;
}
