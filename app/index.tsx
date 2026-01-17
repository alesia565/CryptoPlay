import { View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/bg_landing_final.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.buttonOverlay}>
        <TouchableOpacity style={styles.iniciar} onPress={() => router.push('/login')} />
        <TouchableOpacity style={styles.registrarse} onPress={() => router.push('/register')} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  buttonOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 120,
  },
  iniciar: {
    position: 'absolute',
    bottom: 160,
    width: 260,
    height: 50,
  },
  registrarse: {
    position: 'absolute',
    bottom: 90,
    width: 260,
    height: 50,
  },
});