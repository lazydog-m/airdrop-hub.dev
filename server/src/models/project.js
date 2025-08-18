const { DataTypes } = require('sequelize');
const db = require('../configs/dbConnection');
const { ProjectStatus, ProjectType, ProjectCost, DailyTaskRefresh } = require('../enums');

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
  url_daily_tasks: {
    type: DataTypes.STRING(1000),
  },
  discord_url: {
    type: DataTypes.STRING(1000),
  },
  funding_rounds_url: {
    type: DataTypes.STRING(1000),
  },
  zealy_url: {
    type: DataTypes.STRING(1000),
  },
  galxe_url: {
    type: DataTypes.STRING(1000),
  },
  faucet_url: {
    type: DataTypes.STRING(1000),
  },
  daily_tasks: {
    type: DataTypes.STRING,
  },
  is_cheat: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_cheating: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_star: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
  note: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM,
    values: [ProjectStatus.DOING, ProjectStatus.TGE, ProjectStatus.SNAPSHOT, ProjectStatus.END_AIRDROP, ProjectStatus.END_PENDING_UPDATE],
    defaultValue: ProjectStatus.DOING,
  },
  type: {
    type: DataTypes.ENUM,
    values: [ProjectType.TESTNET, ProjectType.DEPIN, ProjectType.GAME, ProjectType.WEB, ProjectType.GALXE, ProjectType.RETROACTIVE],
    defaultValue: ProjectType.TESTNET,
  },
  cost_type: {
    type: DataTypes.ENUM,
    values: [ProjectCost.FREE, ProjectCost.FEE, ProjectCost.HOLD],
    defaultValue: ProjectCost.FREE,
  },
  daily_tasks_refresh: {
    type: DataTypes.ENUM,
    values: [DailyTaskRefresh.UTC0, DailyTaskRefresh.NEW_TASK, DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP, DailyTaskRefresh.UNKNOWN],
    defaultValue: DailyTaskRefresh.UNKNOWN,
  },
},
  {
    timestamps: true,
  });

module.exports = Project;
