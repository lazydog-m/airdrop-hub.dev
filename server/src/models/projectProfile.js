const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');

const ProjectProfile = db.define('project_profiles', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  // secret_phrase: {
  //   type: DataTypes.STRING(1000),
  //   allowNull: false,
  // },
  profile_id: {
    type: DataTypes.UUID,
    references: {
      model: 'profiles',
      key: 'id'
    },
    allowNull: false,
  },
  project_id: {
    type: DataTypes.UUID,
    references: {
      model: 'projects',
      key: 'id'
    },
    allowNull: false,
  },
  // deletedAt: {
  //   type: DataTypes.DATE,
  // },
  // note: {
  //   type: DataTypes.TEXT,
  // },
  //status, note?
},
  {
    timestamps: true,
  });

module.exports = ProjectProfile;
