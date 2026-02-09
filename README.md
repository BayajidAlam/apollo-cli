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

- **Latest Dependencies**: Fetches the latest versions of all packages from npm.
- **Database Setup**: Configures Prisma with PostgreSQL adapter (`@prisma/adapter-pg`) for optimized connection pooling.
- **Strict TypeScript**: Generates a strict `tsconfig.json` for type safety.
- **Structure**: Creates a modular `src` folder structure with `modules`, `middlewares`, `routes`, `utils`, `errors`, `config`, and `lib`.

### 2. Generate Modules

Scaffold a new module (Controller, Service, Route, Interface, Validation, Constants) instantly.

**Alias**:

**Important:** You must run this command _inside_ your project directory.

```bash
cd my-new-project
# Using full command
apollo-cli generate module User

# Using alias
apollo-cli g module User
```

This will create `src/modules/User` with:

- `user.controller.ts`: Request handlers
- `user.service.ts`: Business logic
- `user.route.ts`: Express routes
- `user.interface.ts`: TypeScript interfaces
- `user.validation.ts`: Zod validation schemas
- `user.constant.ts`: Module constants

The module will be automatically placed in `src/modules/User` (capitalized).

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
