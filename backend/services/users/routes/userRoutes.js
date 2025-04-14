const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Validation pour l'inscription
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email invalide'),
    body('password')
        .isStrongPassword({
            minLength: 6,          // ou 8 si vous préférez
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 0,
        })
        .withMessage("Le mot de passe doit contenir au moins 6 caractères et 1 chiffre"),
];

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Email ou mot de passe invalide"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Email ou mot de passe invalide"),
];

// Routes publiques
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.get("/alive", (req, res) => {res.status(200).send("OK");});

// Routes protégées
router.get('/a', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);


module.exports = router;