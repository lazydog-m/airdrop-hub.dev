const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const { Op, Sequelize } = require('sequelize');
const Wallet = require('../models/wallet');
const { WalletStatus, TRASH_DATA_TYPE, Pagination } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const ProfileWallet = require('../models/profile_wallet');
const sequelize = require('../configs/dbConnection');

const walletSchema = Joi.object({
  name: Joi.string().required().max(255).messages({
    'string.empty': 'Tên ví không được bỏ trống!',
    'any.required': 'Tên ví không được bỏ trống!',
    'string.max': 'Tên ví chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  password: Joi.string().required().max(255).messages({
    'string.empty': 'Mật khẩu ví không được bỏ trống!',
    'any.required': 'Mật khẩu ví không được bỏ trống!',
    'string.max': 'Mật khẩu ví chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  status: Joi
    .valid(WalletStatus.UN_ACTIVE, WalletStatus.IN_ACTIVE)
    .messages({
      'any.only': 'Trạng thái ví không hợp lệ!'
    }),
});

const walletStatusValidation = Joi.object({
  status: Joi.required()
    .valid(WalletStatus.UN_ACTIVE, WalletStatus.IN_ACTIVE)
    .messages({
      'any.only': 'Trạng thái ví không hợp lệ!',
      'string.empty': 'Trạng thái ví không được bỏ trống!',
      'any.only': 'Trạng thái ví không hợp lệ!'
    }),
});

const getAllWalletsNoPage = async (req) => {
  const query = `
    SELECT *
    FROM wallets w
    ORDER BY w.createdAt DESC
  `;
  const data = await sequelize.query(query);

  return data[0];
}

const getAllWallets = async (req) => {
  const { selectedStatusItems, dataType, page, search } = req.query;

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

  // if (dataType === TRASH_DATA_TYPE) {
  //   const data = await Wallet.findAll({
  //     where: {
  //       deletedAt: {
  //         [Op.not]: null
  //       }
  //     },
  //     order: [['deletedAt', 'DESC']],
  //   });
  //   return data;
  // }

  if (conditions.length > 0) {
    whereClause += ' AND ' + conditions.join(' AND ');
  }

  const query = `
    SELECT
    w.id, w.createdAt, pw_min.wallet_id, 
       w.name, w.password, w.status
    FROM wallets w
    LEFT JOIN (
    SELECT wallet_id, MIN(id) AS min_id
    FROM profile_wallets
    GROUP BY wallet_id
    ) pw_min ON pw_min.wallet_id = w.id
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
    SELECT wallet_id, MIN(id) AS min_id
    FROM profile_wallets
    GROUP BY wallet_id
    ) pw_min ON pw_min.wallet_id = w.id
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

  const existingWallet = await Wallet.findOne({ where: { name: data.name } });
  if (existingWallet) {
    throw new RestApiException('Tên ví đã tồn tại!');
  }

  const createdWallet = await Wallet.create({
    ...data,
  });

  const query = `
    select w.id, w.createdat, pw_min.wallet_id, 
       w.name, w.password, w.status
    from wallets w
    left join (
    select wallet_id, min(id) as min_id
    from profile_wallets
    group by wallet_id
    ) pw_min on pw_min.wallet_id = w.id
    where w.id = :id
  `;
  const result = await sequelize.query(query, {
    replacements: { id: createdWallet.id },
  });

  return result[0][0];
}

const updateWallet = async (body) => {
  const { id } = body;
  const data = validateWallet(body);

  const existingWallet = await Wallet.findOne({
    where: {
      name: data.name,
      id: { [Op.ne]: id }
    }
  });

  if (existingWallet) {
    throw new RestApiException('Tên ví đã tồn tại!');
  }

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

  const query = `
    SELECT w.id, w.createdAt, pw_min.wallet_id, 
       w.name, w.password, w.status
    FROM wallets w
    LEFT JOIN (
    SELECT wallet_id, MIN(id) AS min_id
    FROM profile_wallets
    GROUP BY wallet_id
    ) pw_min ON pw_min.wallet_id = w.id
    WHERE w.id = :id
  `;
  const result = await sequelize.query(query, {
    replacements: { id: id },
  });

  return { ...result[0][0] };
}

const updateWalletStatus = async (body) => {
  const { id, status } = body;
  validateWalletStatus(body);

  const [updatedCount] = await Wallet.update({
    status: status,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy ví này!');
  }

  const query = `
    SELECT w.id, w.createdAt, pw_min.wallet_id, 
       w.name, w.password, w.status
    FROM wallets w
    LEFT JOIN (
    SELECT wallet_id, MIN(id) AS min_id
    FROM profile_wallets
    GROUP BY wallet_id
    ) pw_min ON pw_min.wallet_id = w.id
    WHERE w.id = :id
  `;
  const result = await sequelize.query(query, {
    replacements: { id: id },
  });

  return { ...result[0][0] };
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



