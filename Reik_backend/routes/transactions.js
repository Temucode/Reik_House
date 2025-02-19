const express = require("express");
const router = express.Router();
const Bois = require("../models/bois");

// 🔹 Route pour effectuer une vente ou une réservation
router.post("/", async (req, res) => {
    try {
        const { bois_id, quantite, type } = req.body; // type = "vente" ou "reservation"

        // Vérifier si le bois existe
        const bois = await Bois.findById(bois_id);
        if (!bois) {
            return res.status(404).json({ message: "Bois non trouvé" });
        }

        // Vérifier si la quantité demandée est disponible
        if (bois.quantite < quantite) {
            return res.status(400).json({ message: "Stock insuffisant" });
        }

        // Mettre à jour la quantité disponible
        bois.quantite -= quantite;
        await bois.save();

        res.status(200).json({ message: `${type} réussie`, bois });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
