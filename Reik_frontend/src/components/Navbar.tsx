// src/components/Navbar.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Link href="/" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>Accueil</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/graphique" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>Graphique</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#333",
    paddingVertical: 15,
  },
  link: {
    color: "white",
    fontSize: 18,
  },
});
