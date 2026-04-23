import { useLogout } from '@/services/modules/auth/queries';
import { useAuth } from '@/shared/hooks';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const { signOut } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  function handleLogout() {
    logout(undefined, {
      onSettled: async () => {
        await signOut();
      },
    });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Text>Home privada</Text>

      <TouchableOpacity
        onPress={handleLogout}
        disabled={isPending}
        style={{
          backgroundColor: '#ef4444',
          borderRadius: 8,
          paddingHorizontal: 18,
          paddingVertical: 10,
          opacity: isPending ? 0.7 : 1,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          {isPending ? 'Saindo...' : 'Sair'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
