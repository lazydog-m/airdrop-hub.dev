const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const { Op, Sequelize } = require('sequelize');
const Wallet = require('../models/wallet');
const { Pagination, StatusCommon } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const sequelize = require('../configs/dbConnection');

const walletSchema = Joi.object({
  name: Joi.string().trim().required().max(255).messages({
    'string.base': 'Tên ví phải là chuỗi',
    'string.empty': 'Tên ví không được bỏ trống!',
    'any.required': 'Tên ví không được bỏ trống!',
    'string.max': 'Tên ví chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  password: Joi.string().trim().required().max(255).messages({
    'string.base': 'Mật khẩu ví phải là chuỗi',
    'string.empty': 'Mật khẩu ví không được bỏ trống!',
    'any.required': 'Mật khẩu ví không được bỏ trống!',
    'string.max': 'Mật khẩu ví chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  status: Joi
    .valid(StatusCommon.UN_ACTIVE, StatusCommon.IN_ACTIVE)
    .messages({
      'any.only': 'Trạng thái ví không hợp lệ!'
    }),
});

const walletStatusValidation = Joi.object({
  status: Joi.required()
    .valid(StatusCommon.UN_ACTIVE, StatusCommon.IN_ACTIVE)
    .messages({
      'any.only': 'Trạng thái ví không hợp lệ!',
      'any.required': 'Trạng thái ví không được bỏ trống!',
    }),
});

const getAllWalletsNoPage = async (req) => {
  const query = `
    SELECT *
    FROM wallets w
    WHERE w.deletedAt IS NULL AND w.status IN ('${StatusCommon.IN_ACTIVE}')
    ORDER BY w.createdAt DESC
  `;
  const data = await sequelize.query(query);

  return data[0];
}

const getAllWallets = async (req) => {
  const { selectedStatusItems, page, search } = req.query;

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * Pagination.limit;

  let whereClause = 'WHERE w.deletedAt IS NULL';
  const conditions = [];
  const replacements = [];

  if (search) {
    conditions.push(`w.name LIKE ?`);
    replacements.push(`%${search}%`);
  }

  if (selectedStatusItems?.length > 0) {
    const statusPlaceholders = selectedStatusItems.map((_, index) => `?`).join(',');
    conditions.push(`w.status IN (${statusPlaceholders})`);
    replacements.push(...selectedStatusItems);
  }

  if (conditions.length > 0) {
    whereClause += ' AND ' + conditions.join(' AND ');
  }

  const query = `
    SELECT
    w.id, w.createdAt, pw.count, 
       w.name, w.password, w.status
    FROM wallets w
    LEFT JOIN (
    SELECT wallet_id, COUNT(id) AS count
    FROM profile_wallets
    GROUP BY wallet_id
    ) pw ON pw.wallet_id = w.id
    ${whereClause} 
    ORDER BY w.createdAt DESC
    LIMIT ${Pagination.limit} OFFSET ${offset}
  `;
  const data = await sequelize.query(query, {
    replacements: replacements,
  });

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM wallets w
    LEFT JOIN (
    SELECT wallet_id, COUNT(id) AS count
    FROM profile_wallets
    GROUP BY wallet_id
    ) pw ON pw.wallet_id = w.id
    ${whereClause} 
`;

  const countResult = await sequelize.query(countQuery, {
    replacements: replacements,
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

const getWalletById = async (id) => {
  const wallet = await Wallet.findByPk(id);

  if (!wallet) {
    throw new NotFoundException(`Không tìm thấy ví này!`)
  }

  return wallet;
}

const createWallet = async (body) => {

  const data = validateWallet(body);

  // const existingWallet = await Wallet.findOne({ where: { name: data.name } });
  // if (existingWallet) {
  //   throw new RestApiException('Tên ví đã tồn tại!');
  // }

  const createdWallet = await Wallet.create({
    ...data,
  });

  return createdWallet;
}

const updateWallet = async (body) => {
  const { id } = body;
  const data = validateWallet(body);

  // const existingWallet = await Wallet.findOne({
  //   where: {
  //     name: data.name,
  //     id: { [Op.ne]: id }
  //   }
  // });
  //
  // if (existingWallet) {
  //   throw new RestApiException('Tên ví đã tồn tại!');
  // }

  const [updatedCount] = await Wallet.update({
    ...data,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy ví này!');
  }

  const updatedWallet = await Wallet.findByPk(id);

  return updatedWallet;
}

const updateWalletStatus = async (body) => {
  const { id } = body;
  const data = validateWalletStatus(body);

  const [updatedCount] = await Wallet.update({
    status: data.status,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy ví này!');
  }

  const updatedWallet = await Wallet.findByPk(id);

  return updatedWallet;
}

const deleteWallet = async (id) => {
  // const deletedCount = await Wallet.destroy({
  //   where: {
  //     id: id,
  //   }
  // });
  //
  // if (deletedCount === 0) {
  //   throw new NotFoundException('Không tìm thấy ví này!');
  // }

  const [deletedCount] = await Wallet.update({
    deletedAt: Sequelize.fn('NOW'),
  }, {
    where: {
      id: id,
    }
  });

  if (!deletedCount) {
    throw new NotFoundException('Không tìm thấy ví này!');
  }

  return id;
}

const validateWallet = (data) => {
  const { error, value } = walletSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const validateWalletStatus = (data) => {
  const { error, value } = walletStatusValidation.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

module.exports = { getAllWallets, getWalletById, createWallet, updateWallet, updateWalletStatus, deleteWallet, getAllWalletsNoPage };



