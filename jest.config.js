/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    // Arquivos .css (Tailwind/NativeWind) não são usados nos testes.
    '\\.css$': '<rootDir>/test-utils/style-mock.js',
    // Espelha os "paths" do tsconfig.json.
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Padrão da documentação do Expo + pacotes ESM do gluestack/nativewind/expo-router.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@gluestack-ui/.*|nativewind|react-native-css|tailwind-variants|standard-navigation)',
  ],
};
