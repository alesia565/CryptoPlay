import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserData = {
  email: string;
  cpx_balance: number;
  bitcoin: number;
  ethereum: number;
  dogecoin: number;
  cardano: number;
  binancecoin: number;
  ripple: number;
  solana: number;
  polkadot: number;
  polygon: number;
  litecoin: number;
  bitcoin_cash: number;
  chainlink: number;
  stellar: number;
  uniswap: number;
  avalanche: number;
  algorand: number;
  vechain: number;
  filecoin: number;
  tron: number;
  eos: number;
  trumpcoin: number;
};

type UserContextType = {
  user: UserData | null;
  setUser: (user: UserData) => void;
  updateBalance: (amount: number) => void;
  updateCoins: (coin: string, amount: number) => void;
  achievements: string[];
  unlockAchievement: (id: string) => void;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({} as UserContextType);
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<UserData | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Restaurar datos al iniciar la app
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedAchievements = await AsyncStorage.getItem('achievements');
        if (storedUser) setUserState(JSON.parse(storedUser));
        if (storedAchievements) setAchievements(JSON.parse(storedAchievements));
      } catch (err) {
        console.error('Error cargando datos persistentes', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🔹 Guardar usuario en memoria y AsyncStorage
  const setUser = async (data: UserData) => {
    setUserState(data);
    await AsyncStorage.setItem('user', JSON.stringify(data));
  };

  const updateBalance = (diff: number) => {
    setUserState((prev) => {
      if (!prev) return null;
      const updated = { ...prev, cpx_balance: prev.cpx_balance + diff };
      AsyncStorage.setItem('user', JSON.stringify(updated));
      syncWithBackend(updated);
      return updated;
    });
  };

  const updateCoins = (coin: string, amount: number) => {
    setUserState((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [coin]: (prev[coin as keyof UserData] || 0) + amount };
      AsyncStorage.setItem('user', JSON.stringify(updated));
      syncWithBackend(updated);
      return updated;
    });
  };

  const syncWithBackend = (data: UserData) => {
    fetch('http://192.168.1.130:5000/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch((err) => console.error('Error al sincronizar con backend:', err));
  };

  const unlockAchievement = (id: string) => {
    if (achievements.includes(id)) return;

    const reward = getRewardForAchievement(id);
    const message = getMessageForAchievement(id);

    const newAchievements = [...achievements, id];
    setAchievements(newAchievements);
    AsyncStorage.setItem('achievements', JSON.stringify(newAchievements));

    if (user) {
      const updatedUser = { ...user, cpx_balance: parseFloat((user.cpx_balance + reward).toFixed(2)) };
      setUser(updatedUser); // 🔹 también guarda en AsyncStorage
    }

    Alert.alert('🏆 ¡Logro desbloqueado!', `${message} +${reward} CPX`);
  };

  const getRewardForAchievement = (id: string) => {
    switch (id) {
      case 'first-buy': return 100;
      case 'buy-3': return 300;
      case 'buy-10-doge': return 200;
      case 'spend-5000': return 500;
      default: return 0;
    }
  };

  const getMessageForAchievement = (id: string) => {
    switch (id) {
      case 'first-buy': return '¡Compraste tu primera criptomoneda!';
      case 'buy-3': return '¡Llevás 3 compras!';
      case 'buy-10-doge': return '¡Compraste 10 DOGE!';
      case 'spend-5000': return '¡Gastaste más de 5000 CPX!';
      default: return '';
    }
  };

  // 🔹 Logout no borra datos
  const logout = () => {
    Alert.alert('Sesión cerrada', 'Tus datos se mantienen guardados.');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateBalance,
        updateCoins,
        achievements,
        unlockAchievement,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;