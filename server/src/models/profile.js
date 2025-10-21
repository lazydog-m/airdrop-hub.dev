const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { StatusCommon } = require('../enums');

const Profile = db.define('profiles', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discord_email: {
    type: DataTypes.STRING,
  },
  discord_email_password: {
    type: DataTypes.STRING,
  },
  discord_username: {
    type: DataTypes.STRING,
  },
  discord_password: {
    type: DataTypes.STRING,
  },
  // 1 list tk x để có thể xem được tk x cũ khi cần authen hay gì đó ??.
  x_email: {
    type: DataTypes.STRING,
  },
  x_email_password: {
    type: DataTypes.STRING,
  },
  x_username: {
    type: DataTypes.STRING,
  },
  telegram_email: {
    type: DataTypes.STRING,
  },
  telegram_email_password: {
    type: DataTypes.STRING,
  },
  telegram_username: {
    type: DataTypes.STRING,
  },
  telegram_phone: {
    type: DataTypes.STRING(10),
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM,
    values: [StatusCommon.UN_ACTIVE, StatusCommon.IN_ACTIVE],
    defaultValue: StatusCommon.IN_ACTIVE,
  },
  note: {
    type: DataTypes.TEXT,
  },
  //co can status ko, hay là cần tắt các cái resource, xem lại vấn đề khi mà 1 profile có vấn đề với resource và ko làm được project này, nhưng làm được profjject khác?
},
  {
    timestamps: true,
  });

module.exports = Profile;
