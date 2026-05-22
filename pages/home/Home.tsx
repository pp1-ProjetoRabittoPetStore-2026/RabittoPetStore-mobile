import { useGetMyPets } from '@/services/modules/pets/queries';
import { Pet } from '@/shared/types/pet';
import { useRouter } from 'expo-router';
import { ChevronRight, PawPrint, Pencil } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function PetCard({ pet }: { pet: Pet }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/pets-details/${pet.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardLeft}>
        <View style={styles.petAvatar}>
          <PawPrint color="#0f766e" size={22} />
        </View>
        <View>
          <Text style={styles.petName}>{pet.nome}</Text>
          <Text style={styles.petMeta}>
            {pet.raca || 'Raça não informada'} ·{' '}
            {pet.porte || 'Porte não informado'}
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Pencil color="#94a3b8" size={14} />
        <ChevronRight color="#94a3b8" size={20} />
      </View>
    </TouchableOpacity>
  );
}

function Home() {
  const router = useRouter();

  const {
    data: pets,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetMyPets();

  if (isLoading || isRefetching) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={styles.stateText}>Carregando seus pets...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateTitle}>
          Não foi possivel carregar seus pets
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {pets?.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.centeredState}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          <Text style={styles.stateTitle}>Você ainda nao cadastrou pets</Text>
          <Text style={styles.stateText}>
            Cadastre um pet para comecar a usar o app.
          </Text>
          <TouchableOpacity
            style={styles.registerPetButton}
            onPress={() => router.push('/register-pet')}
          >
            <Text style={styles.registerPetButtonText}>
              <PawPrint color="#FFF" size={12} /> Cadastrar pet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item, index) =>
            String(item.id ?? `${item.nome}-${index}`)
          }
          renderItem={({ item }) => <PetCard pet={item} />}
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.registerPetButton}
              onPress={() => router.push('/register-pet')}
            >
              <Text style={styles.registerPetButtonText}>
                <PawPrint color="#FFF" size={12} /> Cadastrar pet
              </Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  petMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  stateText: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  registerPetButton: {
    marginTop: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  registerPetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Home;
