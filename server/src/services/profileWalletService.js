const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');
const { Sequelize } = require('sequelize');
const ProfileWallet = require('../models/profile_wallet');
const Wallet = require('../models/wallet');
const sequelize = require('../configs/dbConnection');
const { WalletStatus, Pagination } = require('../enums');

const profileWalletSchema = Joi.object({
  wallet_address: Joi.string().required().max(1000).messages({
    'string.empty': 'Địa chỉ ví không được bỏ trống!',
    'any.required': 'Địa chỉ ví không được bỏ trống!',
    'string.max': 'Địa chỉ ví chỉ đươc phép dài tối đa 1000 ký tự!',
  }),
  wallet_id: Joi.string().required().max(36).messages({
    'string.empty': 'Wallet id ví không được bỏ trống!',
    'any.required': 'Wallet id không được bỏ trống!',
    'string.max': 'Wallet id chỉ đươc phép dài tối đa 36 ký tự!',
  }),
  profile_id: Joi.string().required().max(36).messages({
    'string.empty': 'Profile id ví không được bỏ trống!',
    'any.required': 'Profile id không được bỏ trống!',
    'string.max': 'Profile id chỉ đươc phép dài tối đa 36 ký tự!',
  }),
  secret_phrase: Joi.string().required()
    .max(1000)
    .messages({
      'string.empty': 'Cụm từ bí mật không được bỏ trống!',
      'any.required': 'Cụm từ bí mật không được bỏ trống!',
      'string.max': 'Cụm từ bí mật chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
});

const getAllProfileWalletsByIdProfile = async (req) => {

  const { page, search, id } = req.query;

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * Pagination.limit;

  const query = `
    SELECT 
    pw.id, pw.createdAt, pw.profile_id, pw.wallet_id, pw.wallet_address, pw.secret_phrase, 
           w.name, w.password 
    FROM profile_wallets pw
    JOIN wallets w ON pw.wallet_id = w.id
    WHERE pw.deletedAt IS NULL
      AND pw.profile_id = :profileId 
      AND w.status = :status 
      AND w.name LIKE :searchQuery 
    ORDER BY pw.createdAt DESC
    LIMIT ${Pagination.limit} OFFSET ${offset}
  `;
  const data = await sequelize.query(query, {
    replacements: {
      profileId: id,
      status: WalletStatus.IN_ACTIVE,
      searchQuery: `%${search}%`
    },
  });

  const countQuery = `
SELECT COUNT(*) AS total 
    FROM profile_wallets pw
    JOIN wallets w ON pw.wallet_id = w.id
    WHERE pw.deletedAt IS NULL
    AND pw.profile_id = :profileId 
    AND w.status = :status 
    AND w.name LIKE :searchQuery 
`;

  const countResult = await sequelize.query(countQuery, {
    replacements: {
      profileId: id,
      status: WalletStatus.IN_ACTIVE,
      searchQuery: `%${search}%`
    },
  });

  const total = countResult[0][0]?.total;
  const totalPages = Math.ceil(total / Pagination.limit);

  return {
    data: data[0],
    pagination: {
      page: parseInt(currentPage, 10),
      totalItems: total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPre: currentPage > 1
    }
  };
}

const getProfileWalletById = async (id) => {
  const profileWallet = await ProfileWallet.findByPk(id);

  if (!profileWallet) {
    throw new NotFoundException('Không tìm thấy địa chỉ ví này!');
  }

  return profileWallet;
}

const createProfileWallet = async (body) => {
  const { profile_id, wallet_id, wallet_name } = body;
  const data = validateProfileWallet(body);

  const profileWalletExists = await sequelize.query(queryProfileWalletExists, {
    replacements: { profileId: profile_id, walletId: wallet_id }
  });

  if (profileWalletExists[0].length > 0) {
    throw new RestApiException(`Ví ${wallet_name} đã được liên kết với hồ sơ này!`);
  }

  const createdProfileWallet = await ProfileWallet.create({
    ...data,
  });

  const result = await sequelize.query(queryAfterSave, {
    replacements: { id: createdProfileWallet.id },
  });

  return result[0][0];
}

const updateProfileWallet = async (body) => {
  const { id, profile_id, wallet_name, wallet_id, need_check_wallet_id } = body;
  const data = validateProfileWallet(body);

  if (need_check_wallet_id) {

    const profileWalletExists = await sequelize.query(queryProfileWalletExists, {
      replacements: { profileId: profile_id, walletId: wallet_id }
    });

    if (profileWalletExists[0].length > 0) {
      throw new RestApiException(`Ví ${wallet_name} đã được liên kết với hồ sơ này!`);
    }
  }

  const [updatedCount] = await ProfileWallet.update({
    ...data,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy địa chỉ ví này!');
  }

  const result = await sequelize.query(queryAfterSave, {
    replacements: { id: id },
  });

  return { ...result[0][0] };
}

const deleteProfileWallet = async (id) => {
  const [deletedCount] = await ProfileWallet.update({
    deletedAt: Sequelize.fn('NOW'),
  }, {
    where: {
      id: id,
    }
  });

  if (!deletedCount) {
    throw new NotFoundException('Không tìm thấy địa chỉ ví này!');
  }

  return id;
}

const validateProfileWallet = (data) => {
  const { error, value } = profileWalletSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const queryAfterSave = `
    SELECT pw.id, pw.createdAt, pw.profile_id, pw.wallet_id, pw.wallet_address, pw.secret_phrase, 
           w.name, w.password 
    FROM profile_wallets pw
    JOIN wallets w ON pw.wallet_id = w.id
    WHERE pw.id = :id
  `;

const queryProfileWalletExists = `
  SELECT pw.id FROM profile_wallets pw
  WHERE pw.profile_id = :profileId
  AND pw.wallet_id = :walletId
  LIMIT 1;
`;

module.exports = { getAllProfileWalletsByIdProfile, getProfileWalletById, createProfileWallet, updateProfileWallet, deleteProfileWallet };



