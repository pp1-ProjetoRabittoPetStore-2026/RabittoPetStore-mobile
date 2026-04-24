import { useGetMyPets } from '@/services/modules/pets/queries';
import { Pet } from '@/shared/types/pet';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function PetCard({ pet }: { pet: Pet }) {
  return (
    <View style={styles.card}>
      <Text style={styles.petName}>{pet.nome}</Text>
      <Text style={styles.petMeta}>Raça: {pet.raca || 'Não informada'}</Text>
      <Text style={styles.petMeta}>Porte: {pet.porte || 'Não informado'}</Text>
    </View>
  );
}

function Home() {
  const {
    data: pets = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetMyPets();

  if (isLoading) {
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
          Nao foi possivel carregar seus pets
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Pets</Text>

      {pets.length === 0 ? (
        <View style={styles.centeredState}>
          <Text style={styles.stateTitle}>Voce ainda nao cadastrou pets</Text>
          <Text style={styles.stateText}>
            Cadastre um pet para comecar a usar o app.
          </Text>
        </View>
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
  },
  petName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  petMeta: {
    fontSize: 14,
    color: '#475569',
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
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;
