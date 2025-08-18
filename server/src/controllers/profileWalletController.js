const express = require('express');
const { HttpStatus } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const api = express.Router();
const apiRes = require('../utils/apiResponse');
const { getAllProfileWalletsByIdProfile, getProfileWalletById, createProfileWallet, updateProfileWallet, deleteProfileWallet } = require('../services/profileWalletService');

// Get all profile wallets
api.get('/', async (req, res, next) => {
  try {
    const profileWallets = await getAllProfileWalletsByIdProfile(req);
    return apiRes.toJson(res, profileWallets);
  } catch (error) {
    next(error);
  }
});

// Get profile wallet by ID
api.get('/:id', async (req, res, next) => {
  try {
    const profileWallet = await getProfileWalletById(req.params.id);
    return apiRes.toJson(res, profileWallet);
  } catch (error) {
    next(error);
  }
});

// Create a new profile wallet
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdProfileWallet = await createProfileWallet(body);
    return apiRes.toJson(res, createdProfileWallet);
  } catch (error) {
    next(error);
  }
});

// Update a profile wallet
api.put('/', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedProfileWallet = await updateProfileWallet(body);
    return apiRes.toJson(res, updatedProfileWallet);
  } catch (error) {
    next(error);
  }
});

// Delete a profile wallet
// api.delete('/:id', async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const deletedProfileWallet = await deleteProfileWallet(id);
//     return apiRes.toJson(res, deletedProfileWallet);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = api;
