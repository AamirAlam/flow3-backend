# Flow 3 Backend

This is scaffolded out when you run `npx @temporalio/create@latest ./flow3-backend`.

### Running this project

1. `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
2. `pnpm install` to install dependencies.
3. `pnpm run start:worker` to start the Worker.
4. `pnpm run start:api` to start the Worker.
5. In another shell, `npm run workflow` to run the Workflow Client.
