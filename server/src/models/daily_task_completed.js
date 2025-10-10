const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');

const DailyTaskCompleted = db.define('daily_tasks_completed', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  project_id: {
    type: DataTypes.UUID,
    references: {
      model: 'projects',
      key: 'id'
    },
    allowNull: false,
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: db.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: db.literal('CURRENT_TIMESTAMP'),
  }
},
  {
    timestamps: false,
    freezeTableName: true,
  });

module.exports = DailyTaskCompleted;
