import chalk from 'chalk';
import { execSync } from 'child_process';
import { Command } from 'commander';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import {
  writeAppFile,
  writeConfigFile,
  writeEnvFile,
  writeGitIgnore,
  writePackageJson,
  writePrismaFile,
  writePrismaSchema,
  writeServerFile,
  writeTsConfig,
} from '../utils/file-generator';

// Helper function to get the latest version of a package from npm
async function getLatestVersion(packageName: string): Promise<string> {
  try {
    const version = execSync(`npm view ${packageName} version`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return `^${version}`;
  } catch (error) {
    console.warn(
      chalk.yellow(
        `⚠️  Could not fetch latest version for ${packageName}, using fallback`
      )
    );
    return 'latest';
  }
}

// Fetch latest versions for all dependencies
async function getLatestDependencies() {
  console.log(chalk.blue('📦 Fetching latest package versions...'));

  const deps = [
    'express',
    'cors',
    'dotenv',
    'http-status',
    '@prisma/client',
    '@prisma/adapter-pg',
    'pg',
    'zod',
    'bcrypt',
    'jsonwebtoken',
    'cookie-parser',
  ];
  const devDeps = [
    'typescript',
    'ts-node-dev',
    '@types/node',
    '@types/express',
    '@types/cookie-parser',
    '@types/bcrypt',
    '@types/jsonwebtoken',
    '@types/pg',
    '@types/cors',
    'prisma',
    'eslint',
    'prettier',
  ];

  const [dependencies, devDependencies] = await Promise.all([
    Promise.all(deps.map(async (dep) => [dep, await getLatestVersion(dep)])),
    Promise.all(devDeps.map(async (dep) => [dep, await getLatestVersion(dep)])),
  ]);

  return {
    dependencies: Object.fromEntries(dependencies),
    devDependencies: Object.fromEntries(devDependencies),
  };
}

// Detect available package managers
function detectPackageManagers(): { available: string[]; all: string[] } {
  const all = ['npm', 'pnpm', 'yarn'];
  const available: string[] = [];

  all.forEach((pm) => {
    try {
      execSync(`${pm} --version`, { stdio: 'ignore' });
      available.push(pm);
    } catch {
      // Package manager not available
    }
  });

  return { available, all };
}

// Check if a package manager is installed
function isPackageManagerInstalled(pm: string): boolean {
  try {
    execSync(`${pm} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export const initCommand = new Command('init')
  .description('Initialize a new Apollo Gears project')
  .argument('[projectName]', 'Name of the project directory')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ apollo-cli init my-backend-project')}
  ${chalk.cyan('$ apollo-cli init')}
`
  )
  .action(async (projectName) => {
    // Prompt for Project Name if missing
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of your project?',
          default: 'my-apollo-app',
          validate: (input) =>
            input.trim() !== '' ? true : 'Project name is required',
        },
      ]);
      projectName = answers.name;
    }

    const projectRoot = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectRoot)) {
      console.error(
        chalk.red(`Error: Directory "${projectName}" already exists.`)
      );
      process.exit(1);
    }

    console.log(
      chalk.blue(`\n🚀 Initializing project: ${chalk.bold(projectName)}...\n`)
    );

    try {
      // Create project directory
      await fs.ensureDir(projectRoot);

      // Fetch latest versions of dependencies
      const { dependencies, devDependencies } = await getLatestDependencies();

      // Create Package.json
      await writePackageJson(
        projectRoot,
        projectName,
        dependencies,
        devDependencies
      );

      // Create tsconfig.json
      await writeTsConfig(projectRoot);

      // Create scaffolding folders
      const folders = [
        'src/modules',
        'src/middlewares',
        'src/routes',
        'src/utils',
        'src/errors',
        'src/config',
        'src/lib',
      ];
      console.log(chalk.blue('📂 Creating project structure...'));
      for (const folder of folders) {
        await fs.ensureDir(path.join(projectRoot, folder));
      }

      // Initialize Prisma
      console.log(chalk.blue('\n🔄 Initializing Prisma...\n'));
      try {
        execSync(
          'npx prisma init --datasource-provider postgresql --output ../generated/prisma',
          {
            cwd: projectRoot,
            stdio: 'inherit',
          }
        );
      } catch (error) {
        // Ignore if it fails (e.g., if files already exist)
      }

      // Create essential project files
      await writeServerFile(projectRoot);
      await writeAppFile(projectRoot);
      await writeConfigFile(projectRoot);
      await writeEnvFile(projectRoot);
      await writePrismaSchema(projectRoot);
      await writeGitIgnore(projectRoot);
      await writePrismaFile(projectRoot);

      console.log(
        chalk.green('\n✅ Project structure created successfully! ✨')
      );

      // Prompt for package manager selection and installation
      const { available, all } = detectPackageManagers();

      const pmChoices = all.map((pm) => ({
        name: available.includes(pm) ? `${pm} ✓` : `${pm} (not installed)`,
        value: pm,
      }));

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'packageManager',
          message: chalk.blue('Which package manager would you like to use?'),
          choices: pmChoices,
          default: available[0] || 'npm',
        },
        {
          type: 'confirm',
          name: 'install',
          message: chalk.blue('Would you like to install dependencies now?'),
          default: true,
        },
      ]);

      const packageManager = answers.packageManager;
      const { install } = answers;

      // Check if selected package manager is installed
      if (install && !isPackageManagerInstalled(packageManager)) {
        console.log(
          chalk.yellow(
            `\n⚠️  ${packageManager} is not installed on your system.`
          )
        );
        console.log(
          chalk.cyan(`Install it with: npm install -g ${packageManager}`)
        );
        console.log(chalk.cyan(`Falling back to npm...\n`));

        const installCmd = 'npm install';
        execSync(installCmd, { cwd: projectRoot, stdio: 'inherit' });
        console.log(chalk.green('\n✅ Dependencies installed! ✨'));

        const devCmd = 'npm run dev';
        console.log(
          chalk.cyan(`\nTo get started:\n  cd ${projectName}\n  ${devCmd}\n`)
        );
      } else if (install) {
        console.log(
          chalk.yellow(
            `\n📦 Installing dependencies with ${packageManager}...\n`
          )
        );
        const installCmd =
          packageManager === 'yarn' ? 'yarn' : `${packageManager} install`;
        execSync(installCmd, { cwd: projectRoot, stdio: 'inherit' });
        console.log(chalk.green('\n✅ Dependencies installed! ✨'));

        const devCmd =
          packageManager === 'npm'
            ? 'npm run dev'
            : packageManager === 'yarn'
              ? 'yarn dev'
              : 'pnpm dev';
        console.log(
          chalk.cyan(
            `\nTo get started:\n  cd ${projectName}\n  ${chalk.bold(devCmd)}\n`
          )
        );
      } else {
        const devCmd =
          packageManager === 'npm'
            ? 'npm run dev'
            : packageManager === 'yarn'
              ? 'yarn dev'
              : 'pnpm dev';
        const installCmd =
          packageManager === 'yarn' ? 'yarn' : `${packageManager} install`;
        console.log(
          chalk.cyan(
            `\nTo get started:\n  cd ${projectName}\n  ${chalk.bold(`${installCmd} && ${devCmd}`)}\n`
          )
        );
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Initialization failed:'), error);
      process.exit(1);
    }
  });
