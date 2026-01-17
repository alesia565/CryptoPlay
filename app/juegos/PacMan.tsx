import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const GRID_SIZE = 10;
const CELL_SIZE = 30;

export default function GameScreen() {
  const [position, setPosition] = useState({ x: 4, y: 4 });

  const move = (dx: number, dy: number) => {
    setPosition((prev) => {
      const newX = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + dy));
      return { x: newX, y: newY };
    });
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isPacman = x === position.x && y === position.y;
        cells.push(
          <View key={`${x}-${y}`} style={styles.cell}>
            {isPacman && (
              <Image
                source={require('./pacman.png')}
                style={styles.pacman}
              />
            )}
          </View>
        );
      }
    }
    return cells;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>{renderGrid()}</View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => move(0, -1)} style={styles.btn}><Text style={styles.btnText}>↑</Text></TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => move(-1, 0)} style={styles.btn}><Text style={styles.btnText}>←</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => move(1, 0)} style={styles.btn}><Text style={styles.btnText}>→</Text></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => move(0, 1)} style={styles.btn}><Text style={styles.btnText}>↓</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Volver')} style={styles.backBtn}>
          <Text style={styles.btnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 40,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pacman: {
    width: 25,
    height: 25,
  },
  controls: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 10,
  },
  btn: {
    backgroundColor: '#ffd700',
    padding: 15,
    borderRadius: 10,
    margin: 5,
  },
  backBtn: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});