// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../controllers/user.controller');

// Crea un usuario
// api/users
router.post(
  "/sign-up",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe ser minimo de 6 caracteres").isLength({ min: 6 }),
  ],
  userController.signUp
);

module.exports = router;