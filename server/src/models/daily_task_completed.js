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
    allowNull: false,
  },
},
  {
    timestamps: true,
    freezeTableName: true,
  });

module.exports = DailyTaskCompleted;
