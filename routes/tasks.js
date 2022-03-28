// Rutas para proyectos
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const taskController = require("../controllers/task.controller");
const auth = require("../middleware/auth");

// Crea una tarea
// api/tasks
router.post("/create",
  auth,
  [
    check('name', 'El nombre de la tarea es obligatorio').not().isEmpty(),
    check('project', 'El proyecto de la tarea es obligatorio').not().isEmpty()
  ],
  taskController.createTask
);

// Obtener las tareas por proyectos
router.get("/:project", auth, taskController.getTasks);

// Actualizar tarea
router.put(
  "/update/:id",
  auth,
  [
    check("name", "El nombre de la tarea es obligatorio").not().isEmpty(),
    check("project", "El proyecto de la tarea es obligatorio").not().isEmpty()
  ],
  taskController.updateTask
);

// Eliminar tarea
router.delete('/delete/:id',
  auth,
  taskController.deleteTask
)

module.exports = router;
