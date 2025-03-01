const SocialAuth = require("../models/SocialAuth");

exports.handleSocialAuth = async (req, res) => {
    const {user_id, provider, accessToken, refreshToken} = req.body;

    if (!user_id || !provider || !accessToken) {
        return res.status(400).json({error: "Données manquantes"});
    }

    try {
        await SocialAuth.findOneAndUpdate(
            {user: user_id, provider},
            {accessToken, refreshToken},
            {upsert: true, new: true}
        );

        res.json({message: `${provider} connecté avec succès !`});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erreur lors de l'enregistrement du token"});
    }
};

exports.getUserSocials = async (req, res) => {
    try {
        const userSocials = await SocialAuth.find({user: req.user.id});
        res.json(userSocials);
    } catch (error) {
        res.status(500).json({error: "Erreur lors de la récupération des réseaux sociaux"});
    }
};
