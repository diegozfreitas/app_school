# AppSchool

App mobile (Android, iOS e web) para cadastro de **escolas** e suas **classes**, feito com Expo, Expo Router e gluestack-ui. Os dados ficam em um back-end mock (`json-server`) servido a partir de um arquivo JSON.

## Funcionalidades

- **Escolas**
  - Listar escolas com nome, endereço e número de classes (mensagem quando não há nenhuma)
  - Adicionar escola (nome e endereço obrigatórios)
  - Editar e excluir escola (exclui também as classes vinculadas, com confirmação)
  - Tocar em uma escola abre a tela dela, com as classes daquela escola
- **Classes**
  - Listar todas as classes, mostrando a escola de cada uma (tocar na escola abre a tela dela)
  - Listar as classes de uma escola específica
  - Cadastrar classe (nome, turno e ano letivo; a escola vem pré-selecionada quando aberta pela tela da escola)
  - Editar e excluir classe (na edição a escola não pode ser trocada)
- **Busca e filtro**
  - Escolas: busca por nome ou endereço
  - Classes: busca pelo nome da classe ou da escola + filtro por turno
  - A busca ignora acentos e maiúsculas ("colegio" encontra "Colégio")

## Versões utilizadas

| Ferramenta / lib | Versão |
| --- | --- |
| Node.js | **22.12 ou superior** (exigido pelo `json-server`; o React Native 0.86 aceita 20.19+) |
| Yarn | 1.22 (o projeto usa `yarn.lock`) |
| Expo SDK | 57 (`expo ~57.0.27`) |
| React Native | 0.86.3 |
| React | 19.2.3 |
| TypeScript | 6.0 |
| Expo Router | 57 (rotas por arquivos em `src/app`) |
| gluestack-ui | `@gluestack-ui/core` 5.0 + `@gluestack-ui/utils` 5.0 (Button, AlertDialog) |
| NativeWind | 5.0.0-preview.4, com `react-native-css` 3 e Tailwind CSS 4 |
| React Native Reanimated | 4.5.1 |
| expo-symbols | 57 (ícones) |
| json-server | 1.0.0-beta.15 (back-end mock) |
| Jest / jest-expo | 29.7 / 57 |
| React Native Testing Library | 14.0 |

## Pré-requisitos

- Node.js 22.12+ e Yarn 1.x (`npm install -g yarn`)
- Para rodar no celular: o app **Expo Go** (compatível com o SDK 57) ou um *development build*
- Para emulador: Android Studio (Android) ou Xcode (iOS, só no macOS)

## Instalação

```bash
git clone <url-do-repositorio>
cd appschool
yarn install
```

> Use `yarn` e não `npm install`: o `yarn.lock` garante as mesmas versões e o `package.json` fixa o `lightningcss` em `resolutions`, que o NativeWind precisa.

## Como rodar

O app depende da API mock, então são **dois terminais**:

```bash
# Terminal 1 — back-end mock (porta 3000)
yarn api

# Terminal 2 — app
yarn start
```

No terminal do Expo, pressione:

- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS
- `w` para abrir no navegador
- ou leia o QR code com o Expo Go no celular

Se mudar dependências ou a configuração do Tailwind, limpe o cache com `yarn start -c`.

## Back-end mock (json-server)

- **Banco de dados:** [`api/db.json`](api/db.json), com as coleções `schools` e `classes`. O `json-server` grava as alterações do app direto nesse arquivo.
- **Comando:** `yarn api` roda `json-server --host 0.0.0.0 --port 3000 api/db.json`. O `--host 0.0.0.0` permite acesso de emuladores e celulares na mesma rede.
- **Endereço que o app usa:** em desenvolvimento, o app descobre o IP do computador pelo servidor do Expo e chama `http://<ip>:3000`. Para usar outro endereço, preencha `EXPO_PUBLIC_API_URL` no [`.env`](.env), ou num `.env.local`, que fica só na sua máquina e é ignorado pelo git. Depois reinicie o `yarn start`:

  ```bash
  # .env.local
  EXPO_PUBLIC_API_URL=http://192.168.0.10:3000
  ```

- **Reiniciar a API:** se editar o `db.json` à mão, reinicie o `yarn api`, porque o arquivo só é lido na inicialização.

### Estrutura dos dados

```jsonc
{
  "schools": [
    { "id": "1", "name": "Escola Municipal Monteiro Lobato", "address": "Rua das Flores, 120 - Centro" }
  ],
  "classes": [
    // shift: "morning" | "afternoon" | "evening" | "full-time"
    { "id": "1", "schoolId": "1", "name": "1º Ano A", "shift": "morning", "year": 2026 }
  ]
}
```

### Endpoints usados pelo app

| Método | Rota | Uso |
| --- | --- | --- |
| GET | `/schools?_embed=classes&_sort=name` | Lista de escolas (com contagem de classes) |
| GET / POST / PATCH | `/schools`, `/schools/:id` | Detalhe, cadastro e edição de escola |
| DELETE | `/schools/:id?_dependent=classes` | Exclui a escola e suas classes |
| GET | `/classes?_embed=school&_sort=-year,name` | Lista de todas as classes com a escola |
| GET | `/classes?_where={"schoolId":{"eq":"<id>"}}` | Classes de uma escola* |
| GET / POST / PATCH / DELETE | `/classes`, `/classes/:id` | Detalhe, cadastro, edição e exclusão de classe |

\* O filtro simples `?schoolId=1` não funciona para IDs numéricos, porque o `json-server` converte `"1"` em número e não encontra o ID salvo como texto. O `_where` mantém o valor como texto.

## Testes

```bash
yarn test          # roda todos os testes uma vez
yarn test:watch    # modo watch enquanto desenvolve
```

- **Como funcionam:** os testes ficam em [`__tests__/`](__tests__) e usam `jest-expo` com React Native Testing Library. Eles renderizam as telas reais pelo `renderRouter` do Expo Router e conferem se as telas abrem, se os componentes aparecem e se a navegação vai para a rota certa.
- **API:** substituída por dados falsos ([`test-utils/fixtures.ts`](test-utils/fixtures.ts)), então os testes **não** precisam do `yarn api` rodando.
- **O que é coberto:**
  - Lista de escolas: dados, mensagem de vazio, erro da API, navegação e exclusão pelo diálogo de confirmação
  - Lista de classes: escola de cada classe e link para a escola
  - Tela da escola: só as classes dela e botão de voltar com e sem histórico
  - Formulários: campos, validações, carregamento na edição e escola travada

Lint e typecheck:

```bash
yarn lint          # na primeira vez o Expo oferece instalar e configurar o ESLint
npx tsc --noEmit
```

## Estrutura do projeto

```
api/db.json                   # banco de dados do back-end mock
src/
  app/                        # rotas (Expo Router) — cada arquivo é uma tela
    _layout.tsx               # Stack raiz, provider do gluestack, botão de voltar
    (tabs)/                   # abas Escolas (index) e Classes
    schools/[id].tsx          # tela da escola com as classes dela
    school-form.tsx           # modal de cadastro/edição de escola
    class-form.tsx            # modal de cadastro/edição de classe
  features/
    schools/                  # api, tipos e components/school-card.tsx
    classes/                  # api, tipos e components/class-card.tsx
  components/                 # componentes compartilhados (formulário, diálogo, voltar)
    ui/                       # componentes gerados pelo gluestack-ui (button, alert-dialog...)
  lib/                        # cliente HTTP e helpers de navegação
__tests__/                    # testes das telas
test-utils/                   # helpers e dados de exemplo dos testes
```

## Prints

<!--
Adicione as imagens em docs/screenshots/ e descomente a tabela abaixo.

| Escolas | Tela da escola | Classes | Nova classe |
| --- | --- | --- | --- |
| ![Escolas](docs/screenshots/escolas.png) | ![Escola](docs/screenshots/escola.png) | ![Classes](docs/screenshots/classes.png) | ![Nova classe](docs/screenshots/nova-classe.png) |
-->

_Em breve._

## Problemas comuns

- **"Não foi possível carregar as escolas"**: o `yarn api` não está rodando, ou o celular não está na mesma rede do computador. Confira o firewall para a porta 3000 ou defina `EXPO_PUBLIC_API_URL` no `.env.local`.
- **Erros de tipo em rotas novas no editor** (ex.: `/schools/[id]`): reinicie o `yarn start` para o Expo gerar de novo os tipos das rotas (`.expo/types`).
- **Estilos não aplicados**: reinicie com `yarn start -c` para limpar o cache do Metro.
