// app/juegos/juegos.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const JuegosScreen = () => {
  const router = useRouter();

  return (
    <ImageBackground source={require('../../assets/fondo.jpg')} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Elige tu juego</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/juegos/tetris')}>
          <Text style={styles.buttonText}>Jugar Tetris</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/juegos/slot')}>
          <Text style={styles.buttonText}>Jugar Tragamonedas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/juegos/PacMan')}>
          <Text style={styles.buttonText}>Pac-Man</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonBack} onPress={() => router.push('/dashboard')}>
          <Text style={styles.backText}>Volver atrás</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 40,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: '#00FFFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonBack: {
    backgroundColor: '#FF0044',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
    width: '70%',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JuegosScreen;