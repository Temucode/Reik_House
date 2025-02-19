// MODELE ENTREPTOT
const mongoose = require('mongoose');

const entrepotSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  types_de_bois: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bois' }]
});

const Entrepot = mongoose.model('Entrepot', entrepotSchema);

module.exports = Entrepot;