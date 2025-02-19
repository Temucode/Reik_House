import React, { useEffect, useState, useCallback } from "react";
import { 
  View, Text, TouchableOpacity, FlatList, StyleSheet, 
  Image, RefreshControl, ActivityIndicator, TextInput
} from "react-native";
import { useRouter } from "expo-router"; 
import Icon from "react-native-vector-icons/FontAwesome"; 

// const API_URL = "http://192.168.1.5:5000/api/entrepots";
const API_URL = "http://172.20.10.12:5000/api/entrepots";

// const SERVER_URL = "http://192.168.1.5:5000"; // Mets ici ton adresse IP locale
const SERVER_URL = "http://172.20.10.12:5000"; // Mets ici ton adresse IP locale

const HomePage = () => {
  const [entrepots, setEntrepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);  
  const router = useRouter(); 

  // 🔄 Fonction pour récupérer les entrepôts
  const fetchEntrepots = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
  
      setEntrepots(data.map((entrepot) => ({
        id: entrepot._id,
        nom: entrepot.nom,
        ouvert: false,
        bois: entrepot.types_de_bois.map(bois => {
          const stockLocal = bois.entrepots?.find(e => e.entrepot_id === entrepot._id)?.stock_local || 0;
          return {
            ...bois,
            stock_local: stockLocal
          };
        }),        
      })));    
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des entrepôts:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchEntrepots();
  }, []);

  // 🔄 Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntrepots();
    setRefreshing(false);
  };

  // 🔽 Fonction pour ouvrir/fermer un entrepôt (évite les doubles clics)
  const toggleDropdown = useCallback((entrepotId) => {
    setEntrepots((prev) =>
      prev.map((entrepot) =>
        entrepot.id === entrepotId
          ? { ...entrepot, ouvert: !entrepot.ouvert }
          : entrepot
      )
    );
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Entrepôts</Text>
      {/* Spinner de chargement */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : (
        <FlatList
          data={entrepots}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item: entrepot }) => (
            <View>
              <TouchableOpacity
                style={styles.entrepotButton}
                onPress={() => toggleDropdown(entrepot.id)}
              >
                <Text style={styles.entrepotText}>{entrepot.nom}</Text>
                <Icon
                  name={entrepot.ouvert ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="white"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
              {entrepot.ouvert && (
                <FlatList
                  data={entrepot.bois}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.boisCard}
                      onPress={() => router.push(`/BoisDetailScreen?id=${item._id}&entrepotId=${entrepot.id}`)}
                    >
                      <Text style={styles.boisNom}>{item.nom}</Text>

                      {/* Alerte si stock bas */}
                      {item.stock_local < 100 && (
                        <Icon name="exclamation-triangle" size={30} color="red" style={styles.alertIcon} />
                      )}

                      {/* Image du bois */}
                      {item.imageUrl ? (
                        <Image source={{ uri: `${SERVER_URL}${item.imageUrl}` }} style={styles.image} />
                      ) : (
                        <Text>Pas d'image disponible</Text>
                      )}

                      {/* Dimensions */}
                      {item.dimensions ? (
                        <Text style={styles.boisDimensions}>
                          Dimensions : {item.dimensions.longueur} m x {item.dimensions.largeur} cm x {item.dimensions.hauteur} cm
                        </Text>
                      ) : (
                        <Text style={styles.boisDimensions}>Dimensions non disponibles</Text>
                      )}

                      <Text style={styles.boisPrix_m2}>Price : {item.prix_m2} ₮ /m²</Text>
                      {item.block && item.nom !== "Хавтан" && item.nom !== "Банз" && (
                        <Text style={styles.boisBlock}>Block : {item.block} m²</Text>
                      )}
                      <Text style={styles.boisAllStock}>Stock local : {item.stock_local} unités</Text>
                    </TouchableOpacity> 
                  )}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  entrepotButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entrepotText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  arrowIcon: {
    marginLeft: 10,
  },
  boisCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    gap: 5,
  },
  alertIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  boisNom: {
    fontSize: 16,
    fontWeight: "500",
  },
  boisDimensions: {
    fontSize: 14,
    color: "#555",
  },
  boisPrix_m2: {
    fontSize: 14,
    color: "#555",
  },
  boisBlock: {
    fontSize: 14,
    color: "#007bff",
  },
  boisAllStock: {
    fontSize: 14,
    color: "#555",
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 5,
  },
  loader: {
    marginTop: 50,
  },
  
});

export default HomePage;
