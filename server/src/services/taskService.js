const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');
const { TaskRank, TaskStatus } = require('../enums');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../configs/dbConnection');
const Task = require('../models/task');

const taskSchema = Joi.object({
  task_name: Joi.string().required().max(255).messages({
    'string.empty': 'Tên công việc không được bỏ trống!',
    'any.required': 'Tên công việc không được bỏ trống!',
    'string.max': 'Tên công việc chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  description: Joi.string()
    .max(65535)
    .allow('')
    .messages({
      'string.max': 'Mô tả chỉ đươc phép dài tối đa 65,535 ký tự!',
    }),
  due_date: Joi.date().iso().allow(null).optional().messages({
    'date.base': 'Ngày hết hạn không hợp lệ!',
    'date.format': 'Ngày hết hạn phải có định dạng YYYY-MM-DD!',
    'any.required': 'Ngày hết hạn không được bỏ trống!',
  }),
  status: Joi.required()
    .valid(TaskStatus.TO_DO, TaskStatus.COMPLETED, TaskStatus.TO_REVIEW, TaskStatus.IN_PROGRESS)
    .messages({
      'any.only': 'Trạng thái công việc không hợp lệ!',
      'string.empty': 'Trạng thái công việc không được bỏ trống!',
      'any.required': 'Trạng thái công việc không được bỏ trống!',
    }),
});

const taskOrderValidation = Joi.object({
  order: Joi.number().required().messages({
    'number.base': 'Thứ tự công việc phải là một số!',
    'any.required': 'Thứ tự công việc không được bỏ trống!',
  }),
});

const taskStatusValidation = Joi.object({
  status: Joi.required()
    .valid(TaskStatus.TO_DO, TaskStatus.COMPLETED, TaskStatus.TO_REVIEW, TaskStatus.IN_PROGRESS)
    .messages({
      'any.only': 'Trạng thái công việc không hợp lệ!',
      'string.empty': 'Trạng thái công việc không được bỏ trống!',
      'any.required': 'Trạng thái công việc không được bỏ trống!',
    }),
});

const getAllTasks = async (req) => {
  const query = `
    SELECT 
      t.id, 
      t.task_name, 
      t.status, 
      t.due_date, 
      t.order
    FROM 
      tasks t
    WHERE t.deletedAt IS NULL
    ORDER BY
    t.order ASC;
`;
  // LIMIT ${limit} OFFSET ${offset};

  const data = await sequelize.query(query);

  return data[0];
}

const getTaskById = async (id) => {
  const task = await Task.findByPk(id);

  if (!task) {
    throw new NotFoundException('Không tìm thấy công việc này!');
  }

  return task;
}

const createTask = async (body) => {
  const data = validateTask(body);

  const tasks = await Task.findAll({
    order: [['order', 'ASC']],
  });

  const updatedOrders = tasks.map(task => ({
    id: task.id,
    order: task.order + 1,
  }));

  await Promise.all(updatedOrders.map(task =>
    Task.update({ order: task.order }, { where: { id: task.id } })
  ));

  const createdTask = await Task.create({
    ...data,
    order: 0,
  });

  return createdTask;
}

const updateTask = async (body) => {
  const { id } = body;
  const data = validateTask(body);

  const [updatedCount] = await Task.update({
    ...data,
  }, {
    where: {
      id: id,
    },
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy công việc này!');
  }

  const updatedTask = await Task.findByPk(id);

  return updatedTask;
}

const updateTaskOrder = async (body) => {
  const { orderedPayload } = body;

  if (!Array.isArray(orderedPayload)) {
    throw new RestApiException('orderedPayload phải là mảng');
  }

  validateTaskOrder(orderedPayload);

  const updatePromises = orderedPayload.map(({ id, order }) =>
    Task.update(
      { order: order },
      { where: { id } }
    )
  );

  const results = await Promise.all(updatePromises);

  return results; // response này bên fe ko sử dụng, là 1 mảng các count update
}

const updateTaskStatus = async (body) => {
  const { id, status } = body;
  validateTaskStatus(body);

  const [updatedCount] = await Task.update({
    status: status,
    // end_date: status === ProjectStatus.END_AIRDROP ? Sequelize.fn('NOW') : null,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy công việc này!');
  }

  const updatedTask = await Task.findByPk(id);

  return updatedTask;
}

const deleteTask = async (id) => {
  const deleted = await Task.destroy({
    where: {
      id: id,
    }
  });

  if (!deleted) {
    throw new NotFoundException('Không tìm thấy công việc này!');
  }

  return id;
}

const validateTask = (data) => {
  const { error, value } = taskSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const validateTaskStatus = (data) => {
  const { error, value } = taskStatusValidation.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const validateTaskOrder = (payload) => {

  if (!Array.isArray(payload)) {
    throw new Error('orderedPayload phải là mảng');
  }

  for (const item of payload) {
    const { error, value } = taskOrderValidation.validate(item, { stripUnknown: true });
    if (error) {
      throw new ValidationException(error.details[0].message);
    }

    return value;
  }

};

module.exports = { getAllTasks, createTask, updateTask, updateTaskStatus, deleteTask, updateTaskOrder, getTaskById };



