const cron = require("node-cron");
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

// Tâche cron : toutes les heures
cron.schedule("0 * * * *", async () => {
    console.log("⏰ [CRON] Lancement de la génération des recommandations...");

    try {
        console.log("📡 Connexion au service utilisateur...");
        const response = await axios.post(`${process.env.PROXY_GATEWAY}/api/users/login`,
            { email: "samir@gmail.com", password: "password" },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const { data: users } = await axios.get(`${process.env.PROXY_GATEWAY}/api/users/a`, {
            headers: {
                Authorization: `Bearer ${response.data.token}`,
                "Content-Type": "application/json",
            },
        });

        console.log(`👥 ${users.length} utilisateur(s) récupéré(s).`);

        for (const user of users) {
            console.log(`\n🔍 Traitement : ${user.email}`);

            const derniereReco = await Recommandation.findOne({ user_id: user._id }).sort({ date: -1 });

            if (derniereReco && estDateDuJour(derniereReco.date)) {
                console.log("⏩ Recommandation déjà générée aujourd'hui.");
                continue;
            }

            console.log("📝 Récupération des posts...");
            const posts = await Post.find({ userId: user._id });

            if (!posts.length) {
                console.log("⚠️ Aucun post pour cet utilisateur.");
                continue;
            }

            const formattedPosts = posts.map(post => {
                return `Texte : ${post.text}\nHashtags : ${post.hashtags?.join(', ') || 'aucun'}\nEngagement : ${post.engagement || 'non précisé'}\nDate : ${post.createdAt?.toLocaleDateString() || 'inconnue'}`;
            }).join('\n\n');

            const prompt = `
Voici les posts récupérés depuis la base de données avec leurs données analytiques :
${formattedPosts}

Donne-moi UNE recommandation simple et concrète pour améliorer ses performances sur les réseaux sociaux aujourd'hui.
Ta réponse doit être en texte brut, sans mise en forme (pas de gras, pas de tirets, pas de listes, pas de markdown), en revanche tu peux intégrer des smiley pour rendre la recommandation conviviale. Ne commence pas par "Voici une recommandation :".
`;

            console.log("🧠 Envoi du prompt à OpenRouter...");
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

        console.log("\n🎉 [CRON] Recommandations générées avec succès !");
    } catch (err) {
        console.error("❌ Erreur dans la génération :", err?.response?.data || err.message || err);
    }
});

console.log("✅ Cron job de génération de recommandations démarré (chaque heure) !");
