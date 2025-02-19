const express = require("express");
const router = express.Router();
const Bois = require("../models/bois"); // Assure-toi d'avoir ce modèle
const multer = require("multer");
const path = require("path");

// Route pour gérer une transaction (vente ou réservation)
router.post("/transaction", async (req, res) => {
  try {
    const { boisId, quantite, type } = req.body;

    console.log(`🔍 Requête reçue pour le bois ID : ${boisId}`);

    // Vérifier si le bois existe
    const bois = await Bois.findById(boisId);
    if (!bois) {
      return res.status(404).json({ message: "Bois non trouvé" });
    }

    // Vérifier le type de transaction
    if (type === "vente") {
      if (bois.quantite < quantite) {
        return res.status(400).json({ message: "Stock insuffisant" });
      }
      bois.quantite -= quantite;
    } else if (type === "reservation") {
      bois.quantite_reservee = (bois.quantite_reservee || 0) + quantite;
    } else {
      return res.status(400).json({ message: "Type de transaction invalide" });
    }

    await bois.save();
    res.json({ message: "Transaction réussie", bois });

  } catch (error) {
    console.error("❌ Erreur transaction :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Stocke les images dans le dossier 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique
  },
});

const upload = multer({ storage });

// Route pour uploader une image
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier uploadé" });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

module.exports = router;
