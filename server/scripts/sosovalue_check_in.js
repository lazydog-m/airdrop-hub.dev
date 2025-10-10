
// Generated Script sosovalue_check_in

async function runScript({context, page, chrome, profile, port}) {
    // ===== 🎬 GOTO URL =====
    // 🎯 Description: 
    {
      const start = Date.now();
      try {
        // 🎭 Automation
        await page.waitForTimeout(8000);
        await page.goto("");
        await page.waitForLoadState('networkidle');

        // 🛰️ Log
        const log = {
          time: new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Ho_Chi_Minh" }),
          action: "Goto URL",
          duration: Date.now() - start,
          status: "Success"
        };
        socket.emit('logs', { log });
      } catch (error) {
        // 🛰️ Log
        const log = {
          time: new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Ho_Chi_Minh" }),
          action: "Goto URL",
          duration: Date.now() - start,
          status: "Error",
          message: error.message
        };
        socket.emit('logs', { log });
      }
    }

    // ===== 🎬 GOTO URL =====
    // 🎯 Description: 
    {
      const start = Date.now();
      try {
        // 🎭 Automation
        await page.waitForTimeout(3000);
        await page.goto("chrome-extension://fkmncgdneopbblabemkabnmdicgejogi/home.html");
        await page.waitForLoadState('networkidle');

        // 🛰️ Log
        const log = {
          time: new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Ho_Chi_Minh" }),
          action: "Goto URL",
          duration: Date.now() - start,
          status: "Success"
        };
        socket.emit('logs', { log });
      } catch (error) {
        // 🛰️ Log
        const log = {
          time: new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Ho_Chi_Minh" }),
          action: "Goto URL",
          duration: Date.now() - start,
          status: "Error",
          message: error.message
        };
        socket.emit('logs', { log });
      }
    }
}

const logicItems = [
  {
    "type": "goto-url",
    "id": "goto-url-1759588108978-0.842266872775595",
    "formData": {
      "description": "",
      "delayTime": 8000,
      "url": "",
      "timeout": 30000
    }
  },
  {
    "type": "goto-url",
    "id": "goto-url-1754928601836-0.10651572159302825",
    "formData": {
      "description": "",
      "delayTime": 3000,
      "url": "chrome-extension://fkmncgdneopbblabemkabnmdicgejogi/home.html"
    }
  }
];

export { runScript, logicItems };
