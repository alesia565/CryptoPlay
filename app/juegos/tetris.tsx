import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';

const screenWidth = Dimensions.get('window').width;
const COLS = 10;
const ROWS = 20 ;
const BLOCK_SIZE = Math.floor(screenWidth / COLS) * 0.8;
const BASE_INTERVAL = 700;
const SPEED_STEP = 200; // cantidad que se reduce por nivel
const MIN_INTERVAL = 150;

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]]
];

function randomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

export default function TetrisGame() {
  const router = useRouter();
  const { updateBalance } = useUser();
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [current, setCurrent] = useState({ shape: randomShape(), row: 0, col: 3 });
  const [linesCleared, setLinesCleared] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(BASE_INTERVAL);
  const soundRef = useRef(null);

  // 🔁 Movimiento continuo
  const moveInterval = useRef<NodeJS.Timeout | null>(null);
  const currentRef = useRef(current);

  useEffect(() => {
    const loadMusic = async () => {
      const { sound } = await Audio.Sound.createAsync(require('./tetris.mp3'));
      soundRef.current = sound;
      await sound.playAsync();
    };
    loadMusic();
    return () => soundRef.current?.unloadAsync();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => movePiece(1, 0), speed);
    return () => clearInterval(interval);
  }, [speed, current.shape, current.row, current.col]);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const checkCollision = (shape, row, col) => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (
          shape[i][j] &&
          (row + i >= ROWS || col + j < 0 || col + j >= COLS || board[row + i][col + j])
        ) return true;
      }
    }
    return false;
  };

  const mergePiece = () => {
    const newBoard = board.map(row => [...row]);
    current.shape.forEach((r, i) => {
      r.forEach((val, j) => {
        if (val) newBoard[current.row + i][current.col + j] = 1;
      });
    });
    return newBoard;
  };

  const clearLines = (newBoard) => {
    let cleared = 0;
    const updated = newBoard.filter(row => {
      if (row.every(cell => cell === 1)) {
        cleared++;
        return false;
      }
      return true;
    });
    while (updated.length < ROWS) {
      updated.unshift(Array(COLS).fill(0));
    }
    setBoard(updated);
    return cleared;
  };

  const movePiece = (dr, dc) => {
    const newRow = current.row + dr;
    const newCol = current.col + dc;
    if (!checkCollision(current.shape, newRow, newCol)) {
      setCurrent({ ...current, row: newRow, col: newCol });
    } else if (dr === 1) {
      const newBoard = mergePiece();
      const cleared = clearLines(newBoard);
      const totalLines = linesCleared + cleared;
      const newLevel = Math.floor(totalLines / 5) + 1;
      if (newLevel > level) {
        const newSpeed = Math.max(MIN_INTERVAL, BASE_INTERVAL - SPEED_STEP * (newLevel - 1));
        setSpeed(newSpeed);
        setLevel(newLevel);
        updateBalance(10);
      }
      setLinesCleared(totalLines);
      const shape = randomShape();
      if (checkCollision(shape, 0, 3)) {
        Alert.alert('Game Over', 'Se acabó el juego.');
        router.replace('/dashboard');
        return;
      }
      setCurrent({ shape, row: 0, col: 3 });
    }
  };

  const rotatePiece = () => {
    const rotated = current.shape[0].map((_, i) => current.shape.map(row => row[i]).reverse());
    if (!checkCollision(rotated, current.row, current.col)) {
      setCurrent({ ...current, shape: rotated });
    }
  };

  // ✅ Movimiento continuo al mantener botón presionado
  const startMove = (dr, dc) => {
    movePiece(dr, dc);
    moveInterval.current = setInterval(() => {
      const c = currentRef.current;
      const newRow = c.row + dr;
      const newCol = c.col + dc;
      if (!checkCollision(c.shape, newRow, newCol)) {
        setCurrent({ ...c, row: newRow, col: newCol });
      }
    }, 100);
  };

  const stopMove = () => {
    if (moveInterval.current) {
      clearInterval(moveInterval.current);
      moveInterval.current = null;
    }
  };

  const renderBoard = () => {
    const tempBoard = board.map(row => [...row]);
    current.shape.forEach((r, i) => {
      r.forEach((val, j) => {
        if (val) tempBoard[current.row + i][current.col + j] = 2;
      });
    });
    return tempBoard.map((row, i) => (
      <View key={i} style={{ flexDirection: 'row' }}>
        {row.map((cell, j) => (
          <View
            key={j}
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              backgroundColor: cell === 0 ? '#111' : cell === 1 ? '#888' : '#0ff',
              borderWidth: 0.3,
              borderColor: '#000',
            }}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tetris CPX</Text>
      <Text style={styles.status}>Nivel: {level} | Líneas: {linesCleared} | Recompensa: {Math.floor(linesCleared / 5) * 10} CPX</Text>
      <View style={styles.board}>{renderBoard()}</View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => startMove(0, -1)}
          onPressOut={stopMove}
        >
          <Text style={styles.btnText}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={rotatePiece}
        >
          <Text style={styles.btnText}>⟳</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPressIn={() => startMove(0, 1)}
          onPressOut={stopMove}
        >
          <Text style={styles.btnText}>▶</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.btn1}
        onPressIn={() => startMove(1, 0)}
        onPressOut={stopMove}
      >
        <Text style={styles.btnText}>▼</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace('/dashboard')}
      >
        <Text style={styles.backText}>Volver al menú</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', paddingTop: 40 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  status: { fontSize: 16, color: '#fff', marginBottom: 10 },
  board: { backgroundColor: '#111', padding: 4, marginBottom: 20 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  btn: { backgroundColor: '#444', padding: 16, margin: 6, paddingVertical: 8, paddingHorizontal: 50, borderRadius: 12, minWidth: 60, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  backBtn: { position: 'absolute', top: 40, right: 300, backgroundColor: 'red', paddingHorizontal: 5, paddingVertical: 8, borderRadius: 6, zIndex: 999 },
  btn1: { position: 'absolute', top: 900, alignItems: 'center', backgroundColor: '#444', paddingHorizontal: 70, paddingVertical: 8, borderRadius: 6, zIndex: 999 },
  backText: { color: '#fff', fontWeight: 'bold' },
});
