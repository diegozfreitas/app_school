import { fireEvent, screen } from 'expo-router/testing-library';

import * as classesApi from '@/features/classes/api';

import { classesWithSchool } from '../test-utils/fixtures';
import { renderApp } from '../test-utils/render-app';

jest.mock('@/features/classes/api');
const api = jest.mocked(classesApi);

describe('Tela de Classes', () => {
  beforeEach(() => {
    api.listClasses.mockResolvedValue(classesWithSchool);
  });

  it('lista todas as classes com turno, ano letivo e escola', async () => {
    await renderApp('/classes');

    expect(await screen.findByText('1º Ano A')).toBeOnTheScreen();
    expect(screen.getByText('9º Ano A')).toBeOnTheScreen();
    expect(screen.getByText(/Noite · Ano letivo 2025/)).toBeOnTheScreen();
    expect(screen.getByText(/Colégio Estadual Machado de Assis/)).toBeOnTheScreen();
    expect(screen.getByText('Adicionar nova classe')).toBeOnTheScreen();
  });

  it('mostra mensagem quando não há classes', async () => {
    api.listClasses.mockResolvedValue([]);
    await renderApp('/classes');

    expect(await screen.findByText('Nenhuma classe cadastrada')).toBeOnTheScreen();
  });

  it('abre a escola da classe ao tocar no nome da escola', async () => {
    const { app } = await renderApp('/classes');

    await fireEvent.press(await screen.findByText(/Colégio Estadual Machado de Assis/));

    expect(app).toHavePathname('/schools/2');
  });
});
