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

### Defining/Using Object Schemas

Since this is TypeScript, let's keep our types tight. To that end, API GET routes don't return arrays of generic 'objects', they return one or more *specific types* of object.

For example, `https://<domain>/api/venue/` returns an `Array` of `Venue` objects.

#### Setup - Create Schema Definitions in `models/` Directory

Common data objects are defined in `<root>/models/` using *a single schema file per object*. `Venue`, for example, is described in the file `/models/Venue.ts`, and as of this writing (15 May 2025), it looks like this:

```js
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Venue {
  id: string;
  name: string;
  address: string | null;
  glownet_venue_id: string | null;
  primary_contact: string | null;
  secondary_contact?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

#### Building a Single Reference Schema

We've using `typescript-json-schema` ([npm link](https://www.npmjs.com/package/typescript-json-schema)) to generate a single `schemas.json` file (also in `models/`) that compiles all of the object definitions into a single schema. This is useful because it can be read by Swagger and used in the Swagger UI endpoint.

We've provided several options for regenerating the `schemas.json` file: 

1. We have added a build command to the `scripts` section of `package.json` to allow running the following:

```bash
pnpm run build:schemas
```

2. Alternatively, running

```bash
pnpm build
```

will also recreate the `models/schemas.json` file, because it also runs the command to rebuild the schemas file.

3. Finally you can run the command manually, in case you want to change some of the options. Running:

```bash
pnpm typescript-json-schema models/tsconfig.schemas.json "*" --required
```

from the command-line will generate a schema from the files in `models/` and dump it to the terminal (because it's missing the `--output` argument), while

```bash
pnpm typescript-json-schema models/tsconfig.schemas.json "*" --required --output models/schemas.json
```

will simply regenerate the `models/schemas.json` file.

#### Using the Schemas with Swagger

Finally, the whole purpose for generating a `schemas.json` file: so that we can include it in Swagger definitions without having to rewrite it for each method that uses it.

Using the route `GET https://\<domain>/api/venue/` as an example: the JSDoc-style comment for this handler (in `api/venue/route.ts`) looks like this:

```js
/**
 * @swagger
 * /api/venue/: 
 *  get:
 *    summary: Get all venues
 *    description: Gets array of Venue objects for all venues represented in the DB.
 *    responses:
 *      200:
 *        description: Array of Venue records
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Venue'
 */
```

Note the `$ref:` property at the bottom: it references the Venue schema definition, which it's getting from the the `models/schemas.json` file. This allows Swagger to produce something like the following:

![SwaggerUI for /api/venue/](https://github.com/ACNoonan/samachi-app/blob/master/readme-assets/swaggerui-example-venue-api-route.png)

### Creating/Running Tests

The project is currently using Jest (specifically, `ts-jest`) as a test-runner.

#### Setup

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

#### Tests Location

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

#### Debugging

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
