import { useEffect } from "react";

// const API_URL = "http://192.168.1.5:5000/api/bois"; // Change cette URL si tu es sur un émulateur Android
const API_URL = "http://172.20.10.12:5000/api/bois"; // Change cette URL si tu es sur un émulateur Android

useEffect(() => {
  const fetchBois = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("Données reçues :", data); // Ajoute ce log pour vérifier les données
      setBois(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des bois:", error);
    }
  };

  fetchBois();
}, []);
