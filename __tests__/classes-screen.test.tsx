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

  it('busca pelo nome da classe ou da escola', async () => {
    await renderApp('/classes');
    const search = await screen.findByLabelText('Buscar por classe ou escola');

    await fireEvent.changeText(search, '9º');
    expect(screen.getByText('9º Ano A')).toBeOnTheScreen();
    expect(screen.queryByText('1º Ano A')).not.toBeOnTheScreen();

    await fireEvent.changeText(search, 'lobato');
    expect(screen.getByText('1º Ano A')).toBeOnTheScreen();
    expect(screen.getByText('2º Ano B')).toBeOnTheScreen();
    expect(screen.queryByText('9º Ano A')).not.toBeOnTheScreen();
  });

  it('filtra por turno e volta a mostrar todas em "Todos"', async () => {
    await renderApp('/classes');
    await screen.findByText('1º Ano A');

    await fireEvent.press(screen.getByText('Noite'));
    expect(screen.getByText('9º Ano A')).toBeOnTheScreen();
    expect(screen.queryByText('1º Ano A')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Integral'));
    expect(screen.getByText('Nenhuma classe encontrada com esses filtros')).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Todos'));
    expect(screen.getByText('1º Ano A')).toBeOnTheScreen();
    expect(screen.getByText('9º Ano A')).toBeOnTheScreen();
  });

  it('abre a escola da classe ao tocar no nome da escola', async () => {
    const { app } = await renderApp('/classes');

    await fireEvent.press(await screen.findByText(/Colégio Estadual Machado de Assis/));

    expect(app).toHavePathname('/schools/2');
  });
});
