const express = require('express');
const { HttpStatus } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const api = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, updateProjectStatus, deleteProject, createDailyTasksCompleted, getDailyTasks, updateProjectStar } = require('../services/projectService');
const apiRes = require('../utils/apiResponse');
const sequelize = require('../configs/dbConnection');
const { createTask, updateTask, updateTaskStatus, deleteTask, updateTaskOrder, getAllTasks, getTaskById } = require('../services/taskService');

// Get all tasks
api.get('/', async (req, res, next) => {
  try {
    const tasks = await getAllTasks(req);
    return apiRes.toJson(res, tasks);
  } catch (error) {
    next(error);
  }
});

// Get task by ID
api.get('/:id', async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id);
    return apiRes.toJson(res, task);
  } catch (error) {
    next(error);
  }
});

// Create a new task
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdTask = await createTask(body);
    return apiRes.toJson(res, createdTask);
  } catch (error) {
    next(error);
  }
});

// Update a task
api.put('/', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedTask = await updateTask(body);
    return apiRes.toJson(res, updatedTask);
  } catch (error) {
    next(error);
  }
});

// Update task order
api.put('/order', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedTaskOrder = await updateTaskOrder(body);
    return apiRes.toJson(res, updatedTaskOrder);
  } catch (error) {
    next(error);
  }
});

// Update task status
api.put('/status', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedTaskStatus = await updateTaskStatus(body);
    return apiRes.toJson(res, updatedTaskStatus);
  } catch (error) {
    next(error);
  }
});

// Delete a task
api.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedTask = await deleteTask(id);
    return apiRes.toJson(res, deletedTask);
  } catch (error) {
    next(error);
  }
});

module.exports = api;
