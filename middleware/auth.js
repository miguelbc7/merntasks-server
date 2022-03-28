const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "variables.env" });

module.exports = function (req, res, next) {
  // Leer el token del header
  const token = req.header('x-auth-token') || req.header('authorization');

  // Revisar si no hay token
  if(!token) {
    return res.status(401).json({ errors: { msg: "No hay token, permiso no valido" } })
  }

  // Validar token
  try {
    const encrypt = jwt.verify(token, process.env.SECRET);
    req.user = encrypt.user;
    next();
  } catch(error) {
    return res.status(401).json({ error: { msg: "Token no valido" } });
  }
}