import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@appschool/cache/';

// Leitura/escrita de JSON no AsyncStorage. Falhas de armazenamento nunca derrubam a tela:
// no pior caso o app só fica sem a cópia offline.
export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignora: o dado continua disponível online.
  }
}
