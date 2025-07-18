/**
 * WordPress Packages Update Script
 *
 * This script updates all WordPress packages (@wordpress/*) in the project
 * to their latest version or a specified distribution tag.
 */

import spawn from 'cross-spawn';
import path from 'path';

/**
 * Class responsible for updating WordPress packages
 */
export class PackagesUpdater {
    /**
     * Creates a new PackagesUpdater instance
     *
     * @param {Object} options - Configuration options
     * @param {string} [options.distTag='latest'] - Distribution tag to use
     * @param {string} [options.packageJsonPath] - Path to package.json file
     */
    constructor(options = {}) {
        this.distTag = options.distTag || 'latest';
        this.packageJsonPath = options.packageJsonPath || path.resolve(process.cwd(), 'package.json');
    }

    /**
     * Filters package dependencies to only include WordPress packages
     *
     * @param {Object} packageJson - The package.json contents
     * @param {Object} packageJson.dependencies - Regular dependencies
     * @param {Object} packageJson.devDependencies - Development dependencies
     * @returns {string[]} - Array of WordPress package names
     */
    getWordPressPackages({ dependencies = {}, devDependencies = {} }) {
        return Object.keys(dependencies)
            .concat(Object.keys(devDependencies))
            .filter((packageName) => packageName.startsWith('@wordpress/'));
    }

    /**
     * Updates packages to their latest version or specified tag
     *
     * @param {string[]} packages - Array of package names to update
     * @returns {Object} - Result of the spawn command
     */
    updatePackagesToLatestVersion(packages) {
        if (!packages.length) {
            console.log('No WordPress packages found to update.');
            return { status: 0 };
        }

        console.log(`Updating ${packages.length} WordPress packages to '${this.distTag}'...`);

        const packagesWithTag = packages.map(
            (packageName) => `${packageName}@${this.distTag}`
        );

        try {
            return spawn.sync('yarn', ['add', ...packagesWithTag], {
                stdio: 'inherit',
            });
        } catch (error) {
            console.error('Error updating packages:', error);
            return { status: 1 };
        }
    }

    /**
     * Main method to run the updater
     * @returns {Promise<number>} - Exit code (0 for success, non-zero for failure)
     */
    async run() {
        try {
            // Import package.json
            const packageJsonModule = await import(`file://${this.packageJsonPath}`, {
                with: { type: 'json' }
            });

            const packageJson = packageJsonModule.default;

            // Get WordPress packages
            const packages = this.getWordPressPackages(packageJson);

            // Update packages
            const result = this.updatePackagesToLatestVersion(packages);

            return result.status;
        } catch (error) {
            console.error('Failed to update packages:', error);
            return 1;
        }
    }
}

export default PackagesUpdater;
