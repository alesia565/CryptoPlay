import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useUser } from '../UserContext';

export default function BuyCPXScreen() {
  const { user } = useUser();

  const handlePayment = async (priceId: string) => {
    try {
      const response = await fetch('http://192.168.1.130:5000/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al iniciar pago');

      // Abre la sesión de pago de Stripe en el navegador
      await WebBrowser.openBrowserAsync(data.url);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo completar el pago.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/fondo.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Comprar CPX</Text>
        <Text style={styles.balance}>Saldo actual: {user?.cpx_balance.toFixed(2)} CPX</Text>

        <PackItem title="500 CPX - €1" onPress={() => handlePayment('price_1REpTIKwrVIm2NDS4X3V1fdK')} />
        <PackItem title="1200 CPX - €2" onPress={() => handlePayment('price_1REpTIKwrVIm2NDSYWYNL7ea')} />
        <PackItem title="3000 CPX - €5" onPress={() => handlePayment('price_1REpTIKwrVIm2NDSBTltO3Sc')} />
      </View>
    </ImageBackground>
  );
}

const PackItem = ({ title, onPress }) => (
  <View style={styles.card}>
    <Text style={styles.packText}>{title}</Text>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Comprar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 30,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  balance: {
    fontSize: 16,
    color: '#00FFD1',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  packText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#00FFD1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
});