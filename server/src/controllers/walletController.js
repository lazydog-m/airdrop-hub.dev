const express = require('express');
const { HttpStatus } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const api = express.Router();
const apiRes = require('../utils/apiResponse');
const { getAllWallets, getWalletById, createWallet, updateWallet, updateWalletStatus, deleteWallet, getAllWalletsNoPage } = require('../services/walletService');

// Get all wallets
api.get('/', async (req, res, next) => {
  try {
    const wallets = await getAllWallets(req);
    return apiRes.toJson(res, wallets);
  } catch (error) {
    next(error);
  }
});

// Get all wallets no page
api.get('/no-page', async (req, res, next) => {
  try {
    const wallets = await getAllWalletsNoPage(req);
    return apiRes.toJson(res, wallets);
  } catch (error) {
    next(error);
  }
});

// Get wallet by ID
api.get('/:id', async (req, res, next) => {
  try {
    const wallet = await getWalletById(req.params.id);
    return apiRes.toJson(res, wallet);
  } catch (error) {
    next(error);
  }
});

// Create a new wallet
api.post('/', async (req, res, next) => {
  const { body } = req;
  try {
    const createdWallet = await createWallet(body);
    return apiRes.toJson(res, createdWallet);
  } catch (error) {
    next(error);
  }
});

// Update a wallet
api.put('/', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedWallet = await updateWallet(body);
    return apiRes.toJson(res, updatedWallet);
  } catch (error) {
    next(error);
  }
});

// Update wallet status
api.put('/status', async (req, res, next) => {
  const { body } = req;
  try {
    const updatedWalletStatus = await updateWalletStatus(body);
    return apiRes.toJson(res, updatedWalletStatus);
  } catch (error) {
    next(error);
  }
});

// Delete a wallet
api.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedWallet = await deleteWallet(id);
    return apiRes.toJson(res, deletedWallet);
  } catch (error) {
    next(error);
  }
});

module.exports = api;
