const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");

// Crea una nueva tarea
exports.createTask = async (req, res) => {
  // Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extraer el proyecto y comprobar si existe
  const { project } = req.body;

  try {
    const projectSearch = await Project.findById(project);

    if(!projectSearch) {
      return res.status(404).json({ errors: { msg: "Proyecto no encontrado" } })
    }

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectSearch.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: "No autorizado" } });
    }

    // Creamos la tarea
    const task = new Task(req.body);
    await task.save();
    return res.json({ task });
  } catch(error) {
    console.log(error);
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}

// Obtener las tareas por proyecto
exports.getTasks = async (req, res) => {
  try {
    // Extraermos el proyecto
    const { project } = req.params;

    const projectSearch = await Project.findById(project);

    if (!projectSearch) {
      return res
        .status(404)
        .json({ errors: { msg: "Proyecto no encontrado" } });
    }

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectSearch.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: "No autorizado" } });
    }

    // Obtener las tareas por proyecto
    const tasks = await Task.find({ project: project }).sort({ createAt: -1 });
    return res.json({ tasks });
  } catch(error) {
    console.log(error);
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}

// Actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    // Extraermos el proyecto
    const { name, status, project } = req.body;

    // Revisar si la tarea existe o no
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ errors: { msg: "No existe la tarea" } });
    }

    const projectSearch = await Project.findById(project);

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectSearch.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: "No autorizado" } });
    }

    // Crear un objeto con la nueva informacion
    const newTask = {};

    newTask.name = name;
    newTask.status = status;

    // Guardar la tarea
    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true });
    return res.json({ task });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}

// Eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    // Extraermos el proyecto
    const { project } = req.query;

    // Revisar si la tarea existe o no
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ errors: { msg: "No existe la tarea" } });
    }

    const projectSearch = await Project.findById(project);
    console.log(projectSearch);

    // Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectSearch.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: "No autorizado" } });
    }

    // Eliminar
    await Task.findOneAndRemove({ _id: req.params.id });
    return res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}
