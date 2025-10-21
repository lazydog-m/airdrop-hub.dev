const express = require('express');
const api = express.Router();
const apiRes = require('../utils/apiResponse');
const {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  updateTaskOrder,
  getAllTasksByProjectId,
  updateTaskOrderStar
} = require('../services/taskService');

// Get all tasks by project 
api.get('/:projectId', async (req, res, next) => {
  try {
    const tasks = await getAllTasksByProjectId(req);
    return apiRes.toJson(res, tasks);
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

// Update task order star
api.put('/order-star', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedTask = await updateTaskOrderStar(body);
    return apiRes.toJson(res, updatedTask);
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
