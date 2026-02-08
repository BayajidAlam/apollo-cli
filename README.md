# Apollo Gears CLI

A CLI tool for scaffolding and managing Apollo Gears backend projects (Express + TypeScript + Prisma + PostgreSQL).

## Installation

```bash
npm install -g apollo-cli
```

## Development Usage

Since you are developing this tool locally but want to use it in another project:

1.  **Build the CLI**:
    ```bash
    cd "D:\Programming Hero\apollo-cli"
    npm run build
    ```

2.  **Link it globally**:
    This makes the `apollo-gears` command available in your terminal.
    ```bash
    npm link
    ```

3.  **Use it in your backend**:
    Navigate to your backend project folder.
    ```bash
    cd "D:\Programming Hero\apollo-gears-backend"
    apollo-gears generate module User
    ```

### Available Commands
- `apollo-gears generate module <name>`: Scaffolds a new module with Controller, Service, Route, Interface, etc.

