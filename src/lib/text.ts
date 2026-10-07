// Normaliza texto para busca: sem acentos, minúsculo e sem espaços nas pontas ("João " -> "joao").
export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
