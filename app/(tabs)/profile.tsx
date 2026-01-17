import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
  { id: 'bitcoin_cash', symbol: 'BCH' },
  { id: 'chainlink', symbol: 'LINK' },
  { id: 'stellar', symbol: 'XLM' },
  { id: 'uniswap', symbol: 'UNI' },
  { id: 'avalanche', symbol: 'AVAX' },
  { id: 'algorand', symbol: 'ALGO' },
  { id: 'vechain', symbol: 'VET' },
  { id: 'filecoin', symbol: 'FIL' },
  { id: 'tron', symbol: 'TRX' },
  { id: 'eos', symbol: 'EOS' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = COINS.map((c) => c.id).join(',');
    axios
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur`)
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
    if (!prices || !user) return '0.00';
    return COINS.reduce((acc, { id }) => {
      const amount = (user as any)[id] || 0;
      const price = prices[id]?.eur || 0;
      return acc + amount * price * EUR_TO_CPX;
    }, 0).toFixed(2);
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Sesión cerrada');
    router.replace('/');
  };

  const renderCoins = () => {
    return COINS.map(({ id, symbol }) => {
      const amount = (user as any)[id];
      if (!amount || amount === 0) return null;

      const value = prices?.[id]?.eur
        ? (amount * prices[id].eur * EUR_TO_CPX).toFixed(2)
        : '0.00';

      return (
        <View key={id} style={styles.coinContainer}>
          <Text style={styles.text}>- {symbol}: {amount}</Text>
          <Text style={styles.coinValue}>≈ {value} CPX</Text>
        </View>
      );
    });
  };

  if (!user || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FFD1" />
        <Text style={styles.text}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/fondo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>CryptoPlay 🪙</Text>
        <Text style={styles.balance}>Saldo: {user.cpx_balance.toFixed(2)} CPX</Text>
        <Text style={styles.subbalance}>Valor en cripto: {getTotalCryptoValue()} CPX</Text>

        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.text}>{user.email}</Text>

        <Text style={styles.label}>Tus criptomonedas:</Text>
        {renderCoins()}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/achievements')}>
          <Text style={styles.buttonText}>Ver Logros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    padding: 24,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  balance: {
    color: '#00FFD1',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subbalance: {
    color: '#4caf50',
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    marginTop: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 5,
  },
  coinContainer: {
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  coinValue: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#00FFD1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
