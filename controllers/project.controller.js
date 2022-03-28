const { validationResult } = require("express-validator");
const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  // Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Crear un nuevo proyecto
    const project = new Project(req.body);

    // Guardar el creador via JWT
    project.user = req.user.id;
    project.save();
    return res.json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}

// Obtiene todos los proyectos del usuario acutal
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createAt: -1 });
    return res.json(projects);
  } catch(error) {
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}

// Actualiza un proyecto
exports.updateProject = async(req, res) => {
  // Revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extraer la informacion del proyecto
  const { name } = req.body;
  const newProject = {};

  if (name) {
    newProject.name = name;
  }

  try {
    // Revisar el ID
    let project = await Project.findById(req.params.id);

    // Si el proyecto existe o no
    if(!project) {
      return res.status(404).json({ errors: { msg: "Proyecto no encontrado" } });
    }

    // Verificar el creador del proyecto
    if(project.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ errors: { msg: "No autorizado" } });
    }

    // Actualizar
    project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true });

    return res.json({ project });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}

// Eliminar un proyecto
exports.deleteProject = async (req, res) => {
  try {
    // Revisar el ID
    let project = await Project.findById(req.params.id);

    // Si el proyecto existe o no
    if (!project) {
      return res.status(404).json({ errors: { msg: "Proyecto no encontrado" } });
    }

    // Verificar el creador del proyecto
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: { msg: "No autorizado" } });
    }

    // Eliminar el proyecto
    await Project.findOneAndRemove({ _id: req.params.id });
    return res.json({ msg: 'Proyecto Eliminado' });
  } catch(error) {
    console.log(error);
    return res.status(500).send({ errors: { msg: "Hubo un error" } });
  }
}
