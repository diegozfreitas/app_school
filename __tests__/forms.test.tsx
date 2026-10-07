import { fireEvent, screen } from 'expo-router/testing-library';

import * as classesApi from '@/features/classes/api';
import * as schoolsApi from '@/features/schools/api';

import { classes, schools } from '../test-utils/fixtures';
import { renderApp } from '../test-utils/render-app';

jest.mock('@/features/classes/api');
jest.mock('@/features/schools/api');
const classesMock = jest.mocked(classesApi);
const schoolsMock = jest.mocked(schoolsApi);

describe('Formulário de escola', () => {
  it('exibe os campos e valida os obrigatórios', async () => {
    await renderApp('/school-form');

    expect(await screen.findByText(/Nome/)).toBeOnTheScreen();
    expect(screen.getByText(/Endereço/)).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Salvar'));

    expect(await screen.findByText('Informe o nome da escola.')).toBeOnTheScreen();
    expect(screen.getByText('Informe o endereço da escola.')).toBeOnTheScreen();
    expect(schoolsMock.createSchool).not.toHaveBeenCalled();
  });

  it('carrega os dados da escola ao editar', async () => {
    schoolsMock.getSchool.mockResolvedValue(schools[0]);
    await renderApp('/school-form?id=1');

    expect(await screen.findByDisplayValue('Escola Municipal Monteiro Lobato')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('Rua das Flores, 120 - Centro')).toBeOnTheScreen();
  });
});

describe('Formulário de classe', () => {
  beforeEach(() => {
    schoolsMock.listSchools.mockResolvedValue(
      schools.map((school) => ({ ...school, classesCount: 0 }))
    );
  });

  it('exibe os campos, os turnos e as escolas', async () => {
    await renderApp('/class-form');

    expect(await screen.findByText(/Nome da classe/)).toBeOnTheScreen();
    expect(screen.getByText('Manhã')).toBeOnTheScreen();
    expect(screen.getByText('Integral')).toBeOnTheScreen();
    expect(screen.getByDisplayValue(String(new Date().getFullYear()))).toBeOnTheScreen();
    expect(screen.getByText('Escola Municipal Monteiro Lobato')).toBeOnTheScreen();
    expect(screen.getByText('Colégio Estadual Machado de Assis')).toBeOnTheScreen();
  });

  it('valida os campos obrigatórios', async () => {
    await renderApp('/class-form');

    await fireEvent.press(await screen.findByText('Salvar'));

    expect(await screen.findByText('Informe o nome da classe.')).toBeOnTheScreen();
    expect(screen.getByText('Selecione o turno.')).toBeOnTheScreen();
    expect(screen.getByText('Selecione a escola.')).toBeOnTheScreen();
    expect(classesMock.createClass).not.toHaveBeenCalled();
  });

  it('mostra só a escola de origem quando aberto a partir de uma escola', async () => {
    await renderApp('/class-form?schoolId=1');

    expect(await screen.findByText('Escola Municipal Monteiro Lobato')).toBeOnTheScreen();
    expect(screen.queryByText('Colégio Estadual Machado de Assis')).not.toBeOnTheScreen();
  });

  it('carrega os dados da classe ao editar', async () => {
    classesMock.getClass.mockResolvedValue(classes[0]);
    await renderApp('/class-form?id=1');

    expect(await screen.findByDisplayValue('1º Ano A')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('2026')).toBeOnTheScreen();
  });

  it('na edição mostra a escola, mas não permite trocar', async () => {
    classesMock.getClass.mockResolvedValue(classes[0]);
    await renderApp('/class-form?id=1');

    expect(await screen.findByText('Escola Municipal Monteiro Lobato')).toBeOnTheScreen();
    expect(screen.queryByText('Colégio Estadual Machado de Assis')).not.toBeOnTheScreen();
    expect(screen.queryByRole('radio', { name: 'Escola Municipal Monteiro Lobato' })).not.toBeOnTheScreen();
  });
});
