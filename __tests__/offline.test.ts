import AsyncStorage from '@react-native-async-storage/async-storage';

import { listClasses, listClassesBySchool } from '@/features/classes/api';
import { createSchool, getSchool, listSchools } from '@/features/schools/api';
import { NetworkError } from '@/lib/api-client';
import { isOffline, setOffline } from '@/lib/connectivity';

import { classes, schools } from '../test-utils/fixtures';

// Resposta da API para GET /schools?_embed=classes (já ordenada por nome, como o json-server).
const schoolsWithEmbeddedClasses = [schools[1], schools[0]].map((school) => ({
  ...school,
  classes: classes.filter((item) => item.schoolId === school.id),
}));

function apiOnline(body: unknown) {
  globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body });
}

function apiOffline() {
  globalThis.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'));
}

describe('Navegação offline', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    setOffline(false);
  });

  it('usa a última lista de escolas salva quando a API fica inacessível', async () => {
    apiOnline(schoolsWithEmbeddedClasses);
    const online = await listSchools();

    apiOffline();
    const offline = await listSchools();

    expect(offline).toEqual(online);
    expect(offline.map((school) => school.classesCount)).toEqual([1, 2]);
    expect(isOffline()).toBe(true);
  });

  it('abre a escola e suas classes offline a partir da lista carregada antes', async () => {
    apiOnline(schoolsWithEmbeddedClasses);
    await listSchools();

    apiOffline();

    await expect(getSchool('1')).resolves.toEqual(schools[0]);
    const schoolClasses = await listClassesBySchool('1');
    expect(schoolClasses.map((item) => item.name)).toEqual(['1º Ano A', '2º Ano B']);
  });

  it('lista todas as classes offline com o nome da escola', async () => {
    apiOnline(schoolsWithEmbeddedClasses);
    await listSchools();

    apiOffline();
    const offline = await listClasses();

    expect(offline.map((item) => [item.name, item.school?.name])).toEqual([
      ['1º Ano A', 'Escola Municipal Monteiro Lobato'],
      ['2º Ano B', 'Escola Municipal Monteiro Lobato'],
      ['9º Ano A', 'Colégio Estadual Machado de Assis'],
    ]);
  });

  it('sem cópia salva, repassa o erro de conexão para a tela', async () => {
    apiOffline();

    await expect(listSchools()).rejects.toBeInstanceOf(NetworkError);
  });

  it('não permite salvar sem conexão', async () => {
    apiOffline();

    await expect(createSchool({ name: 'Nova', address: 'Rua X' })).rejects.toBeInstanceOf(NetworkError);
  });

  it('volta ao modo online quando a API responde de novo', async () => {
    apiOffline();
    await expect(listSchools()).rejects.toBeInstanceOf(NetworkError);
    expect(isOffline()).toBe(true);

    apiOnline(schoolsWithEmbeddedClasses);
    await listSchools();
    expect(isOffline()).toBe(false);
  });
});
