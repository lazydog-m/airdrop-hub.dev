const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');

const ProfileWeb3Wallet = db.define('profile_web3_wallets', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  wallet_address: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  secret_phrase: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  profile_id: {
    type: DataTypes.UUID,
    references: {
      model: 'profiles',
      key: 'id'
    },
    allowNull: false,
  },
  wallet_id: {
    type: DataTypes.UUID,
    references: {
      model: 'web3_wallets',
      key: 'id'
    },
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
  // note: {
  //   type: DataTypes.TEXT,
  // },
  //status, note?
},
  {
    timestamps: true,
  });

module.exports = ProfileWeb3Wallet;
