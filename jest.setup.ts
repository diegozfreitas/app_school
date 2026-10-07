// Habilita matchers como toBeOnTheScreen() e toHaveTextContent().
import '@testing-library/react-native/matchers';

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

// O mock oficial do Reanimated não marca __esModule, então `import Animated from ...`
// recebia o módulo inteiro e `Animated.createAnimatedComponent` ficava indefinido.
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...require('react-native-reanimated/mock'),
}));

// No Jest o jest-expo resolve os arquivos ".native" do worklets, que exigem o módulo nativo.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
