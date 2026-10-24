import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../../context/AuthContext';

function Navigator() {
  const { token, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack>
      {!token ? (
        <Stack.Screen name="sign-in" options={{ title: 'Login' }} />
      ) : (
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      )}
      {!token ? (
        <Stack.Screen name="register" options={{ title: 'Daftar' }} />
      ) : null}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}