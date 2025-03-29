require("dotenv").config({ path: __dirname + "/.env" });
//const { download } = require("./utilities");

  const tweetWithImage = async (fileBuffer,mimeType, text, twitterClient) => {
    try {
      // Vérifier si un chemin d'image est fourni et si l'image existe
      if (fileBuffer) {
        const tweetContent = text;
        console.log(mimeType);
          try {
              const mediaId = await twitterClient.v1.uploadMedia(Buffer.from(fileBuffer), {
                mimeType: mimeType}
              );

              await twitterClient.v2.tweet({
                  text: tweetContent,
                  media: {
                      media_ids: [mediaId]
                  }
              });
          } catch (e) {
              console.log(e)
          
      }

      /*const mediaData = await twitterClient.v1.uploadMedia(imagePath, { type: 'image/jpeg' });
      
      // Publier le tweet avec l'image
      const tweetContent = text;
      const tweet = await twitterClient.v2.tweet({
        status: tweetContent,
        media_ids: [mediaData.media_id_string]  // Lier l'image téléchargée au tweet
      });

      console.log('Tweet envoyé avec succès avec l\'image:', tweet);
    */} else {
      // Si aucune image n'est fournie, tweeter uniquement le texte
      try {
        const tweet = await twitterClient.v2.tweet(text);
        console.log('Tweet envoyé avec succès sans image:', tweet);
      } catch (e) {
        console.error('Erreur lors de l\'envoi du tweet sans image:', e);
      }
    }
  } catch (e) {
    console.error('Erreur lors de l\'envoi du tweet:', e);
  }
  };

const getUserId = async (username) => {
  try {
    const user = await twitterClient.v2.userByUsername(username);
    return user.data.id;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ID utilisateur:", error);
    return null;
  }
};

const getAllTweets = async (userId) => {
  try {
    // Récupère les 100 derniers tweets de l'utilisateur
    const tweets = await twitterClient.v2.userTimeline(userId, {
      max_results: 100, // Tu peux augmenter ce nombre si nécessaire
      "tweet.fields": "created_at,public_metrics,text" // Tu peux ajouter des champs supplémentaires selon ce que tu veux récupérer
    });
    return tweets.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des tweets:", error);
    return [];
  }
};

// Exporter la fonction correctement
module.exports = {tweetWithImage};
module.exports = { getAllTweets };
