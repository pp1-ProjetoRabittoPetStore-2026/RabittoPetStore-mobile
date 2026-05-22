import Home from '@/pages/home/Home';
import { useLogout } from '@/services/modules/auth/queries';
import { useAuth } from '@/shared/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react-native';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const { signOut } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  function handleLogout() {
    logout(undefined, {
      onSettled: async () => {
        queryClient.clear();
        await signOut();
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Meus Pets</Text>
        <TouchableOpacity
          onPress={handleLogout}
          disabled={isPending}
          style={styles.logoutButton}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <LogOut color="#000" size={22} />
          )}
        </TouchableOpacity>
      </View>
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  logoutButton: {
    padding: 6,
  },
});
