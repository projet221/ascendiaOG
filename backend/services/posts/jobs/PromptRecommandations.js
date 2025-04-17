// jobs/generateRecommandations.js
const axios = require("axios");
const Recommandation = require("../models/Recommandation");
const Post = require("../models/Post");

// Fonction utilitaire pour comparer les dates (ignorer l'heure)
function estDateDuJour(date) {
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    const dateComparee = new Date(date);
    dateComparee.setHours(0, 0, 0, 0);
    return dateComparee.getTime() === aujourdHui.getTime();
}

// Fonction principale
async function genererRecommandations() {
    console.log("[CRON] Lancement de la génération des recommandations...");

    try {
        const { data: users } = await axios.get(`${process.env.PROXY_GATEWAY}/api/users/a`);

        for (const user of users) {
            // Vérifie si une reco a déjà été générée aujourd’hui
            const derniereReco = await Recommandation.findOne({ user_id: user._id })
            .sort({ date: -1 });

            if (derniereReco && estDateDuJour(derniereReco.date)) {
                console.log(`⏩ Recommandation déjà générée pour ${user.email}`);
                continue;
            }

            // Récupération des données nécessaires
            const { data: Posts } = Post.find({userId: user._id});

            const prompt = `
Voici les posts recuperer depuis la base de donnée avec les données analytiques :
${Posts}

Donne-moi UNE recommandation simple et concrète pour améliorer ses performances sur les réseaux sociaux aujourd'hui.
      `;

            const contenu = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "mistral/mistral-7b-instruct",
                    messages: [
                        { role: "system", content: "Tu es un expert en réseaux sociaux." },
                        { role: "user", content: prompt }
                    ]
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.CLE_API_IA}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": process.env.PROXY_GATEWAY,
                        "X-Title": "Recommandation Réseaux Sociaux"
                    }
                }
            );

            const texte = contenu.data.choices[0].message.content;

            await Recommandation.create({
                user_id: user._id,
                contenu: texte
            });

            console.log(`✅ Recommandation générée pour ${user.email}`);
        }

        console.log("[CRON] ✅ Toutes les recommandations du jour sont générées.");
    } catch (err) {
        console.error("❌ Erreur dans la génération des recommandations :", err.message || err);
    }
}

module.exports = genererRecommandations;
