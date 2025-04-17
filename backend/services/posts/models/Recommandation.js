const mongoose = require('mongoose');

const recommandationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contenu: { type: String, required: true },
    date: { type: Date, default: Date.now, index: true }
});

recommandationSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Recommandation', recommandationSchema);