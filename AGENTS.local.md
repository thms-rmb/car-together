# Browser automation

Use `/home/thomas/.npm-global/bin/playwright-cli` (not on PATH), outside the sandbox.

Write `/tmp/car-together-playwright.json`:
```json
{"browser":{"browserName":"firefox","launchOptions":{"executablePath":"/home/thomas/.cache/ms-playwright/firefox-1530/firefox/firefox","headless":true}}}
```

```bash
/home/thomas/.npm-global/bin/playwright-cli open http://localhost:8080 --config=/tmp/car-together-playwright.json
/home/thomas/.npm-global/bin/playwright-cli close
```
