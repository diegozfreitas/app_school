import { CloseCircleIcon, SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export function SearchInput({ value, onChangeText, placeholder }: SearchInputProps) {
  return (
    <Input className="h-11">
      <InputSlot>
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        aria-label={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        className="text-base"
      />
      {value !== '' && (
        <InputSlot
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          // O InputSlot do gluestack se esconde dos leitores de tela por padrão (pensado para
          // ícones decorativos); este é um botão, então precisa ficar acessível.
          accessibilityElementsHidden={false}
          tabIndex={0}
          hitSlop={8}>
          <InputIcon as={CloseCircleIcon} />
        </InputSlot>
      )}
    </Input>
  );
}
