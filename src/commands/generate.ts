import { Command } from 'commander';
import inquirer from 'inquirer';
import path from 'path';
import { renderTemplate } from '../utils/generator';

export const generateCommand = new Command('generate')
    .alias('g')
    .description('Generate a new resource')
    .argument('[type]', 'Type of resource to generate (e.g., module)')
    .argument('[name]', 'Name of the resource')
    .action(async (type, name) => {
        // 1. Validate Input
        if (!type) {
            const answers = await inquirer.prompt([{
                type: 'list',
                name: 'type',
                message: 'What would you like to generate?',
                choices: ['module']
            }]);
            type = answers.type;
        }

        if (type !== 'module') {
            console.error('Only "module" generation is currently supported.');
            return;
        }

        if (!name) {
            const answers = await inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'What is the name of the module?',
                validate: (input) => input.trim() !== '' ? 'Module name is required' : true
            }]);
            name = answers.name;
        }

        const moduleNameRaw = name.trim();

        // 2. Format Casing
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
        const camelize = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

        const moduleNamePascal = capitalize(moduleNameRaw);
        const moduleNameCamel = camelize(moduleNameRaw);

        console.log(`Generating module: ${moduleNamePascal}...`);

        // 3. Define Output Paths
        // Assume we are in the project root
        const baseDir = path.join(process.cwd(), 'src/app/modules', moduleNamePascal);

        // 4. Generate Files
        const files = [
            { template: 'module/controller.ejs', output: `${moduleNameCamel}.controller.ts` },
            { template: 'module/service.ejs', output: `${moduleNameCamel}.service.ts` },
            { template: 'module/route.ejs', output: `${moduleNameCamel}.route.ts` },
            { template: 'module/interface.ejs', output: `${moduleNameCamel}.interface.ts` },
            { template: 'module/validation.ejs', output: `${moduleNameCamel}.validation.ts` },
            { template: 'module/constant.ejs', output: `${moduleNameCamel}.constant.ts` },
        ];

        for (const file of files) {
            await renderTemplate(
                file.template,
                path.join(baseDir, file.output),
                { moduleName: moduleNamePascal, camelModuleName: moduleNameCamel }
            );
        }

        // 5. Success Message
        console.log('\nModule generated successfully! 🚀');
    });
