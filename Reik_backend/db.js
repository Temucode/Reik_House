const mongoose = require("mongoose");
const Bois = require('./bois');


// Connexion à MongoDB
mongoose.connect("mongodb://localhost/reik_house", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connexion à MongoDB réussie"))
.catch(err => console.error("Erreur de connexion à MongoDB", err));

// Exemple : Ajouter un bois
async function ajouterBois() {
  const bois = new Bois({
    nom: "Chêne",
    type: "sol",
    dimensions: { longueur: 200, largeur: 20, hauteur: 2 },
    prix_m2: 50,
    quantite: 100,
    image: "https://example.com/image.jpg"
  });

  await bois.save();
  console.log("Bois ajouté :", bois);
}

ajouterBois();
