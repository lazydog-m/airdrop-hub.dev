const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const { Op, Sequelize } = require('sequelize');
const Web3Wallet = require('../models/web3Wallet');
const { Pagination, StatusCommon } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const sequelize = require('../configs/dbConnection');
const { convertArr } = require('../utils/convertUtil');

const web3WalletSchema = Joi.object({
  name: Joi.string().trim().required().max(50).messages({
    'string.base': 'Tên ví phải là chuỗi',
    'string.empty': 'Tên ví không được bỏ trống!',
    'any.required': 'Tên ví không được bỏ trống!',
    'string.max': 'Tên ví chỉ đươc phép dài tối đa 50 ký tự!',
  }),
  password: Joi.string().trim().required().max(255).messages({
    'string.base': 'Mật khẩu ví phải là chuỗi',
    'string.empty': 'Mật khẩu ví không được bỏ trống!',
    'any.required': 'Mật khẩu ví không được bỏ trống!',
    'string.max': 'Mật khẩu ví chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  url: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .messages({
      'string.base': 'Link ví phải là chuỗi',
      'string.max': 'Link ví chỉ đươc phép dài tối đa 1,000 ký tự!',
    }),
  resource_id: Joi.string()
    .trim()
    .max(255)
    .allow('')
    .messages({
      'string.base': 'Resource id phải là chuỗi',
      'string.max': 'Resource id chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  status: Joi
    .valid(StatusCommon.UN_ACTIVE, StatusCommon.IN_ACTIVE)
    .messages({
      'any.only': 'Trạng thái ví không hợp lệ!'
    }),
});

const statusValidation = Joi.object({
  status: Joi.required()
    .valid(StatusCommon.UN_ACTIVE, StatusCommon.IN_ACTIVE)
    .messages({
      'any.only': 'Trạng thái ví không hợp lệ!',
      'any.required': 'Trạng thái ví không được bỏ trống!',
    }),
});

const getAllWeb3WalletsNoPage = async (req) => {
  const query = `
    SELECT *
    FROM web3_wallets w
    WHERE w.deletedAt IS NULL AND w.status = '${StatusCommon.IN_ACTIVE}'
    ORDER BY w.createdAt DESC
  `;
  const data = await sequelize.query(query);

  return data[0];
}

const getAllWeb3Wallets = async (req) => {
  const { selectedStatusItems, page, search } = req.query;

  const statusArr = convertArr(selectedStatusItems);

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * Pagination.limit;

  let whereClause = 'WHERE w.deletedAt IS NULL';
  const conditions = [];
  const replacements = [];

  if (search) {
    conditions.push(`w.name LIKE ?`);
    replacements.push(`%${search}%`);
  }

  if (statusArr?.length > 0) {
    const statusPlaceholders = statusArr.map((_, index) => `?`).join(',');
    conditions.push(`w.status IN (${statusPlaceholders})`);
    replacements.push(...statusArr);
  }

  if (conditions.length > 0) {
    whereClause += ' AND ' + conditions.join(' AND ');
  }

  const query = `
    SELECT
    w.id, w.createdAt, w.url, w.resource_id, count(pw.id) as count,
       w.name, w.password, w.status
    FROM web3_wallets w
    LEFT JOIN profile_web3_wallets pw ON pw.wallet_id = w.id AND pw.deletedAt IS NULL
    ${whereClause} 
    GROUP BY w.id
    ORDER BY w.createdAt DESC
    LIMIT ${Pagination.limit} OFFSET ${offset}
  `;
  const data = await sequelize.query(query, {
    replacements: replacements,
  });

  const countQuery = `
    SELECT COUNT(*) AS total 
    FROM web3_wallets w
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

const getWeb3WalletById = async (id) => {
  const web3Wallet = await Web3Wallet.findByPk(id);

  if (!web3Wallet) {
    throw new NotFoundException(`Không tìm thấy ví Web3 này!`)
  }

  return web3Wallet;
}

const createWeb3Wallet = async (body) => {

  const data = validateWeb3Wallet(body);

  const existingName = await Web3Wallet.findOne({
    where: {
      name: data.name,
      deletedAt: null,
    }
  });

  if (existingName) {
    throw new RestApiException('Tên ví Web3 đã tồn tại!');
  }

  if (data.resource_id) {
    const existing = await Web3Wallet.findOne({
      where: {
        resource_id: data.resource_id,
        deletedAt: null,
      }
    });

    if (existing) {
      throw new RestApiException('Resource id này đã được sử dụng!');
    }
  }

  const createdWeb3Wallet = await Web3Wallet.create({
    ...data,
  });

  return createdWeb3Wallet;
}

const updateWeb3Wallet = async (body) => {
  const { id } = body;
  const data = validateWeb3Wallet(body);

  const existingName = await Web3Wallet.findOne({
    where: {
      name: data.name,
      id: { [Op.ne]: id },
      deletedAt: null,
    }
  });

  if (existingName) {
    throw new RestApiException('Tên ví Web3 đã tồn tại!');
  }

  if (data.resource_id) {
    const existing = await Web3Wallet.findOne({
      where: {
        resource_id: data.resource_id,
        id: { [Op.ne]: id },
        deletedAt: null,
      }
    });

    if (existing) {
      throw new RestApiException('Resource id này đã được sử dụng!');
    }
  }

  const [updatedCount] = await Web3Wallet.update({
    ...data,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy ví Web3 này!');
  }

  const updatedWeb3Wallet = await Web3Wallet.findByPk(id);

  return updatedWeb3Wallet;
}

const updateWeb3WalletStatus = async (body) => {
  const { id } = body;
  const data = validateStatus(body);

  const [updatedCount] = await Web3Wallet.update({
    status: data.status === StatusCommon.IN_ACTIVE ? StatusCommon.UN_ACTIVE : StatusCommon.IN_ACTIVE,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy ví Web3 này!');
  }

  const updatedWeb3Wallet = await Web3Wallet.findByPk(id);

  return updatedWeb3Wallet;
}

const deleteWeb3Wallet = async (id) => {
  // const deletedCount = await Wallet.destroy({
  //   where: {
  //     id: id,
  //   }
  // });
  //
  // if (deletedCount === 0) {
  //   throw new NotFoundException('Không tìm thấy ví này!');
  // }

  const [deletedCount] = await Web3Wallet.update({
    deletedAt: Sequelize.fn('NOW'),
  }, {
    where: {
      id: id,
    }
  });

  if (!deletedCount) {
    throw new NotFoundException('Không tìm thấy ví Web3 này!');
  }

  return id;
}

const validateWeb3Wallet = (data) => {
  const { error, value } = web3WalletSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const validateStatus = (data) => {
  const { error, value } = statusValidation.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

module.exports = {
  getAllWeb3Wallets,
  getWeb3WalletById,
  createWeb3Wallet,
  updateWeb3Wallet,
  updateWeb3WalletStatus,
  deleteWeb3Wallet,
  getAllWeb3WalletsNoPage
};



