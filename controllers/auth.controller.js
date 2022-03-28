const brcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const User = require("../models/User");

exports.signIn = async (req, res) => {
  // Revisamos si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extraer email y password
  const { email, password } = req.body;

  try {
    // Revisar que sea un usuario registrado
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: { msg: "El usuario no existe" } });
    }

    // Revisar el password
    const passTrue = await brcryptjs.compare(password, user.password);

    if (!passTrue) {
      return res.status(400).json({ errors: { msg: "Password incorrecto" } });
    }

    // Si todo es correcto
    // Crear y firmar el jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Firmar el JWT
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600, // 1 hora
      },
      (error, token) => {
        if (error) throw error;
        // Mensaje de confirmacion
        return res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errors: { msg: "Hubo un error" } });
  }
}

// Obtiene el usuario que esta autenticado
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch(error) {
    console.log(error);
    return res.status(400).json({ errors: { msg: "Hubo un error" } });
  }
}
