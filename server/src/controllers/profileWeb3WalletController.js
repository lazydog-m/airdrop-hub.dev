const express = require('express');
const api = express.Router();
const apiRes = require('../utils/apiResponse');
const {
  getAllWeb3WalletsByProfileId,
  createProfileWeb3Wallet,
  updateProfileWeb3Wallet,
  deleteProfileWeb3Wallet
} = require('../services/profileWeb3WalletService');

// Get all web3 wallets by profile id
api.get('/:profileId', async (req, res, next) => {
  try {
    const web3WalletsByProfileId = await getAllWeb3WalletsByProfileId(req);
    return apiRes.toJson(res, web3WalletsByProfileId);
  } catch (error) {
    next(error);
  }
});

// Create a new profile web3 wallet
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdProfileWeb3Wallet = await createProfileWeb3Wallet(body);
    return apiRes.toJson(res, createdProfileWeb3Wallet);
  } catch (error) {
    next(error);
  }
});

// Update a profile web3 wallet
api.put('/', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedProfileWeb3Wallet = await updateProfileWeb3Wallet(body);
    return apiRes.toJson(res, updatedProfileWeb3Wallet);
  } catch (error) {
    next(error);
  }
});

// Delete a profile web3 wallet
api.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedProfileWeb3Wallet = await deleteProfileWeb3Wallet(id);
    return apiRes.toJson(res, deletedProfileWeb3Wallet);
  } catch (error) {
    next(error);
  }
});

module.exports = api;
