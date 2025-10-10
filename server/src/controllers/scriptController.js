const express = require('express');
const { HttpStatus } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const api = express.Router();
const apiRes = require('../utils/apiResponse');
const sequelize = require('../configs/dbConnection');
const { createScript, getScriptByFileName, updateScript, getAllScripts, deleteScript, closeProfile, openProfile, runScript, stopScript, getAllScriptsByProject } = require('../services/scriptService');

// Get all scripts
api.get('/', async (req, res, next) => {
  try {
    const scripts = await getAllScripts(req);
    return apiRes.toJson(res, scripts);
  } catch (error) {
    next(error);
  }
});

// Get all scripts by project
api.get('/project/contains-name', async (req, res, next) => {
  try {
    const scripts = await getAllScriptsByProject(req);
    return apiRes.toJson(res, scripts);
  } catch (error) {
    next(error);
  }
});

// Get script by fileName
api.get('/:fileName', async (req, res, next) => {
  try {
    const script = await getScriptByFileName(req.params.fileName);
    return apiRes.toJson(res, script);
  } catch (error) {
    next(error);
  }
});

api.get('/open-profile/test', async (req, res, next) => {
  try {
    const profileTestOpened = await openProfile();
    return apiRes.toJson(res, profileTestOpened);
  } catch (error) {
    next(error);
  }
});

// get hay post
api.get('/close-profile/test', async (req, res, next) => {
  try {
    const profileTestClosed = await closeProfile();
    return apiRes.toJson(res, profileTestClosed);
  } catch (error) {
    next(error);
  }
});

api.get('/run-script/test', async (req, res, next) => {
  try {
    await runScript(req.query.code);
    return apiRes.toJson(res, null);
  } catch (error) {
    next(error);
  }
});

api.get('/stop-script/test', async (req, res, next) => {
  try {
    await stopScript();
    return apiRes.toJson(res, null);
  } catch (error) {
    next(error);
  }
});

// Create a new script
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdScript = await createScript(body);
    return apiRes.toJson(res, createdScript);
  } catch (error) {
    next(error);
  }
});

// Update a script
api.put('/', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedScript = await updateScript(body);
    return apiRes.toJson(res, updatedScript);
  } catch (error) {
    next(error);
  }
});

// Delete a script
api.delete('/:fileName', async (req, res, next) => {
  const { fileName } = req.params;
  try {
    const deletedScript = await deleteScript(fileName);
    return apiRes.toJson(res, deletedScript);
  } catch (error) {
    next(error);
  }
});

module.exports = api;
