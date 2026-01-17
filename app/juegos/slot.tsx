import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';

const symbols = ['🍒', '🍋', '🍉', '🍇', '🍊', '⭐'];

export default function SlotScreen() {
  const router = useRouter();
  const { user, updateBalance } = useUser();
  const [slots, setSlots] = useState(['❓', '❓', '❓']);
  const [spinning, setSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const spinValue = useState(new Animated.Value(0))[0];

  const spin = () => {
    if (!user || spinning) return;

    const cost = 20;
    if (user.cpx_balance < cost) {
      alert('Sin saldo suficiente.');
      return;
    }

    setSpinning(true);
    updateBalance(-cost);
    setWinAmount(0);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      const newSlots = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];
      setSlots(newSlots);
      setSpinning(false);
      spinValue.setValue(0);

      // Calcular ganancia
      if (newSlots[0] === newSlots[1] && newSlots[1] === newSlots[2]) {
        setWinAmount(100);
        updateBalance(100);
      } else if (
        newSlots[0] === newSlots[1] ||
        newSlots[1] === newSlots[2] ||
        newSlots[0] === newSlots[2]
      ) {
        setWinAmount(20);
        updateBalance(20);
      }
    });
  };

  const spinAnimation = {
    transform: [
      {
        rotateX: spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })
      }
    ]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>Saldo: {user?.cpx_balance.toFixed(2)} CPX</Text>
      <View style={styles.slotContainer}>
        {slots.map((symbol, idx) => (
          <Animated.View key={idx} style={[styles.slot, spinAnimation]}>
            <Text style={styles.symbol}>{symbol}</Text>
          </Animated.View>
        ))}
      </View>
      <Text style={styles.win}>Ganancia: {winAmount} CPX</Text>
      <TouchableOpacity style={styles.spinBtn} onPress={spin} disabled={spinning}>
        <Text style={styles.spinText}>{spinning ? 'Girando...' : 'GIRAR (20 CPX)'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    paddingTop: 80,
  },
  balance: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 30,
  },
  slotContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  slot: {
    backgroundColor: '#222',
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
    minWidth: 80,
    alignItems: 'center',
  },
  symbol: {
    fontSize: 48,
  },
  win: {
    color: '#0f0',
    fontSize: 20,
    marginBottom: 20,
  },
  spinBtn: {
    backgroundColor: '#DAA520',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 30,
  },
  spinText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  backBtn: {
    backgroundColor: '#555',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
