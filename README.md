# Device Mate

A full-stack web application for chatting and transferring files, built with **React.js**, **Node.js**, and **MySQL**.

Repository: https://github.com/Muhannad-Alrashed/Device-Mate

## Overview

Device Mate brings messaging and file sharing together in a web application. The project is organized into a frontend client and a backend server:

- **Client (`client/`)** — the web interface built with React.
- **Server (`server/`)** — the Node.js application that supports the client.
- **Database** — MySQL is listed as the application's database technology.

> **Note:** This README is based on the repository's published description and visible top-level structure. Exact features, environment variable names, database initialization steps, and npm scripts should be confirmed against the source files before deployment.

## Contents

- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React.js |
| Backend | Node.js |
| Database | MySQL |

## Repository Structure

```text
Device-Mate/
├── client/       # React frontend
├── server/       # Node.js backend
├── .vscode/      # Editor configuration
└── README.md
```

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) and npm
- [MySQL](https://www.mysql.com/) server
- Git

Use a Node.js version compatible with the dependencies specified in the `client/package.json` and `server/package.json` files.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Muhannad-Alrashed/Device-Mate.git
cd Device-Mate
```

### 2. Install dependencies

Install the frontend and backend dependencies separately:

```bash
cd client
npm install
```

Then, from the repository root:

```bash
cd ../server
npm install
```

### 3. Configure MySQL and the server

Make sure your MySQL server is running. Inspect the server source and any included SQL files to determine the database name, required tables, and initialization procedure.

If the server uses environment variables, create the expected local environment file based on the configuration read by the server. Set the database host, port, username, password, and database name as required by the actual implementation.

Do not commit passwords, API keys, or other secrets to source control.

## Running the Application

The exact npm scripts and required configuration should be checked in each package's `package.json`.

In separate terminals, start the client and server using the scripts defined by their respective packages. For example, if a package defines a `start` script, run:

```bash
npm start
```

If it defines a `dev` script instead, use:

```bash
npm run dev
```

Run the command from the relevant `client/` or `server/` directory. Once both services are running, open the local address printed by the frontend development server in your browser.

> The commands above are conditional examples, not a claim that both scripts are defined in this repository. Check each package's `scripts` section for the supported commands and ports.

## Troubleshooting

- **Dependency installation fails:** Check your Node.js/npm versions and review the error output.
- **Database connection errors:** Confirm MySQL is running and that the configured credentials and database name match your local setup.
- **The frontend cannot reach the backend:** Check the server's startup output, API address, and any client-side API configuration or CORS settings.
- **A start command is unavailable:** Open the relevant `package.json` and use one of the scripts listed under `scripts`.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Make and test your changes locally.
4. Commit your work with a clear message.
5. Open a pull request describing the change.

For bugs or feature requests, open an issue in the [GitHub repository](https://github.com/Muhannad-Alrashed/Device-Mate).

## License

No license information was confirmed from the repository overview during preparation of this README. Check the repository for a `LICENSE` file before redistributing or reusing the project.

