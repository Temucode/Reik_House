// src/app/_layout.tsx
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
// import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <View style={styles.container}>
      {/* Gestion des écrans */}
      <Stack>
        <Stack.Screen name="index" options={{ title: "Accueil" }} />
        <Stack.Screen name="BoisDetailScreen" options={{ title: "Détails du bois" }} />
        <Stack.Screen name="login" options={{ title: "Connexion" }} />
        <Stack.Screen name="register" options={{ title: "Inscription" }} />
        <Stack.Screen name="graphique" options={{ title: "Graphique des ventes" }} />
      </Stack>

      {/* Navbar en bas */}
      {/* <Navbar /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
