
// Generated Script test_abc_11
// Created at: 2025-08-18T12:59:07.047Z

async function runScript({context, page, chrome, profile, port}) {
  await page.waitForTimeout(5000);
  await page.goto("http://localhost:5173/dashboard/script/test_abc_11/edit");
  await page.waitForLoadState('networkidle');

  await page.waitForTimeout(5000);
  await page.click('text=Quản Lý Hồ Sơ');
}

const logicItems = [
  {
    "type": "goto-url",
    "id": "goto-url-1754928601836-0.10651572159302825",
    "formData": {
      "timeout": 5000,
      "url": "http://localhost:5173/dashboard/script/test_abc_11/edit"
    }
  },
  {
    "type": "click-text",
    "id": "click-text-1755521814723-0.7705888349981861",
    "formData": {
      "timeout": 5000,
      "text": "Quản Lý Hồ Sơ"
    }
  }
];

export { runScript, logicItems };
