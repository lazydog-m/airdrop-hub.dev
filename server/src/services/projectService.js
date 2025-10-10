const Project = require('../models/project');
const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');
const { ProjectType, ProjectStatus, DailyTaskRefresh, Pagination } = require('../enums');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../configs/dbConnection');
const DailyTaskCompleted = require('../models/daily_task_completed');

const projectSchema = Joi.object({
  name: Joi.string().trim().required().max(255).messages({
    'string.base': 'Tên dự án phải là chuỗi',
    'string.empty': 'Tên dự án không được bỏ trống!',
    'any.required': 'Tên dự án không được bỏ trống!',
    'string.max': 'Tên dự án chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  daily_tasks: Joi.string()
    .trim()
    .max(255)
    .allow('')
    .messages({
      'string.base': 'Task hằng ngày phải là chuỗi',
      'string.max': 'Task hằng ngày chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  resources: Joi.array()
    .items(
      Joi.string().trim().messages({
        'string.base': 'Tài nguyên phải là chuỗi',
        'string.empty': 'Tài nguyên không được bỏ trống',
      })
    )
    .messages({
      'array.base': 'Tài nguyên phải là một mảng',
    }),
  url: Joi.string()
    .trim()
    .max(1000)
    .allow('')
    .messages({
      'string.base': 'Link dự án phải là chuỗi',
      'string.max': 'Link dự án chỉ đươc phép dài tối đa 1,000 ký tự!',
    }),
  note: Joi.string()
    .trim()
    .max(10000)
    .allow('')
    .messages({
      'string.base': 'Ghi chú phải là chuỗi',
      'string.max': 'Ghi chú chỉ đươc phép dài tối đa 10,000 ký tự!',
    }),
  type: Joi.string()
    .valid(ProjectType.GAME, ProjectType.DEPIN, ProjectType.TESTNET, ProjectType.WEB, ProjectType.GALXE, ProjectType.RETROACTIVE)
    .messages({
      'any.only': 'Mảng dự án không hợp lệ!'
    }),
  daily_tasks_refresh: Joi.string()
    .valid(DailyTaskRefresh.UNKNOWN, DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP, DailyTaskRefresh.NEW_TASK, DailyTaskRefresh.UTC0)
    .messages({
      'any.only': 'Thời điểm làm mới task hằng ngày không hợp lệ!'
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
      'any.required': 'Trạng thái dự án không được bỏ trống!',
    }),
});

const getAllProjects = async (req) => {
  const {
    selectedTaskItems,
    selectedTask,
    selectedSortDate,
    selectedTypeItems,
    selectedStatusItems,
    page,
    search
  } = req.query;

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * Pagination.limit;

  let whereClause = 'WHERE p.deletedAt IS NULL';
  let orderByClause = '';
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

  if (selectedTask === 'Task hằng ngày') {
    conditions.push(`p.daily_tasks IS NOT NULL AND p.daily_tasks != ''`);
  }

  // if (selectedTask === 'Task Dự Án') {
  //   conditions.push(`p.daily_tasks IS NOT NULL AND p.daily_tasks != ''`);
  // }

  // if (selectedTaskItems?.length > 0) {
  //   const costPlaceholders = selectedCostItems.map((_, index) => `?`).join(',');
  //   conditions.push(`p.cost_type IN (${costPlaceholders})`);
  //   replacements.push(...selectedCostItems);
  // }

  // 7h sang ?? 

  if (selectedSortDate === 'Ngày Làm DESC') {
    orderByClause = 'ORDER BY p.createdAt DESC';
  } else if (selectedSortDate === 'Ngày End DESC') {
    orderByClause = 'ORDER BY p.end_date DESC';
  } else if (selectedSortDate === 'Ngày Làm ASC') {
    orderByClause = 'ORDER BY p.createdAt ASC';
  } else if (selectedSortDate === 'Ngày End ASC') {
    orderByClause = 'ORDER BY p.end_date ASC';
  }
  else {
    orderByClause = 'ORDER BY p.createdAt DESC';
  }

  if (selectedTaskItems?.length > 0) {
    // if (selectedOtherItems.includes('Cheat')) {
    //   conditions.push(`p.is_cheat = true`);
    // }

    if (selectedTaskItems.includes('Refresh 00:00 UTC')) {
      conditions.push(`p.daily_tasks_refresh IN (?)`);
      const time = [DailyTaskRefresh.UTC0];
      replacements.push(...time);
    }

    if (selectedTaskItems.includes('Chưa Hoàn Thành')) {
      const status = [ProjectStatus.DOING];
      conditions.push(`dtc.max_id IS NULL`);
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
      p.status, 
      p.createdAt, 
      p.end_date, 
      p.daily_tasks, 
      p.resources, 
      p.note, 
      p.daily_tasks_refresh,
      dtc.max_id AS daily_tasks_completed,
		  dtc1.last_completed_at
    FROM 
      projects p
   LEFT JOIN (
   SELECT dtc.project_id, MAX(dtc.createdAt) AS last_completed_at, MAX(dtc.id) AS max_id  
    FROM daily_tasks_completed dtc
    WHERE DATE(dtc.createdAt) = CURDATE()
    GROUP BY dtc.project_id
    ) dtc ON dtc.project_id = p.id
   LEFT JOIN (
   SELECT dtc1.project_id, MAX(dtc1.createdAt) AS last_completed_at, MAX(dtc1.id) AS max_id
    FROM daily_tasks_completed dtc1
    GROUP BY dtc1.project_id
    ) dtc1 ON dtc1.project_id = p.id
   ${whereClause} 
   ${orderByClause}
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
  LEFT JOIN (
  SELECT dtc1.project_id, MAX(dtc1.createdAt) AS last_completed_at, MAX(dtc1.id) AS max_id
   FROM daily_tasks_completed dtc1
   GROUP BY dtc1.project_id
   ) dtc1 ON dtc1.project_id = p.id
  ${whereClause};`;

  const countResult = await sequelize.query(countQuery, {
    replacements: replacements,
  });

  const total = countResult[0][0]?.total;
  const totalPages = Math.ceil(total / Pagination.limit);

  const convertedData = data[0].map((item) => {
    return {
      ...item,
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
    WHERE 
    p.deletedAt IS NULL AND p.daily_tasks IS NOT NULL AND p.daily_tasks != ''
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

  // console.log("Node time:", new Date());
  // console.log("DB time:", (await sequelize.query("SELECT NOW() as now"))[0][0].now);
  // console.log("Project time:", dailyTaskCompleted.createdAt);

  const result = await sequelize.query(queryAfterSave, {
    replacements: { id: dailyTaskCompleted.project_id },
  });

  const item = { ...result[0][0] };
  const convertedData = convertItem(item);
  // console.log(item)

  return convertedData;
}

const convertItem = (item) => {
  return {
    ...item,
    daily_tasks_completed: item.daily_tasks_completed === null ? false : true,
  }
}

const createProject = async (body) => {
  const data = validateProject(body);

  const createdProject = await Project.create({
    ...data,
  });

  return createdProject;
}

const updateProject = async (body) => {
  const { id } = body;
  const data = validateProject(body);

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

  const updatedProject = await Project.findByPk(id);

  return updatedProject;
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

  const updatedProject = await Project.findByPk(id);

  return updatedProject;
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
      p.status, 
      p.createdAt, 
      p.end_date, 
      p.daily_tasks, 
      p.resources, 
      p.note, 
      p.daily_tasks_refresh,
      dtc.max_id AS daily_tasks_completed,
		  dtc1.last_completed_at
    FROM 
      projects p
   LEFT JOIN (
   SELECT dtc.project_id, MAX(dtc.createdAt) AS last_completed_at, MAX(dtc.id) AS max_id  
   FROM daily_tasks_completed dtc
   WHERE DATE(dtc.createdAt) = CURDATE()
   GROUP BY dtc.project_id
   ) dtc ON dtc.project_id = p.id
   LEFT JOIN (
   SELECT dtc1.project_id, MAX(dtc1.createdAt) AS last_completed_at, MAX(dtc1.id) AS max_id
   FROM daily_tasks_completed dtc1
   GROUP BY dtc1.project_id
   ) dtc1 ON dtc1.project_id = p.id
    WHERE p.id = :id
    `;

module.exports = { getAllProjects, getProjectById, createProject, updateProject, updateProjectStatus, countProject, deleteProject, completeDailyTasks, getDailyTasks, updateProjectStar };



