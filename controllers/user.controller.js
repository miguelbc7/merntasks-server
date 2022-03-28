const brcryptjs = require('bcryptjs');
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "variables.env" });

const User = require('../models/User');

exports.signUp = async (req, res) => {
  // Revisamos si hay errores
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Extraer email y password
  const { email, password } = req.body;

  try {
    // Revisar que el usuario registrado sea unico
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: { msg: "El usuario ya existe" } });
    }

    // Crea el nuevo usuario
    user = new User(req.body);

    // Hashear el password
    const salt = await brcryptjs.genSalt(10);
    user.password = await brcryptjs.hash(password, salt);

    // Guarda el usuario
    await user.save();

    // Crear y firmar el jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      }
    };

    // Firmar el JWT
    jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600 // 1 hora
    }, (error, token) => {
      if (error) throw error;
      // Mensaje de confirmacion
      return res.json({ token });
    }); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errors: { msg: "Hubo un error" } });
  }
}
