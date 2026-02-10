import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import { renderTemplate } from '../utils/file-generator';

export const generateCommand = new Command('generate')
  .alias('g')
  .description('Generate a new resource')
  .argument('[type]', 'Type of resource to generate (e.g., module)')
  .argument('[name]', 'Name of the resource')
  .addHelpText(
    'after',
    `
${chalk.yellow('Examples:')}
  ${chalk.cyan('$ apollo-cli generate module user')}
  ${chalk.cyan('$ apollo-cli g module product')}
`
  )
  .action(async (type, name) => {
    if (!type) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: chalk.blue('What would you like to generate?'),
          choices: ['module'],
        },
      ]);
      type = answers.type;
    }

    if (type !== 'module') {
      console.error(
        chalk.red('❌ Only "module" generation is currently supported.')
      );
      return;
    }

    if (!name) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: chalk.blue('What is the name of the module?'),
          validate: (input) =>
            input.trim() === '' ? 'Module name is required' : true,
        },
      ]);
      name = answers.name;
    }

    const moduleNameRaw = name.trim();

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const camelize = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

    const moduleNamePascal = capitalize(moduleNameRaw);
    const moduleNameCamel = camelize(moduleNameRaw);

    console.log(
      chalk.cyan(`\n🚀 Generating module: ${chalk.bold(moduleNamePascal)}...\n`)
    );

    // Assumes the command is run from the project root
    const baseDir = path.join(process.cwd(), 'src/modules', moduleNamePascal);

    const files = [
      {
        template: 'module/controller.ejs',
        output: `${moduleNameCamel}.controller.ts`,
      },
      {
        template: 'module/service.ejs',
        output: `${moduleNameCamel}.service.ts`,
      },
      { template: 'module/route.ejs', output: `${moduleNameCamel}.route.ts` },
      {
        template: 'module/interface.ejs',
        output: `${moduleNameCamel}.interface.ts`,
      },
      {
        template: 'module/validation.ejs',
        output: `${moduleNameCamel}.validation.ts`,
      },
      {
        template: 'module/constant.ejs',
        output: `${moduleNameCamel}.constant.ts`,
      },
    ];

    for (const file of files) {
      await renderTemplate(file.template, path.join(baseDir, file.output), {
        moduleName: moduleNamePascal,
        camelModuleName: moduleNameCamel,
      });
    }

    console.log(chalk.green('\n✨ Module generated successfully! 🚀\n'));
  });
