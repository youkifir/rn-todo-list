import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// Створення клієнта Convex
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

import { Platform } from "react-native";

// Кроссплатформенный адаптер хранилища для Convex Auth
const secureStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

function RootNavigator() {
  const { isDarkMode, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <AuthLoading>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AuthLoading>

      <Unauthenticated>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack>
      </Unauthenticated>

      <Authenticated>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </Authenticated>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConvexAuthProvider client={convex} storage={secureStorage}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </ConvexAuthProvider>
    </SafeAreaProvider>
  );
}