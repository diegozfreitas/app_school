import { useTheme } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, TextInput, View } from 'react-native';

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export function SearchInput({ value, onChangeText, placeholder }: SearchInputProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center gap-2 rounded-md border border-input bg-background px-3">
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        tintColor={colors.text}
        size={18}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        className="flex-1 py-2.5 text-base text-foreground"
      />
      {value !== '' && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          hitSlop={8}
          className="active:opacity-60">
          <SymbolView
            name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }}
            tintColor={colors.text}
            size={18}
          />
        </Pressable>
      )}
    </View>
  );
}
