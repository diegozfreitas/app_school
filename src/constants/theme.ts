// Cores da barra de abas nativa (NativeTabs recebe cores, não classes do Tailwind).
// O restante do app usa os tokens do gluestack definidos em src/global.css.
export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
  },
} as const;
