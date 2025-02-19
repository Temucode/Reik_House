import React, { useEffect, useState, useCallback } from "react";
import { 
  View, Text, StyleSheet, Button, TextInput, Alert, Keyboard, 
  Image, ScrollView 
} from "react-native";
import { useLocalSearchParams } from "expo-router";

const API_URL = "http://172.20.10.12:5000/api/bois";
const SERVER_URL = "http://172.20.10.12:5000";

const BoisDetailScreen = () => {
  const { id, entrepotId } = useLocalSearchParams();
  console.log("📦 Bois sélectionné:", id);
  console.log("🏢 Entrepôt sélectionné:", entrepotId);

  const [bois, setBois] = useState(null);
  const [allStock, setAllStock] = useState("");
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchBois = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
        
        const data = await response.json();
        setBois(data);
        setImageUri(data.imageUrl || null);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du bois :", error);
      }
    };

    fetchBois();
  }, [id]);

  const vendreBois = useCallback(async () => {
    const quantity = Number(allStock);
    if (isNaN(quantity) || quantity < 1 || quantity > bois.all_stock) {
      Alert.alert("Quantité invalide", "Veuillez saisir une quantité valide.");
      return;
    }

    if (!bois.entrepots || bois.entrepots.length === 0) {
      Alert.alert("Erreur", "Aucun entrepôt disponible.");
      return;
    }

    const entrepot = bois.entrepots.find(e => e.entrepot_id === entrepotId);
    if (!entrepot) {
      Alert.alert("Erreur", "L'entrepôt sélectionné n'existe pas.");
      return;
    }

    const data = {
      all_stock: quantity,
      entrepot_id: entrepotId, 
    };

    console.log("📤 Envoi des données :", data);

    try {
      const response = await fetch(`${API_URL}/${id}/vendre`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      Alert.alert("Succès", result.message);

      const updatedBois = await fetch(`${API_URL}/${id}`).then(res => res.json());
      setBois(updatedBois);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Erreur lors de la vente :", error);
    }
  }, [allStock, bois, entrepotId]);

  const handleAllStockChange = useCallback((text) => {
    if (/^\d+$/.test(text) || text === "") {
      setAllStock(text);
    }
  }, []);

  if (!bois) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{bois.nom}</Text>

      {imageUri ? (
        <Image source={{ uri: `${SERVER_URL}${imageUri}` }} style={styles.image} />
      ) : (
        <Text>Pas d'image disponible</Text>
      )}

      <Text>📏 Dimensions : {bois.dimensions.longueur} m x {bois.dimensions.largeur} cm x {bois.dimensions.hauteur} cm</Text>
      <Text>💰 Prix au m² : {bois.prix_m2} ₮ /m² </Text>
      <Text>🏢 Block : {bois.block} m²</Text>
      <Text>📦 Stock total : {bois.all_stock}</Text>

      <Text>🏬 **Stocks par entrepôt** :</Text>
      {bois.entrepots.length > 0 ? (
        bois.entrepots.map((entrepot, index) => (
          <Text key={index}>
            - Entrepôt {index + 1}: {entrepot.stock_local} unités
          </Text>
        ))
      ) : (
        <Text>Aucun stock disponible.</Text>
      )}

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={allStock}
        placeholder="Quantité à vendre"
        onChangeText={handleAllStockChange}
      />

      <View style={styles.buttonContainer}>
        <Button title="Vendre" onPress={vendreBois} color="#d9534f" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    width: 120,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default BoisDetailScreen;
