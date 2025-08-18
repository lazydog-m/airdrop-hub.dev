const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { WalletStatus } = require('../enums');

const Wallet = db.define('wallets', {
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
  },
  ecosystem: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM,
    values: [WalletStatus.UN_ACTIVE, WalletStatus.IN_ACTIVE],
    defaultValue: WalletStatus.IN_ACTIVE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
},
  {
    timestamps: true,
  });

module.exports = Wallet;
