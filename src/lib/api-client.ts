import Constants from 'expo-constants';

// Em desenvolvimento, usa o mesmo IP do servidor do Expo para alcançar o json-server
// (funciona em emulador e em aparelho físico na mesma rede).
const devHost = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${devHost}:3000`;

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar ${path}`);
  }

  return response.json() as Promise<T>;
}
