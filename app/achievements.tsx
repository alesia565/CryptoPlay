import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useUser } from './UserContext';
import { useNavigation } from '@react-navigation/native';

const ALL_ACHIEVEMENTS = [
  { id: 'first-buy', title: 'Primera Compra', description: 'Compraste tu primera cripto.' },
  { id: 'buy-3', title: 'Comprador Frecuente', description: 'Hiciste 3 compras de criptos.' },
  { id: 'buy-10-doge', title: 'Fan de Dogecoin', description: 'Compraste 10 DOGE.' },
  { id: 'spend-5000', title: 'Gran Gastador', description: 'Gastaste más de 5000 CPX.' },
];

export default function AchievementsScreen() {
  const { achievements } = useUser();
  const navigation = useNavigation();

  if (!achievements) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tus Logros</Text>
        <Text style={styles.subtitle}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Tus Logros</Text>

      <FlatList
        data={ALL_ACHIEVEMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const unlocked = achievements.includes(item.id);
          return (
            <View style={[styles.card, unlocked ? styles.unlocked : styles.locked]}>
              <Text style={styles.cardTitle}>
                {unlocked ? '✅ ' : '🔒 '} {item.title}
              </Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  unlocked: {
    backgroundColor: '#1e1e1e',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  locked: {
    backgroundColor: '#1e1e1e',
    borderLeftWidth: 4,
    borderLeftColor: '#888',
    opacity: 0.5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDesc: {
    color: '#ccc',
    marginTop: 4,
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#00FFD1',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});