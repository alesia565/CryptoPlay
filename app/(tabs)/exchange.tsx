import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '../UserContext';
import axios from 'axios';

const EUR_TO_CPX = 10;

const COINS = [
  'bitcoin', 'ethereum', 'dogecoin', 'trumpcoin', 'cardano', 'binancecoin',
  'ripple', 'solana', 'polkadot', 'polygon', 'litecoin', 'bitcoin_cash',
  'chainlink', 'stellar', 'uniswap', 'avalanche', 'algorand', 'vechain',
  'filecoin', 'tron', 'eos'
];

export default function ExchangeScreen() {
  const { user, updateCoins, updateBalance } = useUser();
  const [prices, setPrices] = useState<any>({});
  const [fromCoin, setFromCoin] = useState('bitcoin');
  const [toCoin, setToCoin] = useState('ethereum');
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    const ids = COINS.join(',');
    axios
      .get('https://api.coingecko.com/api/v3/simple/price', {
        params: { ids, vs_currencies: 'eur' },
      })
      .then((res) => setPrices(res.data))
      .catch(() => Alert.alert('Error', 'No se pudieron obtener los precios'));
  }, []);

  const handleExchange = () => {
    if (!user || !(user as any)[fromCoin] || (user as any)[fromCoin] < amount) {
      Alert.alert('Error', 'No tenés suficientes fondos');
      return;
    }

    const fromPrice = prices[fromCoin]?.eur || 0;
    const toPrice = toCoin === 'CPX' ? 1 : prices[toCoin]?.eur || 0;

    const fromValue = fromPrice * amount;
    const receivedAmount = toCoin === 'CPX'
      ? fromValue * EUR_TO_CPX
      : fromValue / toPrice;

    updateCoins(fromCoin, -amount);
    if (toCoin === 'CPX') {
      updateBalance(receivedAmount);
    } else {
      updateCoins(toCoin, receivedAmount);
    }

    Alert.alert('Intercambio exitoso', `Recibiste ${receivedAmount.toFixed(2)} ${toCoin}`);
  };

  return (
    <ImageBackground
      source={require('../../assets/fondo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Intercambiar Criptomonedas</Text>

        <Text style={styles.label}>Desde:</Text>
        <Picker
          selectedValue={fromCoin}
          onValueChange={setFromCoin}
          style={styles.picker}
          dropdownIconColor="#00FFD1"
        >
          {COINS.map((coin) => (
            <Picker.Item key={coin} label={coin} value={coin} />
          ))}
        </Picker>

        <Text style={styles.label}>Hacia:</Text>
        <Picker
          selectedValue={toCoin}
          onValueChange={setToCoin}
          style={styles.picker}
          dropdownIconColor="#00FFD1"
        >
          {COINS.map((coin) => (
            <Picker.Item key={coin} label={coin} value={coin} />
          ))}
          <Picker.Item label="CPX" value="CPX" />
        </Picker>

        <TouchableOpacity style={styles.button} onPress={handleExchange}>
          <Text style={styles.buttonText}>Intercambiar 1 unidad</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 80,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    color: '#00FFD1',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#d0d7dd',
    borderRadius: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00FFD1',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});