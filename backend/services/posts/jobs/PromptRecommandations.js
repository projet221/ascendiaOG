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
    console.log("🚀 [CRON] Début de la génération des recommandations...");

    try {
        console.log("📡 Récupération des utilisateurs...");
        const response = await axios.post(`${process.env.PROXY_GATEWAY}/api/users/login`,
            { email: "samir@gmail.com", password: "password" },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { data: users } = await axios.get(`${process.env.PROXY_GATEWAY}/api/users/a`,
            {
                headers:{
                    Authorization: `Bearer ${response.data.token}`,
                    "Content-Type": "application/json",
                },
            }
            );
        console.log(`👥 ${users.length} utilisateur(s) trouvé(s).`);

        for (const user of users) {
            console.log(`\n🔍 Traitement de l'utilisateur : ${user.email} (${user._id})`);

            // Vérifie si une reco a déjà été générée aujourd’hui
            console.log("📅 Vérification de la dernière recommandation...");
            const derniereReco = await Recommandation.findOne({ user_id: user._id }).sort({ date: -1 });

            if (derniereReco && estDateDuJour(derniereReco.date)) {
                console.log("⏩ Recommandation déjà générée aujourd'hui, on passe.");
                continue;
            }

            // Récupération des posts
            console.log("📝 Récupération des posts de l'utilisateur...");
            const posts = await Post.find({ userId: user._id });

            if (!posts.length) {
                console.log("⚠️ Aucun post trouvé pour cet utilisateur, on passe.");
                continue;
            }

            console.log(`📦 ${posts.length} post(s) trouvé(s).`);

            // Construction du prompt avec les posts
            const formattedPosts = posts.map(post => {
                return `Texte : ${post.text}\nHashtags : ${post.hashtags?.join(', ') || 'aucun'}\nEngagement : ${post.engagement || 'non précisé'}\nDate : ${post.createdAt?.toLocaleDateString() || 'inconnue'}`;
            }).join('\n\n');

            const prompt = `
Voici les posts récupérés depuis la base de données avec leurs données analytiques :
${formattedPosts}

Donne-moi UNE recommandation simple et concrète pour améliorer ses performances sur les réseaux sociaux aujourd'hui.
`;

            console.log("🧠 Envoi du prompt au LLM...");
            const contenu = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "deepseek/deepseek-chat-v3-0324:free",
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

            console.log("💾 Sauvegarde de la recommandation...");
            await Recommandation.create({
                user_id: user._id,
                contenu: texte
            });

            console.log(`✅ Recommandation enregistrée pour ${user.email}`);
        }

        console.log("\n🎉 [CRON] ✅ Toutes les recommandations du jour ont été générées.");
    } catch (err) {
        console.error("❌ Erreur dans la génération des recommandations :", err?.response?.data || err.message || err);
    }
}

module.exports = genererRecommandations;
