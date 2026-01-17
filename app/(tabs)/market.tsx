import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useUser } from '../UserContext';
import axios from 'axios';

const EUR_TO_CPX = 10;

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'trampcoin', name: 'OFFICIAL TRUMP', symbol: 'TRUMP' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
  { id: 'ripple', name: 'Ripple', symbol: 'XRP' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI' },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX' },
  { id: 'algorand', name: 'Algorand', symbol: 'ALGO' },
  { id: 'vechain', name: 'VeChain', symbol: 'VET' },
  { id: 'filecoin', name: 'Filecoin', symbol: 'FIL' },
  { id: 'tron', name: 'TRON', symbol: 'TRX' },
  { id: 'eos', name: 'EOS', symbol: 'EOS' },
];

export default function MarketScreen() {
  const { user, updateBalance, updateCoins, unlockAchievement } = useUser();
  const [prices, setPrices] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = COINS.map((c) => c.id).join(',');
    axios
      .get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids,
          vs_currencies: 'eur',
        },
      })
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

  const handleBuy = (coinId: string, eurPrice: number, symbol: string) => {
    const cpxCost = eurPrice * EUR_TO_CPX;

    if (!user || user.cpx_balance < cpxCost) {
      Alert.alert('Saldo insuficiente', 'No tenés suficientes CPX.');
      return;
    }

    updateBalance(-cpxCost);
    updateCoins(coinId, 1);
    unlockAchievement('first-buy');

    Alert.alert('Compra exitosa', `Compraste 1 ${symbol} por ${cpxCost.toFixed(2)} CPX`);
  };

  if (!user) {
    return (
      <View style={styles.container}><Text style={{ color: '#fff' }}>No hay sesión activa</Text></View>
    );
  }

  if (loading || !prices) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00FFD1" />
        <Text style={{ color: '#00FFD1', marginTop: 20 }}>Cargando precios...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/fondo.jpg')} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>🛒 Mercado Cripto</Text>
        <Text style={styles.balance}>Saldo: {user.cpx_balance.toFixed(2)} CPX</Text>

        {COINS.map(({ id, name, symbol }) => {
          const coinPrice = prices[id]?.eur;
          if (!coinPrice) return null;

          const cpxCost = coinPrice * EUR_TO_CPX;

          return (
            <View key={id} style={styles.card}>
              <Text style={styles.coin}>{name} ({symbol})</Text>
              <Text style={styles.coinDetail}>€{coinPrice.toFixed(2)} → {cpxCost.toFixed(2)} CPX</Text>
              <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(id, coinPrice, symbol)}>
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#00FFD1',
  },
  balance: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
  },
  coin: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  coinDetail: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#00FFD1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
