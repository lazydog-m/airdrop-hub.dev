const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');

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
  x_username: {
    type: DataTypes.STRING,
  },
  discord_username: {
    type: DataTypes.STRING,
  },
  discord_password: {
    type: DataTypes.STRING,
  },
  telegram_phone: {
    type: DataTypes.STRING(10),
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
  note: {
    type: DataTypes.TEXT,
  },
  //status?
},
  {
    timestamps: true,
  });

module.exports = Profile;
