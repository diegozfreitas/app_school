import { fireEvent, screen } from 'expo-router/testing-library';

import * as classesApi from '@/features/classes/api';
import * as schoolsApi from '@/features/schools/api';

import { classes, schools, schoolsWithCount } from '../test-utils/fixtures';
import { renderApp } from '../test-utils/render-app';

jest.mock('@/features/classes/api');
jest.mock('@/features/schools/api');
const classesMock = jest.mocked(classesApi);
const schoolsMock = jest.mocked(schoolsApi);

describe('Tela da escola', () => {
  beforeEach(() => {
    schoolsMock.getSchool.mockResolvedValue(schools[0]);
    schoolsMock.listSchools.mockResolvedValue(schoolsWithCount);
    classesMock.listClassesBySchool.mockResolvedValue(classes.filter((item) => item.schoolId === '1'));
  });

  it('mostra os dados da escola e só as classes dela', async () => {
    await renderApp('/schools/1');

    expect(await screen.findByText('Rua das Flores, 120 - Centro')).toBeOnTheScreen();
    expect(screen.getByText('Classes (2)')).toBeOnTheScreen();
    expect(screen.getByText('1º Ano A')).toBeOnTheScreen();
    expect(screen.getByText('2º Ano B')).toBeOnTheScreen();
    expect(screen.queryByText('9º Ano A')).not.toBeOnTheScreen();
    expect(classesMock.listClassesBySchool).toHaveBeenCalledWith('1');
  });

  it('mostra mensagem quando a escola não tem classes', async () => {
    classesMock.listClassesBySchool.mockResolvedValue([]);
    await renderApp('/schools/1');

    expect(await screen.findByText('Nenhuma classe cadastrada nesta escola')).toBeOnTheScreen();
  });

  it('abre o formulário de classe já vinculado à escola', async () => {
    const { app } = await renderApp('/schools/1');

    await fireEvent.press(await screen.findByText('Adicionar nova classe'));

    expect(app).toHavePathnameWithParams('/classes/form?schoolId=1');
  });

  it('tem botão de voltar mesmo quando a tela foi aberta direto (sem histórico)', async () => {
    const { app } = await renderApp('/schools/1');

    await fireEvent.press(await screen.findByLabelText('Voltar'));

    expect(app).toHavePathname('/');
  });

  it('volta para a tela anterior quando há histórico', async () => {
    const { app } = await renderApp('/');

    await fireEvent.press(await screen.findByText('Escola Municipal Monteiro Lobato'));
    expect(app).toHavePathname('/schools/1');

    await fireEvent.press(await screen.findByLabelText('Voltar'));
    expect(app).toHavePathname('/');
  });
});
