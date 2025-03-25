const axios = require('axios');
const Facebook = {
    async publish(message,accessToken){
        try {
            
            
            const response = await axios.post('https://graph.facebook.com/me/feed', null, {
              params: {
                message: message,
                access_token: accessToken,     
              },
            });
            return { success: true, data: response.data };
          } catch (error) {
            console.error('Erreur lors de la publication sur Facebook:', error.message);
            return { success: false, error: error.message };
          }
}
};

