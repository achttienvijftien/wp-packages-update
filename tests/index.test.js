/**
 * Tests for the PackagesUpdater class
 */

import { PackagesUpdater } from '../src/index.js';
import spawn from 'cross-spawn';

// Mock cross-spawn
jest.mock('cross-spawn', () => ({
  sync: jest.fn()
}));

describe('PackagesUpdater', () => {
  let updater;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a new instance for each test
    updater = new PackagesUpdater();
  });

  describe('getWordPressPackages', () => {
    it('should filter WordPress packages from dependencies', () => {
      const packageJson = {
        dependencies: {
          '@wordpress/api-fetch': '^6.0.0',
          'react': '^17.0.0',
          '@wordpress/blocks': '^11.0.0'
        },
        devDependencies: {
          '@wordpress/scripts': '^19.0.0',
          'jest': '^27.0.0'
        }
      };

      const result = updater.getWordPressPackages(packageJson);

      expect(result).toEqual([
        '@wordpress/api-fetch',
        '@wordpress/blocks',
        '@wordpress/scripts'
      ]);
    });

    it('should handle empty dependencies', () => {
      const packageJson = {
        dependencies: {},
        devDependencies: {}
      };

      const result = updater.getWordPressPackages(packageJson);

      expect(result).toEqual([]);
    });
  });

  describe('updatePackagesToLatestVersion', () => {
    it('should return status 0 when no packages are found', () => {
      const result = updater.updatePackagesToLatestVersion([]);

      expect(result).toEqual({ status: 0 });
      expect(spawn.sync).not.toHaveBeenCalled();
    });

    it('should call yarn add with the correct packages', () => {
      // Mock successful spawn result
      spawn.sync.mockReturnValue({ status: 0 });

      const packages = ['@wordpress/api-fetch', '@wordpress/blocks'];
      const result = updater.updatePackagesToLatestVersion(packages);

      expect(result).toEqual({ status: 0 });
      expect(spawn.sync).toHaveBeenCalledWith(
        'yarn',
        ['add', '@wordpress/api-fetch@latest', '@wordpress/blocks@latest'],
        { stdio: 'inherit' }
      );
    });

    it('should use the specified dist tag', () => {
      // Create updater with custom dist tag
      updater = new PackagesUpdater({ distTag: 'next' });

      // Mock successful spawn result
      spawn.sync.mockReturnValue({ status: 0 });

      const packages = ['@wordpress/api-fetch'];
      updater.updatePackagesToLatestVersion(packages);

      expect(spawn.sync).toHaveBeenCalledWith(
        'yarn',
        ['add', '@wordpress/api-fetch@next'],
        { stdio: 'inherit' }
      );
    });

    it('should handle errors', () => {
      // Mock spawn to throw an error
      spawn.sync.mockImplementation(() => {
        throw new Error('Command failed');
      });

      const packages = ['@wordpress/api-fetch'];
      const result = updater.updatePackagesToLatestVersion(packages);

      expect(result).toEqual({ status: 1 });
    });
  });
});
