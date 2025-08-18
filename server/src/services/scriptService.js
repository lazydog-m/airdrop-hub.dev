const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const { Op, Sequelize } = require('sequelize');
const Wallet = require('../models/wallet');
const { WalletStatus, TRASH_DATA_TYPE, Pagination } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const ProfileWallet = require('../models/profile_wallet');
const sequelize = require('../configs/dbConnection');
const config = require('../../playwrightConfig');
const path = require('path')
const fs = require('fs');
const { openProfileTest } = require('../utils/playwrightUtil');

const scriptSchema = Joi.object({
  fileName: Joi.string()
    .pattern(/^[a-z0-9]+(?:_[a-z0-9]+)*$/) // chỉ snake_case
    .required()
    .max(50)
    .messages({
      'string.empty': 'Tên file không được bỏ trống!',
      'any.required': 'Tên file không được bỏ trống!',
      'string.max': 'Tên file chỉ đươc phép dài tối đa 50 ký tự!',
      'string.pattern.base': 'Tên file không hợp lệ!',
    }),
  // password: Joi.string().required().max(255).messages({
  //   'string.empty': 'Mật khẩu ví không được bỏ trống!',
  //   'any.required': 'Mật khẩu ví không được bỏ trống!',
  //   'string.max': 'Mật khẩu ví chỉ đươc phép dài tối đa 255 ký tự!',
  // }),
  // status: Joi
  //   .valid(WalletStatus.UN_ACTIVE, WalletStatus.IN_ACTIVE)
  //   .messages({
  //     'any.only': 'Trạng thái ví không hợp lệ!'
  //   }),
});

const getAllScripts = async (req) => {
  const { page, search } = req.query;

  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * Pagination.limit;

  // Đọc danh sách file .js trong scripts/
  const files = fs
    .readdirSync(config.SCRIPT_DIR)
    .filter(file => file.endsWith(".js"));

  let fileInfos = files.map(file => {
    const filePath = path.join(config.SCRIPT_DIR, file);
    const stats = fs.statSync(filePath);
    return {
      fileName: path.basename(file, ".js"), // bỏ .js
      id: path.basename(file, ".js"), // bỏ .js
      createdAt: stats.birthtime, // thời gian tạo file
    };
  });

  // Search theo fileName (không phân biệt hoa thường)
  if (search) {
    const keyword = search.toLowerCase();
    fileInfos = fileInfos.filter(f =>
      f.fileName.toLowerCase().includes(keyword)
    );
  }

  fileInfos.sort((a, b) => b.createdAt - a.createdAt);

  const total = fileInfos.length;
  const totalPages = Math.ceil(total / Pagination.limit);
  const result = fileInfos.slice(offset, offset + Pagination.limit);

  return {
    data: result,
    pagination: {
      page: parseInt(currentPage, 10),
      totalItems: total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPre: currentPage > 1
    }
  };

}

const getScriptByFileName = async (fileName) => {
  const scriptPath = path.join(config.SCRIPT_DIR, `${fileName}.js`);

  if (!fs.existsSync(scriptPath)) {
    throw new NotFoundException(`Không tìm thấy file script này!`)
  }

  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  const match = scriptContent.match(/const\s+logicItems\s*=\s*(\[[\s\S]*?\]);/);

  if (!match) {
    throw new NotFoundException(`Không tìm thấy logicItems trong file script này!`)
  }

  const logicItems = JSON.parse(match[1]);

  return { fileName, logicItems };
}

const createScript = async (body) => {
  validateScript(body);

  const { fileName, code, logicItems } = body;

  const scriptPath = path.join(config.SCRIPT_DIR, `${fileName}.js`);

  if (fs.existsSync(scriptPath)) {
    throw new RestApiException(`File script ${fileName} đã tồn tại!`);
  }

  const fileContent = `
// Generated Script ${fileName}

async function runScript({context, page, chrome, profile, port}) {
${code
      .split('\n')
      .map(line => line?.trim() === '' ? '' : '  ' + line)
      .join('\n')}
}

const logicItems = ${JSON.stringify(logicItems, null, 2)};

export { runScript, logicItems };
`;

  fs.writeFileSync(scriptPath, fileContent, 'utf8');

  return fileName;
}

const updateScript = async (body) => {
  validateScript(body);

  const { oldFileName, fileName, code, logicItems } = body;

  const scriptOldPath = path.join(config.SCRIPT_DIR, `${oldFileName}.js`);
  const scriptNewPath = path.join(config.SCRIPT_DIR, `${fileName}.js`);

  if (!fs.existsSync(scriptOldPath)) {
    throw new NotFoundException(`File script ${oldFileName} không tồn tại!`);
  }

  if (fileName !== oldFileName && fs.existsSync(scriptNewPath)) {
    throw new RestApiException(`File script ${fileName} đã tồn tại!`);
  }

  const fileContent = `
// Generated Script ${fileName}

async function runScript({context, page, chrome, profile, port}) {
${code
      .split('\n')
      .map(line => line?.trim() === '' ? '' : '  ' + line)
      .join('\n')}
}

const logicItems = ${JSON.stringify(logicItems, null, 2)};

export { runScript, logicItems };
`;

  if (fileName !== oldFileName) {
    fs.unlinkSync(scriptOldPath);
  }
  fs.writeFileSync(scriptNewPath, fileContent, 'utf8');

  return fileName;
}

const runTestScript = async (code) => {
  const { context, page, chrome } = await openProfileTest();

  try {
    const fn = new Function("page", "context", "chrome", `
      return (async () => {
        ${code}
      })();
    `);

    await fn(page, context, chrome);

  } catch (err) {
    console.error("❌ Script lỗi:", err);
  }
}

const deleteScript = async (fileName) => {
  // đọc ghi file nặng load lâu thì các api khác có phải chờ đọc ghi xong mới chạy được hay ko ?

  const scriptPath = path.join(config.SCRIPT_DIR, `${fileName}.js`);

  if (!fs.existsSync(scriptPath)) {
    throw new NotFoundException(`Không tìm thấy file script này!`)
  }

  fs.unlinkSync(scriptPath);

  return fileName;
}

const validateScript = (data) => {
  const { error, value } = scriptSchema.validate(data, { stripUnknown: true });

  if (error) {
    throw new ValidationException(error.details[0].message);
  }

  return value;
};


module.exports = {
  createScript,
  getScriptByFileName,
  updateScript,
  getAllScripts,
  deleteScript,
  runTestScript,
};



