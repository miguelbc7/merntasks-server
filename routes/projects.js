// Rutas para proyectos
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const projectController = require("../controllers/project.controller");
const auth = require('../middleware/auth');

// Crea proyectos
// api/projects
router.post("/create",
  auth,
  [
    check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
  ],
  projectController.createProject
);

// Obtener todos los proyectos
router.get("/",
  auth,
  projectController.getProjects
);

// Actualizar proyecto
router.put('/update/:id',
  auth,
  [
    check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
  ],
  projectController.updateProject
)

// Eliminar proyecto
router.delete('/delete/:id',
  auth,
  projectController.deleteProject
)

module.exports = router;
