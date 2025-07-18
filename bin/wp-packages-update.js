#!/usr/bin/env node

/**
 * WordPress Packages Update CLI
 *
 * This script provides a command-line interface for updating WordPress packages.
 *
 * Usage:
 *   wp-packages-update [--dist-tag=<tag>]
 *
 * Options:
 *   --dist-tag  Distribution tag to use (default: 'latest')
 */

import { PackagesUpdater } from '../src';

/**
 * Extracts command line arguments
 *
 * @param {string} arg - The argument name to look for
 * @returns {string|null} - The argument value or null if not found
 */
function getArgFromCLI(arg) {
    for (const cliArg of process.argv.slice(2)) {
        const [name, value] = cliArg.split('=');
        if (name === arg) {
            return value || null;
        }
    }
    return null;
}

/**
 * Main function to run the CLI
 */
async function main() {
    try {
        const distTag = getArgFromCLI('--dist-tag') || 'latest';

        // Create an instance of PackagesUpdater with the specified options
        const updater = new PackagesUpdater({ distTag });

        // Run the updater and get the exit code
        const exitCode = await updater.run();

        // Exit with the appropriate status code
        process.exit(exitCode);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run the CLI
main();
