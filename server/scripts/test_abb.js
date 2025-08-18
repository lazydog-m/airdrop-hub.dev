
// Generated Script test_abb
// Created at: 2025-08-18T12:58:53.611Z

async function runScript({context, page, chrome, profile, port}) {
  await page.waitForTimeout(5000);
  await page.goto("");
  await page.waitForLoadState('networkidle');
}

const logicItems = [
  {
    "type": "goto-url",
    "id": "goto-url-1755522004163-0.8988931160006685",
    "formData": {
      "timeout": 5000,
      "url": ""
    }
  }
];

export { runScript, logicItems };
