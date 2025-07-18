# WordPress Packages Updater

A tool to update WordPress packages (@wordpress/*) in your project to their latest version or a specified distribution tag using Yarn.

## Requirements

- Node.js v22 or higher

## Installation

### Global Installation

```bash
yarn global add @1815/wp-packages-update
```

### Local Installation

```bash
yarn add @1815/wp-packages-update --dev
```

## Usage

### Command Line Interface

If installed globally:

```bash
wp-packages-update [--dist-tag=<tag>]
```

If installed locally:

```bash
npx wp-packages-update [--dist-tag=<tag>]
```

#### Options

- `--dist-tag`: Distribution tag to use (default: 'latest')

### Programmatic Usage

```javascript
import { PackagesUpdater } from 'wp-packages-updater';

async function updatePackages() {
  const updater = new PackagesUpdater({
    distTag: 'next', // Optional, defaults to 'latest'
    packageJsonPath: '/path/to/package.json' // Optional, defaults to process.cwd() + '/package.json'
  });

  const exitCode = await updater.run();
  console.log(`Update completed with exit code: ${exitCode}`);
}

updatePackages();
```

## API

### PackagesUpdater

#### Constructor

```javascript
new PackagesUpdater(options)
```

##### Parameters

- `options` (Object): Configuration options
  - `distTag` (string, optional): Distribution tag to use (default: 'latest')
  - `packageJsonPath` (string, optional): Path to package.json file (default: process.cwd() + '/package.json')

#### Methods

##### run()

Runs the update process.

```javascript
updater.run()
```

Returns: Promise<number> - Exit code (0 for success, non-zero for failure)
