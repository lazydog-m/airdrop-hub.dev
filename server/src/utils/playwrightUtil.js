const { chromium } = require('playwright')
const config = require('../../playwrightConfig');
const path = require('path')
const fs = require('fs')
const { getSocket } = require('../configs/socket');
const RestApiException = require('../exceptions/RestApiException');
const { exec } = require('child_process');

let browsers = [];

const addBrowser = (br) => {
  browsers.push(br);
};

const getBrowsers = () => browsers;

const removeBrowserById = (id) => {
  const newList = browsers.filter(b => b?.profile?.id !== id);
  browsers.length = 0;
  browsers.push(...newList);
};

const currentProfiles = () => browsers.map((br) => br?.profile?.id);

const BASE_PORT = 9222;
const usedPorts = new Set();

const getPortFree = () => {
  let port = BASE_PORT;
  while (usedPorts.has(port)) {
    port++;
  }
  usedPorts.add(port);
  return port;
};

const closingByApiIds = new Set();

let isSortAll = false;
const setIsSortAll = (value) => { isSortAll = value; };

// chạy sript tối đa 21 profile 1 luồng
function createGridLayoutScript(profileCount) {
  const profileWidth = config.PROFILE_SCRIPT_WIDTH;
  const profileHeight = config.PROFILE_SCRIPT_HEIGHT;

  // Tính số cột sao cho vừa với độ rộng màn hình
  const cols = Math.floor(config.SCREEN_WIDTH_FULL / profileWidth);

  const layouts = [];
  for (let i = 0; i < profileCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    layouts.push({
      x: col * profileWidth,
      y: row * profileHeight,
      width: profileWidth,
      height: profileHeight
    });
  }
  return layouts;
}

// sort tối đa 12 profile 1 luồng
// Căn chỉnh theo dạng lưới theo số lượng cửa sổ
function createGridLayout(profileCount) {
  const cols = Math.ceil(Math.sqrt(profileCount));
  const rows = Math.ceil(profileCount / cols);
  const width = Math.floor(config.SCREEN_WIDTH / cols);
  const height = Math.floor(config.SCREEN_HEIGHT / rows);

  const layouts = [];
  for (let i = 0; i < profileCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    layouts.push({
      x: col * width,
      y: row * (height + 0),
      width,
      height
    });
  }
  return layouts;
}

function getLayout(layout) {
  const defaultLayout = {
    x: 0,
    y: 0,
    width: config.SCREEN_WIDTH / 2,
    height: config.SCREEN_HEIGHT
  }

  if (!layout) {
    return defaultLayout;
  }

  return layout;
}

async function sortGridLayout() {
  const layout = createGridLayout(browsers.length);

  for (let i = 0; i < browsers.length; i++) {
    const { page, chrome } = browsers[i];
    const client = await page.context().newCDPSession(page); // kết nối đến profile dựa trên page

    const { windowId } = await client.send("Browser.getWindowForTarget");
    const pos = layout[i];

    await client.send("Browser.setWindowBounds", {
      windowId,
      bounds: {
        left: pos.x,
        top: pos.y,
        width: pos.width,
        height: pos.height,
        windowState: "normal"
      }
    });

    // Nổi cửa sổ
    if (getOs() === 'win32') {
      const pathNircmd = path.join(config.TOOL_DIR, 'nircmd-x64', 'nircmd.exe');
      exec(`"${pathNircmd}" win min process /${chrome.pid}`);
      exec(`"${pathNircmd}" win activate process /${chrome.pid}`);
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeExtensionPages(context) {
  const extConfig = JSON.parse(fs.readFileSync(path.join(config.EXTENSION_DIR, 'config.json'), 'utf8'));

  const startupExts = extConfig
    .filter(ext => ext.openOnStartup);

  let closedExtCount = 0;
  let startupExtTotal = startupExts.length;

  return new Promise((resolve) => {
    if (startupExtTotal === 0) {
      resolve(true);
      return;
    }

    context.on('page', async (page) => {
      // Các page ext (của các ví như metamask, sui...) sẽ được mở bởi các case sau:
      // 1. Chạy profile với 'load-extension' (tùy ví).
      // 2. Do click vào ext ví trên toolbar nếu như ví chưa login ví (tùy ví).
      // 3. Connect ví trong các dApp airdrop sẽ mở popup page ext.

      // Khi 1 page mới được mở, dù có điều hướng đến trang nào đó thì Url của page đó vẫn
      // là blank. Vì nó nhận Url sau khi page mới được mở chứ ko đợi điều hướng đến trang
      // cụ thể rồi mới nhận Url. Ngay cả khi dùng newPage.goto() thì trươc đó newPage
      // cũng đã được mở từ context rồi mới điều hướng trang nên Url cũng sẽ là blank.

      // page.on('framenavigated', async (frame) => {})
      // Đợi page mới mở điều hướng đến trang đích rồi mới nhận Url
      // Các page ext ví được mở bởi các case trên sẽ giống như kiểu framenavigated

      const url = page.url();

      if (closedExtCount >= startupExtTotal) {
        // closed đủ số ext cần close rồi thì thôi
        return;
      }

      if (url.startsWith('chrome-extension://')) {
        try {
          await page.close();
          closedExtCount++; // case bi thieu count se ko done dc loading (mo cung luc se bi)

          if (closedExtCount >= startupExtTotal) {
            resolve(true);
          }
        } catch (err) {
          console.error(`Lỗi đóng ext:`, err);
        }
      }
    });
  });
}

function closeProfileListener(browser, profileId) {
  browser.on('disconnected', () => {
    try {
      if (closingByApiIds.has(profileId)) {
        closingByApiIds.delete(profileId);
        return;
      }

      if (!isSortAll) {
        const profile = browsers.find(b => b?.profile?.id === profileId);

        if (!profile) {
          return;
        }

        usedPorts.delete(profile?.port);
        removeBrowserById(profileId);

        const socket = getSocket();
        socket.emit('profileIdClosed', { id: profileId });
      }
    } catch (error) {
      console.error('Có lỗi khi đóng profile', error.message);
    }
  });
}

const getOs = () => process.platform;

async function openProfile({ profile, port, layout, activate = false }) {
  const profilePath = path.join(config.PROFILE_DIR, profile.name);

  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath, { recursive: true });
  }

  const chromeLauncher = await import('chrome-launcher');
  const chromePath = getOs() === 'win32'
    ? 'C:\\GoogleChromePortable64\\App\\Chrome-bin\\chrome.exe' // version 138 mới có thể dùng load-extension
    : '/usr/bin/google-chrome';

  const profileLayout = getLayout(layout);
  const extensions = fs.readdirSync(config.EXTENSION_DIR)
    .map(ext => path.join(config.EXTENSION_DIR, ext))
    .filter(extPath => fs.statSync(extPath).isDirectory());

  const chromeFlags = [
    // `--app=data:text/html,<html></html>`,
    `--window-position=${profileLayout.x},${profileLayout.y}`,
    `--window-size=${profileLayout.width},${profileLayout.height}`,
    '--no-default-browser-check',
    '--hide-crash-restore-bubble',
    '--no-first-run',
    '--enable-extensions',
    `--load-extension=${extensions.join(',')}`,
    `--disable-extensions-except=${extensions.join(',')}`,
  ];

  if (getOs() !== 'win32') { // linux thì sẽ dùng kiểu này nếu ko sẽ bị tạo folder sai khi dùng userDataDir
    chromeFlags.push(`--user-data-dir=${profilePath}`);
  }

  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      port,
      chromePath,
      userDataDir: getOs() === 'win32' ? profilePath : undefined, // win32 thì sẽ dùng kiểu này nếu ko sẽ bị mất cache khi sử dụng user-data-dir
      chromeFlags,
    });
  } catch (error) {
    usedPorts.delete(port);
    throw new RestApiException(`Mở hồ sơ thất bại: ${error.message}`);
  }

  let context;
  let page;

  try {
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);

    closeProfileListener(browser, profile.id);

    context = browser.contexts()[0];
    page = context.pages()[0] || await context.newPage();

    // ko await khi mở tay profile, vì chỉ khi nó closed xong thì mới thao tác ổn định
    closeExtensionPages(context) // chỉ await khi chạy script tránh xung đọt thao tác

    if (activate && getOs() === 'win32') {
      const pathNircmd = path.join(config.TOOL_DIR, 'nircmd-x64', 'nircmd.exe');
      exec(`"${pathNircmd}" win min process /${chrome.pid}`);
      exec(`"${pathNircmd}" win activate process /${chrome.pid}`);
    }

  } catch (error) {
    usedPorts.delete(port);
    throw new RestApiException(`Mở hồ sơ thất bại: ${error.message}`);
  }


  return { context, page, chrome };
}

// test
async function openProfileTest() {
  const profilePath = path.join(config.PROFILE_TEST_DIR, 'profile_test');
  const profileLayout = getLayout();

  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath, { recursive: true });
  }

  const chromeLauncher = await import('chrome-launcher');
  const chromePath = getOs() === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome';

  const chromeFlags = [
    // `--app=data:text/html,<html></html>`,
    `--window-position=${profileLayout.x},${profileLayout.y}`,
    `--window-size=${profileLayout.width},${profileLayout.height}`,
    '--no-default-browser-check',
    '--hide-crash-restore-bubble',
    '--no-first-run',
    '--enable-extensions',
    `--load-extension=${extensions.join(',')}`,
    `--disable-extensions-except=${extensions.join(',')}`,
  ];

  if (getOs() !== 'win32') {
    chromeFlags.push(`--user-data-dir=${profilePath}`);
  }

  const chrome = await chromeLauncher.launch({
    port: 9221,
    chromePath,
    userDataDir: getOs() === 'win32' ? profilePath : undefined,
    chromeFlags,
  });

  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);

  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  await closeExtensionPages(context)

  return { context, page, chrome };
}

// async function openProfileForScript(profilePath, index) {

//     const WIDTH = 500
//     const HEIGHT = 310
//     const cols = 4

//     const x = (index % cols) * WIDTH
//     const y = Math.floor(index / cols) * (HEIGHT + 40)

//     const context = await chromium.launchPersistentContext(profilePath, {
//         headless: false,
//         chromiumSandbox: false,
//         ignoreDefaultArgs: ["--enable-automation", "--no-sandbox", '--disable-blink-features=AutomationControlled'],
//         args: [
//             `--window-size=${WIDTH},${HEIGHT}`,
//             `--window-position=${x},${y}`,
//             '--no-sandbox',
//             '--disable-blink-features=AutomationControlled',
//             `--disable-extensions-except=${config.extensions.join(',')}`,
//             `--load-extension=${config.extensions.join(',')}`,
//         ],
//         // userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
//     })

// return { context, page };


module.exports = {
  openProfile,
  openProfileTest,
  createGridLayout,
  delay,
  browsers,
  getBrowsers,
  addBrowser,
  removeBrowserById,
  currentProfiles,
  closingByApiIds,
  setIsSortAll,
  usedPorts,
  getPortFree,
  sortGridLayout,
}
