
require("dotenv").config({ path: __dirname + "/.env" });
const { download } = require("./utilities");

const tweetWithImage = async (imagepath,text,twitterClient) => {
    try {
      // Charger l'image depuis le système de fichiers (ou utiliser une URL si vous préférez)
      const imagePath = './path_to_your_image.jpg';  // Remplacez par le chemin de votre image
      if(imagePath){const mediaData = await twitterClient.v1.uploadMedia(imagePath, { type: 'image/jpeg' });}
  
      // Publier le tweet avec l'image
      const tweetContent = text;
      if(imagePath){
      const tweet = await twitterClient.v2.tweet({
        status: tweetContent,
        media_ids: [mediaData.media_id_string]  // Lier l'image téléchargée au tweet
      });
    } else {
      try {
        await twitterClient.v2.tweet(text);
      } catch (e) {
        console.log(e)
      }
    
    
    }
      console.log('Tweet envoyé avec succès:', tweet);
    } catch (e) {
      console.error('Erreur lors de l\'envoi du tweet:', e);
    }
  };
  
  

