const multer = require('multer');

const storage = multer.memoryStorage(); // Stocke le fichier en mémoire (Buffer)
const upload = multer({ storage });

module.exports = upload;