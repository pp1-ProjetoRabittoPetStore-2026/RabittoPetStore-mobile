import Home from '@/pages/home/Home';
import { useLogout } from '@/services/modules/auth/queries';
import { useAuth } from '@/shared/hooks';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      <Home />
      <View style={styles.logoutWrapper}>
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isPending}
          style={[
            styles.logoutButton,
            isPending && styles.logoutButtonDisabled,
          ]}
        >
          <Text style={styles.logoutText}>
            {isPending ? 'Saindo...' : 'Sair'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  logoutWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
