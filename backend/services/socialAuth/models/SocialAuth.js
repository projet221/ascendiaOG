const mongoose = require("mongoose");

const SocialAuthSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, // Référence à l'utilisateur
    provider: {type: String, enum: ["facebook", "twitter", "instagram"], required: true}, // Réseau social
    accessToken: {type: String, required: true}, // Token d'accès pour API externe
    refreshToken: {type: String}, // Optionnel, utile pour rafraîchir les tokens
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("SocialAuth", SocialAuthSchema);
