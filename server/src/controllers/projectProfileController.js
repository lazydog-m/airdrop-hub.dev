const express = require('express');
const api = express.Router();
const apiRes = require('../utils/apiResponse');
const {
  createProjectProfile,
  deleteProjectProfile,
  getAllProfilesByProject,
  getAllProfilesByResources,
  getAllIdsByResources,
  getAllIdsByProject,
  createProjectProfiles,
  deleteProjectProfiles
} = require('../services/projectProfileService');

// Get all profiles by resources
api.get('/resources', async (req, res, next) => {
  try {
    const profiles = await getAllProfilesByResources(req);
    return apiRes.toJson(res, profiles);
  } catch (error) {
    next(error);
  }
});

// Get all profiles by project
api.get('/:projectId', async (req, res, next) => {
  try {
    const profiles = await getAllProfilesByProject(req);
    return apiRes.toJson(res, profiles);
  } catch (error) {
    next(error);
  }
});

// Get all ids by resources
api.get('/ids/resources', async (req, res, next) => {
  try {
    const ids = await getAllIdsByResources(req);
    return apiRes.toJson(res, ids);
  } catch (error) {
    next(error);
  }
});

// Get all ids by project
api.get('/ids/:projectId', async (req, res, next) => {
  try {
    const ids = await getAllIdsByProject(req.params.projectId);
    return apiRes.toJson(res, ids);
  } catch (error) {
    next(error);
  }
});

// // Get profile by ID
// api.get('/:id', async (req, res, next) => {
//   try {
//     const profile = await getProfileById(req.params.id);
//     return apiRes.toJson(res, profile);
//   } catch (error) {
//     next(error);
//   }
// });
//

// Create a new project profile
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdProjectProfile = await createProjectProfile(body);
    return apiRes.toJson(res, createdProjectProfile);
  } catch (error) {
    next(error);
  }
});

// Create a new project profiles
api.post('/multiple', async (req, res, next) => {
  const { body } = req;
  try {
    const createdProjectProfiles = await createProjectProfiles(body);
    return apiRes.toJson(res, createdProjectProfiles);
  } catch (error) {
    next(error);
  }
});
//
// // Update a profile
// api.put('/', async (req, res, next) => {
//   const { body } = req;
//   try {
//     const updatedProfile = await updateProfile(body);
//     return apiRes.toJson(res, updatedProfile);
//   } catch (error) {
//     next(error);
//   }
// });
//
// // Update profile status
// api.put('/status', async (req, res, next) => {
//   const { body } = req;
//   try {
//     const updatedProfileStatus = await updateProfileStatus(body);
//     return apiRes.toJson(res, updatedProfileStatus);
//   } catch (error) {
//     next(error);
//   }
// });
//

// Delete profiles
api.delete('/multiple', async (req, res, next) => {
  try {
    const deletedProjectProfiles = await deleteProjectProfiles(req);
    return apiRes.toJson(res, deletedProjectProfiles);
  } catch (error) {
    next(error);
  }
});

// Delete a profile
api.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProjectProfile = await deleteProjectProfile(id);
    return apiRes.toJson(res, deletedProjectProfile);
  } catch (error) {
    next(error);
  }
});


module.exports = api;
