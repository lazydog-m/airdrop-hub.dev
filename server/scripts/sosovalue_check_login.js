
// Generated Script sosovalue_check_login

async function runScript({context, page, chrome, profile, port}) {
    // ===== 🎬 GOTO URL =====
    // 🎯 Description: 
    {
      const start = Date.now();
      try {
        // 🎭 Automation
        await page.waitForTimeout(5000);
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
}

const logicItems = [
  {
    "type": "goto-url",
    "id": "goto-url-1755522004163-0.8988931160006685",
    "formData": {
      "description": "",
      "delay_time": 2000,
      "url": ""
    }
  }
];

export { runScript, logicItems };
