const express = require('express');
const mongoose = require('mongoose');
const Bois = require('./models/bois'); // Assure-toi que le chemin est correct
const entrepotRoutes = require('./routes/entrepots'); // Vérifie le bon chemin
const boisRoutes = require("./routes/bois"); // Import de la route
const transactionsRoutes = require("./routes/transactions");
const cors = require('cors');
const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());

const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/reik_house', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

app.get('/api/bois', async (req, res) => {
  try {
    const bois = await Bois.find();
    res.json(bois);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/bois/:id', async (req, res) => {
  try {
    console.log(`🔍 Requête reçue pour le bois ID : ${req.params.id}`);

    const bois = await Bois.findById(req.params.id);
    if (!bois) {
      console.log("⚠️ Bois non trouvé !");
      return res.status(404).json({ message: "Bois non trouvé" });
    }

    console.log("✅ Bois trouvé :", bois);
    res.json(bois);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du bois :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post('/api/bois/:id/vendre', async (req, res) => {
  const { all_stock, entrepot_id } = req.body; // Récupération de l'entrepôt et quantité à vendre

  // Vérification des données reçues
  if (!entrepot_id || all_stock === undefined) {
    return res.status(400).json({ message: "Données invalides. Veuillez fournir 'entrepot_id' et 'all_stock'." });
  }

  try {
    const bois = await Bois.findById(req.params.id);
    if (!bois) {
      return res.status(404).json({ message: "Bois non trouvé" });
    }

    // Trouver l'entrepôt correspondant
    const entrepotIndex = bois.entrepots.findIndex(e => e.entrepot_id.toString() === entrepot_id);
    if (entrepotIndex === -1) {
      return res.status(404).json({ message: "Entrepôt non trouvé" });
    }

    const entrepot = bois.entrepots[entrepotIndex];

    // Vérification du stock
    if (all_stock <= 0) {
      return res.status(400).json({ message: "La quantité doit être supérieure à zéro." });
    }
    if (all_stock > entrepot.stock_local) {
      return res.status(400).json({ message: `Stock insuffisant dans cet entrepôt (${entrepot.stock_local} disponibles).` });
    }

    // Mise à jour du stock local et global
    bois.entrepots[entrepotIndex].stock_local -= all_stock;
    bois.all_stock -= all_stock;

    // Sauvegarde dans la base de données
    await bois.save();

    res.json({
      message: `Vente réussie ! Stock global restant : ${bois.all_stock}, Stock restant dans l'entrepôt : ${bois.entrepots[entrepotIndex].stock_local}`,
      bois,
    });

  } catch (error) {
    console.error("Erreur lors de la vente :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.use('/api/entrepots', entrepotRoutes);

app.use("/api/bois", boisRoutes); // Utilisation de la route

console.log("Transactions route chargée!");
app.use("/api/transactions", transactionsRoutes);

// Servir les fichiers statiques depuis 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
