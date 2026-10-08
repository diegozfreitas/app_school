import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

// Recarrega sempre que a tela volta ao foco (ex.: depois de salvar no formulário).
export function useRefreshOnFocus(refresh: () => void) {
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );
}
