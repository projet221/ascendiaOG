const axios = require("axios");
require("dotenv").config();

const traduireMessage = async (message, langue) => {
    const prompt = `
Voici un message à traduire :
"${message}"

Traduis-le en ${langue}, dans un style naturel, fluide et adapté aux réseaux sociaux. Ne commence pas ta réponse par "Traduction :" ni aucune introduction. Ne change pas le ton du message, garde les emojis si présents.
`;

    try {
        console.log("tentative de traduction");
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
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.PROXY_GATEWAY,
                    "X-Title": "Ascendia"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Erreur de traduction IA :", error.message);
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
        console.log("tentative de correction");
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
                    "Content-Type": "application/json",
                    "HTTP-Referer": process.env.PROXY_GATEWAY,
                    "X-Title": "Ascendia"
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Erreur de correction IA :", error.message);
        throw error;
    }
};

module.exports = {
    traduireMessage,
    corrigerMessage
};
