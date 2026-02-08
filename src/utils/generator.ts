import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import chalk from 'chalk';

export const renderTemplate = async (
    templateName: string,
    targetPath: string,
    data: Record<string, any>
) => {
    try {
        // Resolve template path - assuming templates are in src/templates or dist/templates
        // We look up from the current file location
        const templateDir = path.resolve(__dirname, '../../src/templates');
        const templatePath = path.join(templateDir, templateName);

        // Fallback for dist structure if src not found (pseudo-logic for now, ideally strictly copy them)
        // If running in ts-node, __dirname is src/utils, so ../templates works if we are at src
        // Let's rely on standard path resolution relative to this file

        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            // Try looking in dist if we are in dist
            const distTemplatePath = path.join(__dirname, '../templates', templateName);
            if (!fs.existsSync(distTemplatePath)) {
                console.error(chalk.red(`Template not found at: ${templatePath}`));
                return;
            }
        }

        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const renderedContent = ejs.render(templateContent, data);

        // Create directory if it doesn't exist
        await fs.ensureDir(path.dirname(targetPath));

        // Write file
        await fs.writeFile(targetPath, renderedContent);
        console.log(chalk.green(`✓ Created: ${path.relative(process.cwd(), targetPath)}`));
    } catch (error) {
        console.error(chalk.red('Error generating file:'), error);
        process.exit(1);
    }
};
