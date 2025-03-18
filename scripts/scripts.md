# Scripts Usage Manual

This document provides a list and usage instructions for the scripts located in the `scripts/` directory.

## List of Scripts

1.  **[pre-test.sh](scripts/pre-test.sh)**:
    *   **Description**: Updates the date in the testing roadmap and verifies the existence of necessary files before running tests.
    *   **Usage**: Execute this script before running tests to ensure the testing environment is properly set up.
    *   **How to Run**: `bash scripts/pre-test.sh`

2.  **[setup-dev-env.sh](scripts/setup-dev-env.sh)**:
    *   **Description**: Automates the setup of the development environment for Doc-Muse, including checking for required tools, Supabase configuration, installing dependencies, and Docker setup.
    *   **Usage**: Run this script to quickly set up your local development environment.
    *   **How to Run**:
        ```bash
        chmod +x scripts/setup-dev-env.sh
        ./scripts/setup-dev-env.sh
        ```

3.  **[sync-env.sh](scripts/sync-env.sh)**:
    *   **Description**: Synchronizes environment variables between `.env.local` and `.env` files, ensuring that Docker Compose and Next.js use the same variables.
    *   **Usage**: Use this script to keep your environment variables consistent across different environments.
    *   **How to Run**: `bash scripts/sync-env.sh`

4.  **[update-roadmap-date.js](scripts/update-roadmap-date.js)** / **[update-roadmap-date.mjs](scripts/update-roadmap-date.mjs)**:
    *   **Description**: Updates the date in the testing roadmap file (`Docs/testing/testing_roadmap.md`). The `.js` version uses `toISOString()` for date formatting, while the `.mjs` version uses `toLocaleDateString('es-ES')`.
    *   **Usage**: Run this script to automatically update the roadmap date.
    *   **How to Run**: `node scripts/update-roadmap-date.js` or `node scripts/update-roadmap-date.mjs`

5.  **[verify_build.sh](scripts/verify_build.sh)**:
    *   **Description**: Verifies the project build and deployment steps, including checking Node.js and pnpm versions, installing dependencies, running TypeScript checks, building the project, and checking Docker containers.
    *   **Usage**: Execute this script to ensure that the project builds successfully and that all dependencies are correctly installed.
    *   **How to Run**: `bash scripts/verify_build.sh`

## Usage Details

### [pre-test.sh](scripts/pre-test.sh)

This script is designed to be run before executing tests. It performs the following actions:

1.  **Updates Roadmap Date**: Calls `node scripts/update-roadmap-date.js` to update the date in the `Docs/testing/testing_roadmap.md` file.
2.  **Verifies File Existence**: Checks for the existence of critical files required for testing, such as React components and context files.

### [setup-dev-env.sh](scripts/setup-dev-env.sh)

This script automates the setup of the development environment. It guides you through:

1.  **Checking Required Tools**: Verifies that Git, Node.js, pnpm, and Docker are installed.
2.  **Repository Setup**: Clones the Doc-Muse repository if it doesn't exist or updates it if it does.
3.  **Supabase Configuration**: Prompts you to enter your Supabase URL and anon key and updates the `.env.local` file.
4.  **Database Initialization**: Guides you to run SQL migration files in the Supabase SQL Editor.
5.  **Dependency Installation**: Installs project dependencies using `pnpm install`.
6.  **Docker Setup**: Optionally builds and runs the project using Docker.
7.  **Local Development Setup**: Starts the local development server.

### [sync-env.sh](scripts/sync-env.sh)

This script ensures that the environment variables used by Next.js and Docker Compose are consistent. It copies the variables from `.env.local` to `.env` or vice versa, depending on which file exists.

### [update-roadmap-date.js](scripts/update-roadmap-date.js) / [update-roadmap-date.mjs](scripts/update-roadmap-date.mjs)

These scripts update the date in the `Docs/testing/testing_roadmap.md` file. They read the file, replace the `[CURRENT_DATE]` placeholder with the current date, and write the updated content back to the file.

### [verify_build.sh](scripts/verify_build.sh)

This script is used to verify the build and deployment process. It performs the following steps:

1.  **Checks Versions**: Checks the versions of Node.js and pnpm.
2.  **Cleans Artifacts**: Removes previous build artifacts.
3.  **Installs Dependencies**: Installs project dependencies.
4.  **TypeScript Check**: Runs a TypeScript check.
5.  **Builds Project**: Builds the project.
6.  **Docker Check**: Checks if Docker is running and optionally starts Docker containers, verifies Supabase and frontend accessibility.
