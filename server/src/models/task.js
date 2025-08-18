const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { TaskType, TaskStatus, TaskRank } = require('../enums');

const Task = db.define('tasks', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  task_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: [TaskStatus.TO_DO, TaskStatus.COMPLETED, TaskStatus.TO_REVIEW, TaskStatus.IN_PROGRESS],
    defaultValue: TaskStatus.TO_DO,
  },
  description: {
    type: DataTypes.TEXT,
  },
  due_date: {
    type: DataTypes.DATEONLY,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
},
  {
    timestamps: true,
  });

module.exports = Task;
