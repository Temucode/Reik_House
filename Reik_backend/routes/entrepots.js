const express = require('express');
const router = express.Router();
const Entrepot = require('../models/entrepot'); // Assure-toi que le chemin est bon

// Récupérer tous les entrepôts avec les détails des bois associés
router.get('/', async (req, res) => {
    try {
        const entrepots = await Entrepot.find().populate('types_de_bois'); // Ajout du .populate()
        res.json(entrepots);
    } catch (error) {
        console.error('Erreur lors de la récupération des entrepôts:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
