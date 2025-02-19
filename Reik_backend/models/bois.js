const mongoose = require('mongoose');

const boisSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dimensions: {
    longueur: Number,
    largeur: Number,
    hauteur: Number
  },
  prix_m2: Number,
  all_stock: Number,
  block: Number,
  imageUrl: { type: String }, // Ajout du champ image
  entrepots: [{
    entrepot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepot' },
    stock_local: { type: Number, required: true } //Stock spécifique à l'entrepôt
  }]
});

const Bois = mongoose.model('Bois', boisSchema);

module.exports = Bois;
