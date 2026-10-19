# Banana Quest

Banana Quest is a web project with a React frontend built with Vite and a Node.js server workspace.

## Project structure

- `client/` — React 19 application and Vite development/build tooling.
- `server/` — Node.js server workspace with Express, Mongoose, CORS, and dotenv dependencies.

The client currently contains the Vite starter screen. The server workspace does not yet define an application entry point or start script.

## Prerequisites

- Node.js and npm

## Run the client

From the repository root:

```sh
cd client
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Client commands

Run these from `client/`:

```sh
npm run dev      # Start the development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run Oxlint
```

## Server

The server dependencies can be installed from `server/` with `npm install`. A server entry point and start script have not been added yet.
