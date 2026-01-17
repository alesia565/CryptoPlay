import { Slot } from 'expo-router';
import UserProvider, { useUser } from './UserContext';
import { ActivityIndicator, View } from 'react-native';

function LayoutContent() {
  const { loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <LayoutContent />
    </UserProvider>
  );
}