import { View } from 'react-native';

import { Button, ButtonText } from '@/components/ui/button';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Button onPress={() => console.log('Botão pressionado')}>
        <ButtonText>Clique aqui</ButtonText>
      </Button>
    </View>
  );
}
