import { fireEvent, screen, waitFor, within } from 'expo-router/testing-library';

import * as schoolsApi from '@/features/schools/api';

import { schoolsWithCount } from '../test-utils/fixtures';
import { renderApp } from '../test-utils/render-app';

jest.mock('@/features/schools/api');
const api = jest.mocked(schoolsApi);

describe('Tela de Escolas', () => {
  beforeEach(() => {
    api.listSchools.mockResolvedValue(schoolsWithCount);
  });

  it('lista as escolas com nome, endereço e número de classes', async () => {
    await renderApp('/');

    expect(await screen.findByText('Escola Municipal Monteiro Lobato')).toBeOnTheScreen();
    expect(screen.getByText('Rua das Flores, 120 - Centro')).toBeOnTheScreen();
    expect(screen.getByText(/2 classes/)).toBeOnTheScreen();
    expect(screen.getByText(/1 classe\b/)).toBeOnTheScreen();
    expect(screen.getByText('Adicionar nova escola')).toBeOnTheScreen();
  });

  it('mostra mensagem quando não há escolas', async () => {
    api.listSchools.mockResolvedValue([]);
    await renderApp('/');

    expect(await screen.findByText('Nenhuma escola cadastrada')).toBeOnTheScreen();
  });

  it('mostra erro e botão de tentar novamente quando a API falha', async () => {
    api.listSchools.mockRejectedValue(new Error('offline'));
    await renderApp('/');

    expect(await screen.findByText(/Não foi possível carregar as escolas/)).toBeOnTheScreen();
    expect(screen.getByText('Tentar novamente')).toBeOnTheScreen();
  });

  it('abre a tela da escola ao tocar no card', async () => {
    const { app } = await renderApp('/');

    await fireEvent.press(await screen.findByText('Escola Municipal Monteiro Lobato'));

    expect(app).toHavePathname('/schools/1');
  });

  it('abre o formulário ao tocar em "Adicionar nova escola"', async () => {
    const { app } = await renderApp('/');

    await fireEvent.press(await screen.findByText('Adicionar nova escola'));

    expect(app).toHavePathname('/school-form');
  });

  it('pede confirmação antes de excluir e remove a escola da lista', async () => {
    api.deleteSchool.mockResolvedValue(schoolsWithCount[0]);
    await renderApp('/');

    await screen.findByText('Escola Municipal Monteiro Lobato');
    await fireEvent.press(screen.getAllByText('Excluir')[0]);

    const dialog = await screen.findByTestId('confirm-dialog');
    expect(within(dialog).getByText('Excluir escola')).toBeOnTheScreen();

    await fireEvent.press(within(dialog).getByText('Excluir'));

    await waitFor(() => expect(api.deleteSchool).toHaveBeenCalledWith('1'));
    await waitFor(() =>
      expect(screen.queryByText('Escola Municipal Monteiro Lobato')).not.toBeOnTheScreen()
    );
  });
});
