import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ImageBackground, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completá todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.130:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { Alert.alert('Error', 'Respuesta inválida'); return; }

      if (!response.ok) { Alert.alert('Error', data.error || 'Credenciales incorrectas'); return; }

      const usuario = {
        email: data.usuario?.email || email,
        cpx_balance: Number(data.usuario?.cpx_balance || data.cpx || 0),
        bitcoin: Number(data.usuario?.bitcoin || 0),
        ethereum: Number(data.usuario?.ethereum || 0),
        dogecoin: Number(data.usuario?.dogecoin || 0),
        cardano: Number(data.usuario?.cardano || 0),
        binancecoin: Number(data.usuario?.binancecoin || 0),
        ripple: Number(data.usuario?.ripple || 0),
        solana: Number(data.usuario?.solana || 0),
        polkadot: Number(data.usuario?.polkadot || 0),
        polygon: Number(data.usuario?.polygon || 0),
        litecoin: Number(data.usuario?.litecoin || 0),
        bitcoin_cash: Number(data.usuario?.bitcoin_cash || 0),
        chainlink: Number(data.usuario?.chainlink || 0),
        stellar: Number(data.usuario?.stellar || 0),
        uniswap: Number(data.usuario?.uniswap || 0),
        avalanche: Number(data.usuario?.avalanche || 0),
        algorand: Number(data.usuario?.algorand || 0),
        vechain: Number(data.usuario?.vechain || 0),
        filecoin: Number(data.usuario?.filecoin || 0),
        tron: Number(data.usuario?.tron || 0),
        eos: Number(data.usuario?.eos || 0),
        trumpcoin: Number(data.usuario?.trumpcoin || 0),
      };

      setUser(usuario); // memoria
      await AsyncStorage.setItem('user', JSON.stringify(usuario)); // persistencia

      Alert.alert('Éxito', data.mensaje || 'Login correcto');
      router.replace('/dashboard');

    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
      console.error(err);
    }
  };

  return (
    <ImageBackground source={require('../assets/bg_crypto.jpg')} style={styles.background} resizeMode="cover">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
              style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#ccc"
              keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail}
            />

            <TextInput
              style={styles.input} placeholder="Contraseña" placeholderTextColor="#ccc"
              secureTextEntry value={password} onChangeText={setPassword}
              onSubmitEditing={handleLogin} returnKeyType="done"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>Volver atrás</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'flex-end', padding: 20 },
  loginContainer: { backgroundColor: 'rgba(0, 0, 0, 0.55)', borderRadius: 20, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { height: 48, borderWidth: 1, borderColor: '#00FFD1', backgroundColor: '#1c1c1c', borderRadius: 10, paddingHorizontal: 15, color: '#fff', marginBottom: 15 },
  button: { backgroundColor: '#00FFD1', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 5 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  backText: { color: '#00FFD1', textAlign: 'center', marginTop: 15, textDecorationLine: 'underline' },
});