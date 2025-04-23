const axios = require("axios");

const traduireMessage = async (message, langue) => {
    const prompt = `
Voici un message à traduire :
"${message}"

Traduis-le en ${langue}, dans un style naturel, fluide et adapté aux réseaux sociaux. Ne commence pas ta réponse par "Traduction :" ni aucune introduction. Ne change pas le ton du message, garde les emojis si présents.
`;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [
                    { role: "system", content: "Tu es un traducteur expert en communication sociale." },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.CLE_API_IA}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        throw error;
    }
};

const corrigerMessage = async (message) => {
    const prompt = `
Corrige le message suivant pour qu'il soit sans faute, clair et engageant sur les réseaux sociaux :
"${message}"

Ne change pas l’intention du message, garde les emojis et ne donne que le texte corrigé, sans aucune explication ni introduction.
`;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [
                    { role: "system", content: "Tu es un assistant spécialisé dans la rédaction pour les réseaux sociaux." },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.CLE_API_IA}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        throw error;
    }
};


const getSentiment = async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await axios.get(`${process.env.PROXY_GATEWAY}/api/socialauth/tokens/${userId}`);
        const socialAccounts = response.data;
        let allComments = [];

        const fetchFacebookComments = async (account) => {
            const pageFetches = account.pages.map(async (page) => {
                const postsRes = await axios.get(
                    `https://graph.facebook.com/v18.0/${page.id}/posts?access_token=${page.accessToken}`
                );

                const commentsPerPost = await Promise.all(postsRes.data.data.map(async (post) => {
                    const commentsRes = await axios.get(
                        `https://graph.facebook.com/v18.0/${post.id}/comments?access_token=${page.accessToken}`
                    );
                    return commentsRes.data.data.map(c => c.message);
                }));

                return commentsPerPost.flat();
            });

            const result = await Promise.all(pageFetches);
            return result.flat();
        };

        const fetchInstagramComments = async (account) => {
            const igAccountId = account.profile.id;

            const postsRes = await axios.get(
                `https://graph.facebook.com/v18.0/${igAccountId}/media?fields=id,caption&access_token=${account.accessToken}`
            );

            const commentsPerPost = await Promise.all(postsRes.data.data.map(async (media) => {
                const commentsRes = await axios.get(
                    `https://graph.facebook.com/v18.0/${media.id}/comments?access_token=${account.accessToken}`
                );
                return commentsRes.data.data.map(c => c.text);
            }));

            return commentsPerPost.flat();
        };

        /*const fetchTwitterComments = async (account) => {
            const { accessToken, secretToken } = account;

            // ⚠️ Pour que ça fonctionne : utiliser une lib OAuth 1.0a comme `oauth-1.0a` + `axios`
            // Ici on suppose une abstraction `twitterClient.getReplies(...)`

            const comments = await twitterClient.getReplies({
                accessToken,
                accessSecret: secretToken,
                screenName: account.profile.username
            });

            return comments; // liste de textes
        };*/

        // Exécute tous les fetchs en parallèle
        const fetchTasks = socialAccounts.map(async (account) => {
            switch (account.provider) {
                case 'facebook':
                    return await fetchFacebookComments(account);
                case 'instagram':
                    return await fetchInstagramComments(account);
                /*case 'twitter':
                    return await fetchTwitterComments(account);*/
                default:
                    return [];
            }
        });

        const commentsBySource = await Promise.all(fetchTasks);
        allComments = commentsBySource.flat();

        // Analyse de sentiment via OpenRouter
        const aiResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: "Tu es une IA d'analyse de sentiments. On va t'envoyer une liste de commentaires. Retourne uniquement un nombre de 1 à 10 indiquant le niveau général de satisfaction des utilisateurs."
                },
                {
                    role: 'user',
                    content: JSON.stringify(allComments)
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.CLE_API_IA}`,
                'Content-Type': 'application/json'
            }
        });

        const score = parseInt(aiResponse.data.choices[0].message.content);
        res.json({ sentimentScore: score });

    } catch (error) {
        console.error('Erreur analyse sentiments :', error.message || error);
        res.status(500).json({ error: "Erreur durant l'analyse de sentiments." });
    }
};
module.exports = {
    traduireMessage,
    corrigerMessage,
    getSentiment
};
