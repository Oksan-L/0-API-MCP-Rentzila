- всі тести
`npx playwright test`

- тільки auth папку
`npx playwright test tests/auth`

- з виводом в консоль (без HTML репорту)
`npx playwright test --reporter=list`

- один файл
`npx playwright test tests/auth/login.spec.ts`

- orders потрібно запускати `--workers=1`