const mongoose = require("mongoose");

const SocialAuth = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, // Référence à l'utilisateur
    provider: {type: String, enum: ["facebook", "twitter", "instagram"], required: true}, // Réseau social
    accessToken: {type: String, required: true}, // Token d'accès pour API externe
    refreshToken: {type: String}, // Optionnel, utile pour rafraîchir les tokens
    secretToken: {type: String}, // Optionnel, utile pour twitter
    pages: [{
        name: {type: String, required: true},  // Nom de la page
        id: {type: String, required: true}     // ID de la page Facebook
    }],
    createdAt: {type: Date, default: Date.now}
});

// Ajout de la validation conditionnelle pour 'pages'
SocialAuth.path('pages').validate(function(value) {
    return value === undefined || value.length > 0;
}, 'Pages array cannot be empty.');


module.exports = mongoose.model("SocialAuth", SocialAuth);
