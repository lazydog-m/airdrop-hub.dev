const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const RestApiException = require('../exceptions/RestApiException');
const { Sequelize, Op } = require('sequelize');
const Profile = require('../models/profile');
const sequelize = require('../configs/dbConnection');
const { Pagination } = require('../enums');
const { openProfile, browsers, currentProfiles, closingByApiIds, delay, getPortFree, usedPorts, getBrowsers, addBrowser, removeBrowserById, sortGridLayout } = require('../utils/playwrightUtil');

const profileSchema = Joi.object({
  email: Joi.string().required().max(255).messages({
    'string.empty': 'Email không được bỏ trống!',
    'any.required': 'Email không được bỏ trống!',
    'string.max': 'Email chỉ đươc phép dài tối đa 255 ký tự!',
  }),
  email_password: Joi.string().required()
    .max(255)
    .messages({
      'string.empty': 'Mật khẩu email không được bỏ trống!',
      'any.required': 'Mật khẩu email không được bỏ trống!',
      'string.max': 'Mật khẩu email chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  x_username: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'Username X chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  discord_username: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'Username discord chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  discord_password: Joi.string()
    .max(255)
    .allow('')
    .messages({
      'string.max': 'Mật khẩu discord chỉ đươc phép dài tối đa 255 ký tự!',
    }),
  telegram_phone: Joi.string()
    .max(10)
    .allow('')
    .messages({
      'string.max': 'Số điện thoại telegram chỉ đươc phép dài tối đa 10 ký tự!',
    }),
  note: Joi.string()
    .max(65535)
    .allow('')
    .messages({
      'string.max': 'Ghi chú chỉ đươc phép dài tối đa 65,535 ký tự!',
    }),
});

const getAllProfiles = async (req) => {

  const { page, search } = req.query;

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * Pagination.limit;

  const query = `
    SELECT 
      p.id, 
      p.email, 
      p.x_username, 
      p.discord_password, 
      p.discord_username, 
      p.telegram_phone, 
      p.email_password, 
      p.createdAt
    FROM 
      profiles p
    WHERE p.deletedAt IS NULL
      AND (
        p.email LIKE :searchQuery 
        OR p.discord_username LIKE :searchQuery
        OR p.x_username LIKE :searchQuery
        OR p.telegram_phone LIKE :searchQuery
      )
    ORDER BY p.createdAt DESC
    LIMIT ${Pagination.limit} OFFSET ${offset}
  `;

  const data = await sequelize.query(query, {
    replacements: {
      searchQuery: `%${search}%`
    },
  });

  const countQuery = `
  SELECT COUNT(*) AS total 
    FROM 
      profiles p
    WHERE p.deletedAt IS NULL
      AND (
        p.email LIKE :searchQuery 
        OR p.discord_username LIKE :searchQuery
        OR p.x_username LIKE :searchQuery
        OR p.telegram_phone LIKE :searchQuery
      )
   `;

  const countResult = await sequelize.query(countQuery, {
    replacements: {
      searchQuery: `%${search}%`
    },
  });

  const total = countResult[0][0]?.total;
  const totalPages = Math.ceil(total / Pagination.limit);

  return {
    browsers: currentProfiles(),
    data: data[0],
    pagination: {
      page: parseInt(currentPage, 10),
      totalItems: total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPre: currentPage > 1
    }
  };
}

const getProfileById = async (id) => {
  const profile = await Profile.findByPk(id);

  if (!profile) {
    throw new NotFoundException('Không tìm thấy hồ sơ này!');
  }

  return profile;
}

const createProfile = async (body) => {
  const data = validateProfile(body);

  const existingProfile = await Profile.findOne({
    where: {
      [Op.or]: [
        { email: data.email },
        { x_username: data.x_username },
        { discord_username: data.discord_username },
        { telegram_phone: data.telegram_phone },
      ],
    },
  });

  if (existingProfile) {
    if (existingProfile.email === data.email) {
      throw new RestApiException('Email đã tồn tại!');
    }
    if (existingProfile.x_username === data.x_username) {
      throw new RestApiException('Username X đã tồn tại!');
    }
    if (existingProfile.discord_username === data.discord_username) {
      throw new RestApiException('Username Discord đã tồn tại!');
    }
    if (existingProfile.telegram_phone === data.telegram_phone) {
      throw new RestApiException('Số điện thoại Telegram đã tồn tại!');
    }
  }

  const createdProfile = await Profile.create({
    ...data,
    x_username: data.x_username || null,
    discord_username: data.discord_username || null,
    discord_password: data.discord_password || null,
    telegram_phone: data.telegram_phone || null,
  });

  return createdProfile;
}

const updateProfile = async (body) => {
  const { id } = body;
  const data = validateProfile(body);

  const existingProfile = await Profile.findOne({
    where: {
      [Op.or]: [
        { email: data.email, id: { [Op.ne]: id } },
        { x_username: data.x_username, id: { [Op.ne]: id } },
        { discord_username: data.discord_username, id: { [Op.ne]: id } },
        { telegram_phone: data.telegram_phone, id: { [Op.ne]: id } },
      ],
    },
  });

  if (existingProfile) {
    if (existingProfile.email === data.email) {
      throw new RestApiException('Email đã tồn tại!');
    }
    if (existingProfile.x_username === data.x_username) {
      throw new RestApiException('Username X đã tồn tại!');
    }
    if (existingProfile.discord_username === data.discord_username) {
      throw new RestApiException('Username Discord đã tồn tại!');
    }
    if (existingProfile.telegram_phone === data.telegram_phone) {
      throw new RestApiException('Số điện thoại Telegram đã tồn tại!');
    }
  }

  const [updatedCount] = await Profile.update({
    ...data,
    x_username: data.x_username || null,
    discord_username: data.discord_username || null,
    discord_password: data.discord_password || null,
    telegram_phone: data.telegram_phone || null,
  }, {
    where: {
      id: id,
    }
  });

  if (!updatedCount) {
    throw new NotFoundException('Không tìm thấy hồ sơ này!');
  }

  const updatedProfile = await Profile.findByPk(id);

  return {
    ...updatedProfile
  };
}

const deleteProfile = async (id) => {
  const [deletedCount] = await Profile.update({
    deletedAt: Sequelize.fn('NOW'),
  }, {
    where: {
      id: id,
    }
  });

  if (!deletedCount) {
    throw new NotFoundException('Không tìm thấy hồ sơ này!');
  }

  return id;
}

const validateProfile = (data) => {
  const { error, value } = profileSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};

const openProfileById = async (id) => {

  const profileData = await getProfileById(id);

  const profile = {
    id: profileData.id,
    name: profileData.email,
  };

  const port = getPortFree();

  const { context, page, chrome } = await openProfile({ profile, port, activate: true });

  addBrowser({
    context,
    page,
    chrome,
    profile,
    port,
  });

  return profile.id;
};

const closeProfileById = async (id) => {

  const profile = getBrowsers().find(b => b?.profile?.id === id);

  if (!profile) {
    return id;
  }

  closingByApiIds.add(id);

  await profile?.chrome?.kill();
  usedPorts.delete(profile?.port);
  removeBrowserById(id);

  return id;
};

const sortProfileLayouts = async () => {
  await sortGridLayout();
}

const openProfilesByIds = async (ids = []) => {
  //1 2 3 4     // 1 2 dang mo ko lay => lay 3,4 chua dc mo
  const filteredIds = ids?.filter((id) => !currentProfiles().includes(id));

  if (filteredIds?.length > 0) {
    const promisesProfile = filteredIds.map(id => getProfileById(id));
    const profilesData = await Promise.all(promisesProfile);

    const profiles = profilesData.map((profile) => {
      return {
        id: profile.id,
        name: profile.email,
      }
    })

    const promises = [];

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      const port = getPortFree();

      // Chạy song song profile  // Bỏ promise sẽ chạy lần lượt
      const promise = new Promise(async (resolve, reject) => {
        try {
          const { context, page, chrome } = await openProfile({ profile, port });
          addBrowser({ context, page, chrome, profile, port });
          resolve();
        } catch (err) {
          reject(err); // 1 reject sẽ failed all promises => not return ids
        }
      });
      promises.push(promise);
    }

    await Promise.all(promises);
    await sortGridLayout(browsers);

    return filteredIds;
  }

  return [];
};

const closeProfilesByIds = async (req) => {
  const { ids } = req.query;
  //1 2 3 4      // 1 2 dang mo => lay 1,2 de dong => 3,4 chua mo ko lay

  const filteredIds = ids?.filter((id) => currentProfiles().includes(id));

  if (filteredIds?.length > 0) {
    const closePromisesProfile = filteredIds.map(async (id) => {
      const profile = getBrowsers().find(b => b?.profile?.id === id);

      if (profile) {
        closingByApiIds.add(id);

        await profile?.chrome?.kill();
        usedPorts.delete(profile?.port);
        removeBrowserById(id);
      }
    });

    await Promise.all(closePromisesProfile);

    return filteredIds;
  }

  return [];
};

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  openProfileById,
  closeProfileById,
  openProfilesByIds,
  closeProfilesByIds,
  sortProfileLayouts,
};



