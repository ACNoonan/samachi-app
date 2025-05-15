# samachi-api
API backend for Samachi
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
>>>>>>> f8e25e6 (Initial commit from Create Next App)

## Dev environment setup

### Creating/Running Tests

The project is currently using Jest (specifically, `ts-jest`) as a test-runner.

### Setup

The dependencies have been added to `package.json` under `"devDependencies"`, but in case you need to reconstruct them:

```bash
npm install --save-dev ts-jest ts-node jest supertest node-mocks-http @types/jest @types/supertest`
```

The project root also creates a `jest.config.ts` file, with the following configuration:

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
};

export default config;
```

And it includes the following, added to `tsconfig.json`:

```js
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

### Tests Location

Tests are being stored under the `__tests__/` folder, in the project root. The folder structure inside `__tests__` matches the project's code folder structure. So, for example:

**Code Module:** `app/api/org/[org_id]/users/route.ts'`

**Tests Location:** `__tests__/api/org/[org_id]/users/users/users.test.ts`

This way, both code files are kept at the end of identical folder paths, in hopes that this will help us keep straight which tests belong to which file. In addition, the *.test.ts file itself contains an import statement that points to the exact code being tested, In this case:

```ts
import { GET } from '@/app/api/org/[org_id]/users/route';
```

(Note that the `@/` has been aliased to the project root with a parameter in `tsconfig.json` like this:

```js
"paths": { "@/*": ["./*"] },
```

 This is why it's not necessary to type the include path using `../../../`.

### Debugging

Debugging tests has been enabled for VSCode/VSCode-derivatives (e.g., _Cursor_) with another config in the `.vscode/launch.json` file:

```js
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

To debug through tests, set a breakpoint at the desired spot in code (in either the test or the application code), and then select/run the **Debug Jest Tests** configuration from the VSCode debugger.
