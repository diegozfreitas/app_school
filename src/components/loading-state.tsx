import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';

export function LoadingState() {
  return (
    <Center className="flex-1">
      <Spinner size="large" />
    </Center>
  );
}
