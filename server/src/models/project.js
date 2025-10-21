const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { ProjectStatus, ProjectType, DailyTaskRefresh } = require('../enums');

const Project = db.define('projects', {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(1000),
  },
  daily_tasks: {
    type: DataTypes.STRING,
  },
  resources: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  end_date: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
  note: {
    type: DataTypes.STRING(10000),
  },
  status: {
    type: DataTypes.ENUM,
    values: [
      ProjectStatus.DOING,
      ProjectStatus.TGE,
      ProjectStatus.SNAPSHOT,
      ProjectStatus.END_AIRDROP,
      ProjectStatus.END_PENDING_UPDATE
    ],
    defaultValue: ProjectStatus.DOING,
  },
  type: {
    type: DataTypes.ENUM,
    values: [
      ProjectType.TESTNET,
      ProjectType.DEPIN,
      ProjectType.GAME,
      ProjectType.WEB,
      ProjectType.GALXE,
      ProjectType.RETROACTIVE
    ],
    defaultValue: ProjectType.WEB,
  },
  daily_tasks_refresh: {
    type: DataTypes.ENUM,
    values: [
      DailyTaskRefresh.UTC0,
      DailyTaskRefresh.NEW_TASK,
      DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP,
      DailyTaskRefresh.UNKNOWN
    ],
    defaultValue: DailyTaskRefresh.UNKNOWN,
  },
},
  {
    timestamps: true,
  });

module.exports = Project;
