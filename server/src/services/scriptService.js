const NotFoundException = require('../exceptions/NotFoundException');
const ValidationException = require('../exceptions/ValidationException');
const Joi = require('joi');
const { Op, Sequelize } = require('sequelize');
const { Pagination } = require('../enums');
const RestApiException = require('../exceptions/RestApiException');
const sequelize = require('../configs/dbConnection');
const config = require('../../playwrightConfig');
const path = require('path')
const fs = require('fs');
const {
  openProfileTest,
  setBrowserTest,
  getBrowserTest,
  setIsStop,
  reConnectBrowser,
  delay,
  getValidPages
} = require('../utils/playwrightUtil');
const { getSocket } = require('../configs/socket');

const scriptSchema = Joi.object({
  fileName: Joi.string().trim()
    .pattern(/^[a-z0-9]+(?:_[a-z0-9]+)*$/) // chỉ snake_case
    .required()
    .max(50)
    .messages({
      'string.base': 'Tên script phải là chuỗi',
      'string.empty': 'Tên script không được bỏ trống!',
      'any.required': 'Tên script không được bỏ trống!',
      'string.max': 'Tên script chỉ đươc phép dài tối đa 50 ký tự!',
      'string.pattern.base': 'Tên script không hợp lệ!',
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

const getAllScriptsByProject = async (req) => {
  const { projectName } = req.query;

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

  if (projectName) {
    let baseName = projectName.toLowerCase();

    // bỏ phần trong ngoặc: (Season 2), (test), ...
    baseName = baseName.replace(/\(.*?\)/g, "").trim();

    // nếu có số ở cuối tên, bỏ đi (SoSoValue 2 -> SoSoValue)
    baseName = baseName.replace(/\s+\d+$/, "").trim();

    fileInfos = fileInfos.filter(f =>
      f.fileName.toLowerCase().includes(baseName)
    );
  }

  fileInfos.sort((a, b) => b.createdAt - a.createdAt);

  return fileInfos;

}

const getScriptByFileName = async (fileName) => {
  const scriptPath = path.join(config.SCRIPT_DIR, `${fileName}.js`);

  if (!fs.existsSync(scriptPath)) {
    throw new NotFoundException(`Không tìm thấy kịch bản này!`)
  }

  const scriptContent = fs.readFileSync(scriptPath, 'utf8');

  const match = scriptContent?.match(/const\s+logicItems\s*=\s*(\[[\s\S]*?\]);/);

  let logicItems = [];

  if (match) {
    logicItems = JSON.parse(match[1]);
  }

  return { fileName, logicItems };
}

const createScript = async (body) => {
  validateScript(body);

  const { fileName, code, logicItems } = body;

  const scriptPath = path.join(config.SCRIPT_DIR, `${fileName}.js`);

  if (fs.existsSync(scriptPath)) {
    throw new RestApiException(`Tên kịch bản ${fileName} đã tồn tại!`);
  }

  const fileContent = `
// Generated Script ${fileName}

async function runScript({context, page, chrome, profile, port}) {
${code ? code
      ?.split('\n')
      ?.map(line => line?.trim() === '' ? '' : '  ' + line)
      ?.join('\n')
      : "  return;"
    }
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
    throw new NotFoundException(`Không tìm thấy kịch bản này!`)
  }

  if (fileName !== oldFileName && fs.existsSync(scriptNewPath)) {
    throw new RestApiException(`Tên kịch bản ${fileName} đã tồn tại!`);
  }

  const fileContent = `
// Generated Script ${fileName}

async function runScript({context, page, chrome, profile, port}) {
${code ? code
      ?.split('\n')
      ?.map(line => line?.trim() === '' ? '' : '  ' + line)
      ?.join('\n')
      : "  return;"
    }
}

const logicItems = ${JSON.stringify(logicItems, null, 2)};

export { runScript, logicItems };
`;

  if (fileName !== oldFileName) {
    // fs.unlinkSync(scriptOldPath);
    fs.renameSync(scriptOldPath, scriptNewPath);
  }
  fs.writeFileSync(scriptNewPath, fileContent, 'utf8');

  return fileName;
}

const deleteScript = async (fileName) => {
  // đọc ghi file nặng load lâu thì các api khác có phải chờ đọc ghi xong mới chạy được hay ko ?

  const scriptPath = path.join(config.SCRIPT_DIR, `${fileName}.js`);

  if (!fs.existsSync(scriptPath)) {
    throw new NotFoundException(`Không tìm thấy kịch bản này!`)
  }

  fs.unlinkSync(scriptPath);

  return fileName;
}

const script = async ({ page, context, chrome, code }) => {

  const socket = getSocket();

  const fn = new Function("page", "context", "chrome", "socket", `
  return (async () => {
    ${code}

    socket.emit('scriptCompleted', { completed: true });
  })();
`);

  // ko await script chạy xong mới done api => done khi mở profile đã close pages extension
  fn(page, context, chrome, socket).catch(err => {
    socket.emit('scriptCompleted', { completed: true }); // có lỗi trong code mà ko bắt try catch thì dừng luôn
    console.error("❌ Có lỗi khi chạy kịch bản:", err);
  });

}

const runScript = async (code) => {

  const profileTest = getBrowserTest();

  if (Object.keys(profileTest).length <= 0) {
    const { context, page, chrome } = await openProfileTest({ runScript: true });

    setBrowserTest({
      context,
      page,
      chrome,
    });

    // khi chưa mở profile
    // chạy script ở page[0] => nếu đóng page đó thì script bị lỗi => dừng script
    script({ context, page, chrome, code })

  }
  else {
    const { context, chrome, browser } = profileTest;
    // khi đang mở profile
    // tìm ra 1 page đang được mở => chạy script (nên để 1 page để chạy, 2 page trở lên sẽ random)

    if (!browser) {
      const pages = getValidPages(context);
      const getPage = pages[0] || await context.newPage();
      script({ context, page: getPage, chrome, code })
    }
    else {
      const getContext = browser.contexts()[0];
      const pages = getValidPages(getContext);
      const getPage = pages[0] || await context.newPage();

      setBrowserTest({
        context: getContext,
        page: getPage,
        chrome,
        browser: null,
      });

      script({ context: getContext, page: getPage, chrome, code })
    }
    // active
  }
}

const stopScript = async () => {

  const profileTest = getBrowserTest();
  const { chrome } = profileTest;

  if (Object.keys(profileTest).length <= 0) {
    return true;
  }

  setIsStop(true);
  // context.close sẽ ăn vào disconnected => isStop là true => set isStop = false
  await profileTest?.context?.close(); // nếu đang chạy code js sẽ ko dừng ngay mà chờ đến khi chạy code playwright mới dừng
  // attach lại event disconnected => isStop = false => ăn click bằng X
  const { browser } = await reConnectBrowser({ chrome });

  if (browser) {
    setBrowserTest({
      context: null,
      page: null,
      chrome,
      browser,
    });
  }

  return true;
};


const openProfile = async () => {

  const { context, page, chrome } = await openProfileTest({ runScript: false });

  setBrowserTest({
    context,
    page,
    chrome,
  });

  return true;
};

const closeProfile = async () => {

  const profileTest = getBrowserTest();

  if (Object.keys(profileTest).length <= 0) {
    return true;
  }

  await profileTest?.chrome?.kill();
  setBrowserTest({})

  return true;
};

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
  runScript,
  openProfile,
  closeProfile,
  stopScript,
  getAllScriptsByProject
};
