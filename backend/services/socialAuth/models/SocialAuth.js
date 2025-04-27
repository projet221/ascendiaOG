const mongoose = require("mongoose");

const SocialAuth = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, // Référence à l'utilisateur
    provider: {type: String, enum: ["facebook", "twitter", "instagram"], required: true}, // Réseau social
    accessToken: {type: String, required: true}, // Token d'accès pour API externe
    refreshToken: {type: String}, // Optionnel, utile pour rafraîchir les tokens
    secretToken: {type: String}, // Optionnel, utile pour twitter
    pages: { type: [{ name: String, id: String, accessToken: String }] },
    profile: { id:String,name:String,username: String,email:String, photo: String },
    createdAt: {type: Date, default: Date.now}
});


module.exports = mongoose.model("SocialAuth", SocialAuth);
