import { router, type Href } from 'expo-router';

// Volta para a tela anterior; sem histórico (link direto, reload na web) vai para o fallback.
export function goBack(fallback: Href = '/') {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}
