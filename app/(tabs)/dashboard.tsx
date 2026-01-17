import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';
import axios from 'axios';

const EUR_TO_CPX = 10;

const COINS = [
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'dogecoin', symbol: 'DOGE' },
  { id: 'trumpcoin', symbol: 'TRUMP' },
  { id: 'cardano', symbol: 'ADA' },
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'ripple', symbol: 'XRP' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'polkadot', symbol: 'DOT' },
  { id: 'polygon', symbol: 'MATIC' },
  { id: 'litecoin', symbol: 'LTC' },
  { id: 'bitcoin-cash', symbol: 'BCH' },
  { id: 'chainlink', symbol: 'LINK' },
  { id: 'stellar', symbol: 'XLM' },
  { id: 'uniswap', symbol: 'UNI' },
  { id: 'avalanche-2', symbol: 'AVAX' },
  { id: 'algorand', symbol: 'ALGO' },
  { id: 'vechain', symbol: 'VET' },
  { id: 'filecoin', symbol: 'FIL' },
  { id: 'tron', symbol: 'TRX' },
  { id: 'eos', symbol: 'EOS' },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = COINS.map((c) => c.id).join(',');
    axios
      .get('https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=eur')
      .then((res) => {
        setPrices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert('Error', 'No se pudieron obtener los precios en vivo.');
        setLoading(false);
      });
  }, []);

  const getTotalCryptoValue = () => {
    return COINS.reduce((acc, { id }) => {
      const amount = (user as any)[id] || 0;
      const price = prices?.[id]?.eur || 0;
      return acc + amount * price * EUR_TO_CPX;
    }, 0).toFixed(2);
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Sesión cerrada');
    router.replace('/');
  };

  const getValueInCPX = (coinId: string, amount: number) => {
    const price = prices?.[coinId]?.eur || 0;
    return (amount * price * EUR_TO_CPX).toFixed(2);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No hay sesión iniciada</Text>
      </View>
    );
  }

  if (loading || !prices) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00FFD1" />
        <Text style={styles.text}>Cargando precios en tiempo real...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/fondo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>CryptoPlay 🪙</Text>
        <View style={styles.card}>
          <Text style={styles.balance}>Saldo: {user.cpx_balance.toFixed(2)} CPX</Text>
          <Text style={styles.subbalance}>Valor total en criptos: {getTotalCryptoValue()} CPX</Text>
        </View>

        <Text style={styles.subtitle}>Tus criptomonedas:</Text>
        {COINS.map(({ id, symbol }) => {
          const amount = (user as any)[id];
          if (!amount || amount === 0) return null;

          return (
            <View key={id} style={styles.coinContainer}>
              <Text style={styles.coin}>{symbol}: {amount}</Text>
              <Text style={styles.coinValue}>≈ {getValueInCPX(id, amount)} CPX</Text>
            </View>
          );
        })}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/juegos/juegos')}>
          <Text style={styles.buttonText}>Juegos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  balance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FFD1',
    textAlign: 'center',
  },
  subbalance: {
    fontSize: 16,
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
    fontWeight: '600',
  },
  coinContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: '#00FFD1',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  coin: {
    fontSize: 16,
    color: '#fff',
  },
  coinValue: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#00FFD1',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 24,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});