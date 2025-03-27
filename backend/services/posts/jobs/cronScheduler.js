const cron = require("node-cron");
const Post = require("../models/Post");
  // Service qui publie le post

// Tâche cron exécutée toutes les minutes
cron.schedule("* * * * *", async () => {
    console.log("🔄 Vérification des posts planifiés...");

    const now = new Date();
    
    try {
        // Trouver les posts dont la date de publication est dépassée et qui ne sont pas encore publiés
        const postsToPublish = await Post.find({
            scheduledFor: { $lte: now },
            status: "scheduled",
        });

        for (const post of postsToPublish) {
            try {
                //console.log(`🚀 Publication du post ${post._id} sur ${post.platforms}`);
                const userId = post.userId;
                const fileBuffer = post.mediaFiles[0].fileBuffer;
                const mimeType = post.mediaFiles[0].contentType;
                const message = post.content;
                 const response = await axios.get(process.env.PROXY_GATEWAY+`/api/socialauth/tokens/${userId}`);
                if(networks.includes("twitter")){
                
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
                        console.log("le fichier en buffer :",fileBuffer);
                        await tweetWithImage(fileBuffer,mimeType,message,twitterClient);
    
                        }

                // Met à jour le statut du post
                post.status = "published";
                post.publishedAt = new Date();
                await post.save();

                console.log(`✅ Post ${post._id} publié avec succès.`);
            } catch (err) {
                console.error(`❌ Erreur lors de la publication du post ${post._id}:`, err);
                post.status = "failed";
                await post.save();
            }
        }
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des posts planifiés :", err);
    }
});

console.log("✅ Cron job démarré pour la publication des posts !");