# Apollo Gears CLI

A CLI tool for scaffolding and managing Apollo Gears backend projects (Express + TypeScript + Prisma + PostgreSQL).

## Installation

### Global Installation

To install the CLI globally:

```bash
npm install -g apollo-cli
```

### Local Development Setup

If you are developing this tool locally and want to test it:

1.  **Build the CLI**:
    ```bash
    npm run build
    ```

2.  **Link it globally**:
    ```bash
    npm link
    ```
    This makes the `apollo-cli` command available in your terminal.

## Usage

### 1. `generate` (alias: `g`)

Generates a new module structure including controller, service, route, interface, validation, and constants.

**Syntax:**
```bash
apollo-cli generate module <ModuleName>
# OR
apollo-cli g module <ModuleName>
```

**Example:**
Generate a `User` module:
```bash
apollo-cli g module User
```

This will create the following files in `src/app/modules/User`:
- `user.controller.ts`
- `user.service.ts`
- `user.route.ts`
- `user.interface.ts`
- `user.validation.ts`
- `user.constant.ts`

### 2. `build`

Builds the application for production deployment.

**Syntax:**
```bash
apollo-cli build
```

**What it does:**
- Cleans the `dist` folder.
- Compiles TypeScript files.
- Copies `package.json`, `package-lock.json`, and `.env` to the `dist` folder.

### 3. `prisma`

Helper commands for Prisma ORM.

**Generate Client:**
```bash
apollo-cli prisma generate
```
*(Runs `npx prisma generate`)*

**Run Migrations:**
```bash
apollo-cli prisma migrate
```
*(Runs `npx prisma migrate dev`)*

## Development

To run the CLI directly from source without building:

```bash
npx ts-node src/bin/index.ts <command>
```
Example:
```bash
npx ts-node src/bin/index.ts generate module Product
```
