// Rutas para Authenticar usuarios
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth");

// Iniciar sesion
// api/auth
router.post(
  "/sign-in",
  [
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe ser minimo de 6 caracteres").isLength({
      min: 6,
    }),
  ],
  authController.signIn
);

// Obtiene el usuario autenticado
router.get('/get-user',
  auth,
  authController.getUser
)

module.exports = router;
