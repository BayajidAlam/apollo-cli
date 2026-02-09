# Apollo Gears CLI

A powerful CLI tool for scaffolding and managing **Apollo Gears** backend projects (Express + TypeScript + Prisma + PostgreSQL).

## Installation

Install the CLI globally via npm:

```bash
npm install -g @bayajidalam/apollo-cli
```

## Usage

### 1. Initialize a New Project

Create a complete backend project structure with Express, Prisma, and TypeScript configured.

```bash
apollo-cli init my-new-project
```

During init, the CLI:
- Fetches the latest versions of all dependencies from npm
- Creates a `prisma/schema.prisma` file and `prisma` folder
- Lets you choose npm, yarn, or pnpm for installation

### 2. Generate Modules

Scaffold a new module (Controller, Service, Route, Interface, Validation, Constants) instantly.

**Alias**: `g`

**Important:** You must run this command *inside* your project directory.

```bash
cd my-new-project
# Using full command
apollo-cli generate module User

# Using alias
apollo-cli g module User
```

This will create `src/app/modules/User` with:
- `user.controller.ts`: Request handlers
- `user.service.ts`: Business logic
- `user.route.ts`: Express routes
- `user.interface.ts`: TypeScript interfaces
- `user.validation.ts`: Zod validation schemas
- `user.constant.ts`: Module constants

### 3. Build for Production

Builds your TypeScript application to the `dist` folder.

```bash
apollo-cli build
```

### 4. Prisma Utilities

Convenient wrappers for common Prisma commands.

```bash
# Generate Prisma Client (runs: npx prisma generate)
apollo-cli prisma generate

# Run Migrations (runs: npx prisma migrate dev)
apollo-cli prisma migrate
```

## License

ISC
