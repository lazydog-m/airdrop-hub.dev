const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { StatusCommon } = require('../enums');

const Web3Wallet = db.define('web3_wallets', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(1000),
  },
  resource_id: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM,
    values: [StatusCommon.UN_ACTIVE, StatusCommon.IN_ACTIVE],
    defaultValue: StatusCommon.IN_ACTIVE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
},
  {
    timestamps: true,
  });

module.exports = Web3Wallet;
