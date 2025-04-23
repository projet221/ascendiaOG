const cron = require("node-cron");
const Post = require("../models/Post");
const axios = require("axios");
const { TwitterApi } = require("twitter-api-v2");
const { tweetWithImage} = require("../controllers/twitter/functions");
const {join} = require("node:path");
const fs = require("fs");
const sharp = require("sharp");
  // Service qui publie le post

// Tâche cron exécutée toutes les minutes
cron.schedule("* * * * *", async () => {
    console.log("🔄 Vérification des posts planifiés...");

    const now = new Date();  // Date actuelle en UTC
    now.setHours(now.getHours() + 2);  // Ajouter 1 heure pour passer à GMT+1

    try {
        // Trouver les posts dont la date de publication est dépassée et qui ne sont pas encore publiés
        const postsToPublish = await Post.find({
            scheduledFor: { $lte: now },
            status: "scheduled",
        });
        console.log(`il est ${now} .\n voici les posts retourner : ${postsToPublish}`);
        for (const post of postsToPublish) {
            try {
                console.log("des posts sont en attente");
                //console.log(`🚀 Publication du post ${post._id} sur ${post.platforms}`);
                const userId = post.userId;
                let fileBuffer = null;
                let mimeType = null;
                const message = post.content;
                if(post.mediaFiles && post.mediaFiles.length >0){
                    fileBuffer = post.mediaFiles[0].data;
                    mimeType = post.mediaFiles[0].contentType;

                    const uploadDir = join(__dirname, 'uploads');

                    // Vérifier si le dossier existe, sinon le créer
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }

                    // Définir le chemin du fichier converti en JPEG
                    const uploadPath = join(uploadDir, post._id+".jpeg");

                    // Conversion en JPEG avant la sauvegarde
                    sharp(fileBuffer)
                    .jpeg({ quality: 90 })  // Qualité de compression de l'image
                    .toFile(uploadPath, (err, info) => {
                        if (err) {
                            console.error('Erreur lors de la conversion et de la sauvegarde de l\'image:', err);
                            return;
                        }

                        console.log('Image convertie et sauvegardée avec succès:', info);
                    });


                }

                console.log(`Url a la quelle on fait la requete : ${process.env.PROXY_GATEWAY+`/api/socialauth/tokens/${userId}`} `);
                const response = await axios.get(process.env.PROXY_GATEWAY+`/api/socialauth/tokens/${userId}`);
                const tokens = response.data;

                for (const network of post.platform) {
                    console.log("tentative de publication sur : ", network);
                    switch (network) {
                        case "twitter":
                            const twitterTokens = tokens.find(item => item.provider === "twitter");
                            if (twitterTokens) {
                                const client = new TwitterApi({
                                    appKey: process.env.TWITTER_KEY,
                                    appSecret: process.env.TWITTER_SECRET,
                                    accessToken: twitterTokens.accessToken,
                                    accessSecret: twitterTokens.secretToken,
                                });
                                const twitterClient = client.readWrite;
                                console.log(`Envoi à Twitter avec message : ${message}`);

                                await tweetWithImage(fileBuffer, mimeType, message, twitterClient);
                            }
                            break;

                        case "facebook":
                            console.log("facebook test ");
                            const facebookTokens = tokens.find(item => item.provider === "facebook");

                            if (facebookTokens) {
                                const pageId = facebookTokens.pages[0].id; // ID de la page Facebook
                                const accessToken = facebookTokens.pages[0].accessToken; // Le token d'accès de la page
                                console.log("page id : ", pageId);
                                console.log("access token : ", accessToken);
                                if (fileBuffer) {
                                    // Si tu veux publier une photo
                                    const formData = new FormData();
                                    formData.append('message', message);
                                    formData.append('url', `${process.env.PROXY_POSTS}/uploads/${post._id+".jpeg"}`);
                                    formData.append('access_token', accessToken);
                                    console.log(formData);
                                    try {
                                        const response = await axios.post(
                                            `https://graph.facebook.com/${pageId}/photos`, // Endpoint de publication sur la page
                                            formData, // Corps de la requête (les données)
                                            { headers: { 'Content-Type': 'multipart/form-data' } } // En-tête nécessaire pour envoyer des fichiers
                                        );
                                        console.log('Photo publiée avec succès', response.data);
                                    } catch (err) {
                                        console.error('Erreur lors de la publication de la photo', err);
                                    }
                                } else {
                                    // Si tu veux publier juste un message
                                    try {
                                        const response = await axios.post(
                                            `https://graph.facebook.com/${pageId}/feed`, // Endpoint de publication sur la page
                                            {
                                                message: message, // Message à publier
                                                access_token: accessToken // Token d'accès de la page
                                            }
                                        );
                                        console.log('Message publié avec succès', response.data);
                                    } catch (err) {
                                        console.error('Erreur lors de la publication du message', err);
                                    }
                                }
                            }
                            console.log("pas d'erreur de facebook");
                            break;


                        case "instagram":
                            const instagramTokens = tokens.find(item => item.provider === "instagram");
                            if (!fileBuffer) {
                                console.error("Instagram requiert une image pour publier.");
                            }

                            // Si le réseau social est Instagram, on convertit l'image en JPEG
                            if (instagramTokens) {

                                // Étape 1 : Créer un media
                                console.log("voici le accesstoken IG : ", instagramTokens.accessToken);
                                console.log("voici le userid du compte instagram : ",instagramTokens.profile.id)
                                console.log("\nurl de l'image : ",`${process.env.PROXY_POSTS}/uploads/${post._id+".jpeg"}`)
                                const createMediaResponse = await axios.post(
                                    `https://graph.instagram.com/${instagramTokens.profile.id}/media`,
                                    {"image_url": `${process.env.PROXY_POSTS}/uploads/${post._id+".jpeg"}`,
                                        "caption":message},
                                    {
                                        headers: {
                                            Authorization: `Bearer ${instagramTokens.accessToken}`,
                                        }
                                    }
                                );
                                console.log("createMedia response", createMediaResponse);
                                // Vérifier la réponse et récupérer l'ID du média
                                const mediaId = createMediaResponse.data.id;
                                if (!mediaId) {
                                    console.error("Erreur lors de la création du média Instagram." );
                                }
                                console.log("\n id du media recu : ", mediaId);
                                // Étape 2 : Publier le media
                                const publishResponse = await axios.post(
                                    `https://graph.instagram.com/${instagramTokens.profile.id}/media_publish`,
                                    {
                                        creation_id: mediaId,
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${instagramTokens.accessToken}`
                                        }
                                    }
                                );
                                console.log("publish response", publishResponse.data);


                            }
                            break;
                    }
                }
                /*
                if(post.platform.includes("twitter")){

                    const {accessToken, secretToken} = response.data.filter(item => item.provider === "twitter")[0];
                    console.log("access token twitter"+accessToken,"access token secret"+secretToken);
                    const client = new TwitterApi({
                    appKey: process.env.TWITTER_KEY,
                    appSecret: process.env.TWITTER_SECRET,
                    accessToken: accessToken,
                    accessSecret: secretToken,
                    });
    
                    //const bearer = new TwitterApi(process.env.TWITTER_BEARER);
    
                    const twitterClient = client.readWrite;
                    //const twitterBearer = bearer.readOnly;
    
                        //const filepath = URL.createObjectURL(fichier);
                        //console.log("le fichier en buffer :",fileBuffer);
                        await tweetWithImage(fileBuffer,mimeType,message,twitterClient);
    
                        }
                */

                if(post.mediaFiles && post.mediaFiles.length >0){
                    // Suppression de l'image après l'envoi réussi
                    const filePath = join(__dirname, "./uploads", post._id+".jpeg");
                    fs.unlinkSync(filePath);
                    console.log("Image supprimée du serveur après l'envoi.");
                }
                // Met à jour le statut du post
                post.status = "published";
                post.publishedAt = new Date();
                await post.save();

                console.log(`✅ Post publié avec succès.`);
            } catch (err) {
                console.error(`❌ Erreur lors de la publication du post:`, err);
                //post.status = "failed";
                //await post.save();
            }
        }
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des posts planifiés :", err);
    }
});

console.log("✅ Cron job démarré pour la publication des posts !");