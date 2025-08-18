const Project = require('../models/project');
const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');
const { ProjectType, ProjectStatus, ProjectCost, DailyTaskRefresh, Pagination } = require('../enums');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../configs/dbConnection');
const { convertBitToBoolean } = require('../utils/convertUtil');
const DailyTaskCompleted = require('../models/daily_task_completed');

const projectSchema = Joi.object({
  name: Joi.string().required().max(255).messages({
    'string.empty': 'Tên dự án không được bỏ trống!',
    'any.required': 'Tên dự án không được bỏ trống!',
    'string.max': 'Tên dự án chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  daily_tasks: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'Làm hằng ngày chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  url_daily_tasks: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Url làm hằng ngày chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  discord_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Discord url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  faucet_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Faucet url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  zealy_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Zealy url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  galxe_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Galxe url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  funding_rounds_url: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Funding rounds url chỉ đươc phép dài tối đa 1000 ký tự!',
    }),
  note: Joi.string()
    .max(65535)
    .allow('')
    .messages({
      'string.max': 'Ghi chú chỉ đươc phép dài tối đa 65,535 ký tự!',
    }),
  is_cheat: Joi.boolean()
    .valid(true, false)
    .messages({
      'any.only': 'Cheat phải là true hoặc false!',
    }),
  is_cheating: Joi.boolean()
    .valid(true, false)
    .messages({
      'any.only': 'Cheating phải là true hoặc false!',
    }),
  cost_type: Joi.string()
    .valid(ProjectCost.FEE, ProjectCost.FREE, ProjectCost.HOLD)
    .messages({
      'any.only': 'Loại chi phí không hợp lệ!'
    }),
  type: Joi.string()
    .valid(ProjectType.GAME, ProjectType.DEPIN, ProjectType.TESTNET, ProjectType.WEB, ProjectType.GALXE, ProjectType.RETROACTIVE)
    .messages({
      'any.only': 'Loại dự án không hợp lệ!'
    }),
  daily_tasks_refresh: Joi.string()
    .valid(DailyTaskRefresh.UNKNOWN, DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP, DailyTaskRefresh.NEW_TASK, DailyTaskRefresh.UTC0)
    .messages({
      'any.only': 'Thời điểm làm mới task không hợp lệ!'
    }),
  status: Joi
    .valid(ProjectStatus.DOING, ProjectStatus.END_PENDING_UPDATE, ProjectStatus.TGE, ProjectStatus.SNAPSHOT, ProjectStatus.END_AIRDROP)
    .messages({
      'any.only': 'Trạng thái dự án không hợp lệ!'
    }),
});

const projectStatusValidation = Joi.object({
  status: Joi.required()
    .valid(ProjectStatus.DOING, ProjectStatus.END_PENDING_UPDATE, ProjectStatus.TGE, ProjectStatus.SNAPSHOT, ProjectStatus.END_AIRDROP)
    .messages({
      'any.only': 'Trạng thái dự án không hợp lệ!',
      'string.empty': 'Trạng thái dự án không được bỏ trống!',
      'any.required': 'Trạng thái dự án không được bỏ trống!',
    }),
});

const getAllProjects = async (req) => {
  const { selectedCostItems, selectedTypeItems, selectedStatusItems, selectedOtherItems, page, search } = req.query;

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * Pagination.limit;

  let whereClause = 'WHERE p.deletedAt IS NULL';
  const conditions = [];
  const replacements = [];

  if (search) {
    conditions.push(`p.name LIKE ?`);
    replacements.push(`%${search}%`);
  }

  if (selectedStatusItems?.length > 0) {
    const statusPlaceholders = selectedStatusItems.map((_, index) => `?`).join(',');
    conditions.push(`p.status IN (${statusPlaceholders})`);
    replacements.push(...selectedStatusItems);
  }

  if (selectedTypeItems?.length > 0) {
    const typePlaceholders = selectedTypeItems.map((_, index) => `?`).join(',');
    conditions.push(`p.type IN (${typePlaceholders})`);
    replacements.push(...selectedTypeItems);
  }

  if (selectedCostItems?.length > 0) {
    const costPlaceholders = selectedCostItems.map((_, index) => `?`).join(',');
    conditions.push(`p.cost_type IN (${costPlaceholders})`);
    replacements.push(...selectedCostItems);
  }

  if (selectedOtherItems?.length > 0) {
    if (selectedOtherItems.includes('Cheat')) {
      conditions.push(`p.is_cheat = true`);
    }

    if (selectedOtherItems.includes('Làm Hằng Ngày')) {
      conditions.push(`p.daily_tasks IS NOT NULL AND p.daily_tasks != ''`);
    }

    if (selectedOtherItems.includes('Làm Mới 7 Giờ Sáng')) {
      conditions.push(`p.daily_tasks IS NOT NULL AND p.daily_tasks != '' AND p.daily_tasks_refresh IN (?)`);
      const time = [DailyTaskRefresh.UTC0];
      replacements.push(...time);
    }

    if (selectedOtherItems.includes('Chưa Làm Hôm Nay')) {
      const status = [ProjectStatus.DOING];
      conditions.push(`p.daily_tasks IS NOT NULL AND p.daily_tasks != '' AND dtc.max_id IS NULL AND p.status IN (?)`);
      replacements.push(...status);
    }
  }

  if (conditions.length > 0) {
    whereClause += ' AND ' + conditions.join(' AND ');
  }

  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.url, 
      p.type, 
      p.cost_type, 
      p.status, 
      p.discord_url, 
      p.galxe_url, 
      p.funding_rounds_url, 
      p.faucet_url, 
      p.createdAt, 
      p.end_date, 
      p.is_cheat, 
      p.is_cheating, 
      p.daily_tasks, 
      p.url_daily_tasks, 
      p.note, 
      p.daily_tasks_refresh,
      dtc.max_id AS daily_tasks_completed
    FROM 
      projects p
   LEFT JOIN (
   SELECT dtc.project_id, MAX(dtc.createdAt) AS last_completed_at, MAX(dtc.id) AS max_id  
   FROM daily_tasks_completed dtc
   WHERE DATE(dtc.createdAt) = CURDATE()
   GROUP BY dtc.project_id
   ) dtc ON dtc.project_id = p.id
    ${whereClause} 
    ORDER BY
    p.createdAt DESC
    LIMIT ${Pagination.limit} OFFSET ${offset};`;

  const data = await sequelize.query(query, {
    replacements: replacements,
  });

  const countQuery = `
  SELECT COUNT(*) AS total 
  FROM projects p
  LEFT JOIN (
    SELECT dtc.project_id, MAX(dtc.createdAt) AS last_completed_at, MAX(dtc.id) AS max_id  
    FROM daily_tasks_completed dtc
    WHERE DATE(dtc.createdAt) = CURDATE()
    GROUP BY dtc.project_id
  ) dtc ON dtc.project_id = p.id
  ${whereClause};`;

  const countResult = await sequelize.query(countQuery, {
    replacements: replacements,
  });

  const total = countResult[0][0]?.total;
  const totalPages = Math.ceil(total / Pagination.limit);

  const convertedData = data[0].map((item) => {
    return {
      ...item,
      is_cheat: convertBitToBoolean(item.is_cheat),
      is_cheating: convertBitToBoolean(item.is_cheating),
      daily_tasks_completed: item.daily_tasks_completed === null ? false : true,
    }
  })

  return {
    data: convertedData,
    pagination: {
      page: parseInt(currentPage, 10),
      totalItems: total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPre: currentPage > 1
    }
  };
}

const getDailyTasks = async () => {
  const query = `
    SELECT 
      Distinct(p.daily_tasks)
    FROM 
      projects p
    WHERE p.daily_tasks IS NOT NULL AND p.daily_tasks != ''
  `;

  const [results] = await sequelize.query(query);

  const dailyTasksArray = results.map(item => item.daily_tasks);

  return dailyTasksArray;
}

const countProject = async () => {
  const whereConditions = {
    deletedAt: null,
  };
  const count = await Project.count({
    where: whereConditions,
  });
  return count;
}

const getProjectById = async (id) => {
  const project = await Project.findByPk(id);

  if (!project) {
    throw new NotFoundException(`Not found project with id ${id}`)
  }

  return project;
}

const completeDailyTasks = async (body) => {

  const { project_id } = body;

  const dailyTaskCompleted = await DailyTaskCompleted.create({
    project_id,
  });

  const result = await sequelize.query(queryAfterSave, {
    replacements: { id: dailyTaskCompleted.project_id },
  });

  const item = { ...result[0][0] };
  const convertedData = convertItem(item);

  return convertedData;
}

const convertItem = (item) => {
  return {
    ...item,
    is_cheat: convertBitToBoolean(item?.is_cheat),
    is_cheating: convertBitToBoolean(item?.is_cheating),
    daily_tasks_completed: item.daily_tasks_completed === null ? false : true,
  }
}

const createProject = async (body) => {
  const data = validateProject(body);

  const existingProject = await Project.findOne({ where: { name: data.name } });
  if (existingProject) {
    throw new RestApiException('Tên dự án đã tồn tại!');
  }

  const createdProject = await Project.create({
    ...data,
  });

  return createdProject;
}

const updateProject = async (body) => {
  const { id } = body;
  const data = validateProject(body);

  const existingProject = await Project.findOne({
    where: {
      name: data.name,
      id: { [Op.ne]: id }
    }
  });

  if (existingProject) {
    throw new RestApiException('Tên dự án đã tồn tại!');
  }

  const [updatedCount] = await Project.update({
    ...data,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy dự án này!');
  }

  const result = await sequelize.query(queryAfterSave, {
    replacements: { id },
  });

  const item = { ...result[0][0] };
  const convertedData = convertItem(item);

  return convertedData;
}

const updateProjectStatus = async (body) => {
  const { id, status } = body;
  validateProjectStatus(body);

  const [updatedCount] = await Project.update({
    status: status,
    end_date: status === ProjectStatus.END_AIRDROP ? Sequelize.fn('NOW') : null,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy dự án này!');
  }

  const result = await sequelize.query(queryAfterSave, {
    replacements: { id },
  });

  const item = { ...result[0][0] };
  const convertedData = convertItem(item);

  return convertedData;
}

const updateProjectStar = async (body) => {
  const { id, is_star, stt } = body;

  const [updatedCount] = await Project.update({
    is_star: is_star,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy dự án này!');
  }

  const result = await sequelize.query(queryAfterSave, {
    replacements: { id },
  });

  const item = { ...result[0][0], stt };
  const convertedData = convertItem(item, stt);

  return convertedData;
}

const deleteProject = async (id) => {

  const [deletedCount] = await Project.update({
    deletedAt: Sequelize.fn('NOW'),
  }, {
    where: {
      id: id,
    }
  });

  if (!deletedCount) {
    throw new NotFoundException('Không tìm thấy dự án này!');
  }

  return id;
}

const validateProject = (data) => {
  const { error, value } = projectSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const validateProjectStatus = (data) => {
  const { error, value } = projectStatusValidation.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const queryAfterSave = `
    SELECT 
      p.id, 
      p.name, 
      p.url, 
      p.type, 
      p.cost_type, 
      p.status, 
      p.discord_url, 
      p.galxe_url, 
      p.funding_rounds_url, 
      p.faucet_url, 
      p.createdAt, 
      p.end_date, 
      p.is_cheat, 
      p.is_cheating, 
      p.daily_tasks, 
      p.url_daily_tasks, 
      p.note, 
      p.daily_tasks_refresh,
      dtc.max_id AS daily_tasks_completed
    FROM 
      projects p
   LEFT JOIN (
   SELECT dtc.project_id, MAX(dtc.createdAt) AS last_completed_at, MAX(dtc.id) AS max_id  
   FROM daily_tasks_completed dtc
   WHERE DATE(dtc.createdAt) = CURDATE()
   GROUP BY dtc.project_id
   ) dtc ON dtc.project_id = p.id
    WHERE p.id = :id
    `;

module.exports = { getAllProjects, getProjectById, createProject, updateProject, updateProjectStatus, countProject, deleteProject, completeDailyTasks, getDailyTasks, updateProjectStar };



