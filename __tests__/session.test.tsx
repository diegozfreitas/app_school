import { fireEvent, screen, waitFor } from 'expo-router/testing-library';

import * as schoolsApi from '@/features/schools/api';

import { schoolsWithCount } from '../test-utils/fixtures';
import { renderApp } from '../test-utils/render-app';

jest.mock('@/features/schools/api');
const api = jest.mocked(schoolsApi);

describe('Sessão do gestor (Context API)', () => {
  beforeEach(() => {
    api.listSchools.mockResolvedValue(schoolsWithCount);
  });

  it('sem gestor identificado, abre a tela de login em vez da lista', async () => {
    const { app } = await renderApp('/', { signedInAs: null });

    expect(await screen.findByText('Entrar')).toBeOnTheScreen();
    await waitFor(() => expect(app).toHavePathname('/login'));
    expect(screen.queryByText('Escola Municipal Monteiro Lobato')).not.toBeOnTheScreen();
  });

  it('exige o nome para entrar', async () => {
    await renderApp('/', { signedInAs: null });

    await fireEvent.press(await screen.findByText('Entrar'));

    expect(await screen.findByText('Informe seu nome para continuar.')).toBeOnTheScreen();
  });

  it('ao entrar, vai para a lista de escolas e mostra o nome do gestor', async () => {
    const { app } = await renderApp('/', { signedInAs: null });

    await fireEvent.changeText(await screen.findByLabelText('Seu nome'), 'Maria Silva');
    await fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('Escola Municipal Monteiro Lobato')).toBeOnTheScreen();
    expect(screen.getByText('Olá, Maria Silva')).toBeOnTheScreen();
    expect(app).toHavePathname('/');
  });

  it('restaura o gestor salvo no aparelho sem pedir login de novo', async () => {
    await renderApp('/', { signedInAs: 'Diego' });

    expect(await screen.findByText('Olá, Diego')).toBeOnTheScreen();
    expect(screen.queryByText('Entrar')).not.toBeOnTheScreen();
  });

  it('ao sair, volta para a tela de login', async () => {
    const { app } = await renderApp('/', { signedInAs: 'Diego' });

    await fireEvent.press(await screen.findByText('Sair'));

    expect(await screen.findByText('Entrar')).toBeOnTheScreen();
    await waitFor(() => expect(app).toHavePathname('/login'));
  });

  it('não deixa abrir telas internas sem estar identificado', async () => {
    const { app } = await renderApp('/schools/form', { signedInAs: null });

    expect(await screen.findByText('Entrar')).toBeOnTheScreen();
    await waitFor(() => expect(app).toHavePathname('/login'));
  });
});
