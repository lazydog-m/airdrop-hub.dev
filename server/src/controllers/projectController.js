const express = require('express');
const { HttpStatus } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const api = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, updateProjectStatus, deleteProject, completeDailyTasks, getDailyTasks, updateProjectStar } = require('../services/projectService');
const apiRes = require('../utils/apiResponse');
const sequelize = require('../configs/dbConnection');

// Get all projects
api.get('/', async (req, res, next) => {
  try {
    const projects = await getAllProjects(req);
    return apiRes.toJson(res, projects);
  } catch (error) {
    next(error);
  }
});

// Get all daily tasks from projects
api.get('/daily-tasks', async (req, res, next) => {
  try {
    const dailyTasks = await getDailyTasks(req);
    return apiRes.toJson(res, dailyTasks);
  } catch (error) {
    next(error);
  }
});

// Get project by ID
api.get('/:id', async (req, res, next) => {
  try {
    const project = await getProjectById(req.params.id);
    return apiRes.toJson(res, project);
  } catch (error) {
    next(error);
  }
});

// Create a new project
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdProject = await createProject(body);
    return apiRes.toJson(res, createdProject);
  } catch (error) {
    next(error);
  }
});

// Create daily tasks completed for project
api.post('/complete-daily-tasks', async (req, res, next) => {
  const { body } = req;
  try {
    const createdDailyTasksCompleted = await completeDailyTasks(body);

    return apiRes.toJson(res, createdDailyTasksCompleted);
  } catch (error) {
    next(error);
  }
});

// Update a project
api.put('/', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedProject = await updateProject(body);
    return apiRes.toJson(res, updatedProject);
  } catch (error) {
    next(error);
  }
});

// Update project status
api.put('/status', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedProjectStatus = await updateProjectStatus(body);
    return apiRes.toJson(res, updatedProjectStatus);
  } catch (error) {
    next(error);
  }
});

// Update project star
api.put('/star', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedProjectStar = await updateProjectStar(body);
    return apiRes.toJson(res, updatedProjectStar);
  } catch (error) {
    next(error);
  }
});

// Delete a project
api.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProject = await deleteProject(id);
    return apiRes.toJson(res, deletedProject);
  } catch (error) {
    next(error);
  }
});

module.exports = api;
