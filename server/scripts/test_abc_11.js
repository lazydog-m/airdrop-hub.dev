
// Generated Script test_abc_11
// Created at: 2025-08-13T14:17:41.599Z

async function runScript({context, page, chrome, profile, port}) {
  await page.waitForTimeout(5000);
  await page.goto("http://localhost:5173/dashboard/script/test_abc_11/edit");
  await page.waitForLoadState('networkidle');
}

const logicItems = [
  {
    "type": "goto-url",
    "id": "goto-url-1754928601836-0.10651572159302825",
    "formData": {
      "timeout": 5000,
      "url": "http://localhost:5173/dashboard/script/test_abc_11/edit"
    }
  }
];

export { runScript, logicItems };
