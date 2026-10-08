import Head from 'expo-router/head';

// Título da aba do navegador na versão web (sem isso aparece o nome da rota, ex.: "index").
// No Android/iOS não altera nada visível.
export function PageTitle({ title }: { title: string }) {
  return (
    <Head>
      <title>{`${title} · AppSchool`}</title>
    </Head>
  );
}
