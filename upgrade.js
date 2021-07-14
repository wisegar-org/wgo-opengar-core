const fs = require('fs-extra');
const { execSync } = require('child_process');

console.log('\x1b[33m', 'UPDATING APPLICATION LIBRARY');

const packageJsonPath = 'package.json';
const destination = './build';

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}
fs.emptyDirSync(destination);

const package = fs.readJsonSync(packageJsonPath, { throws: true });
if (!package || !package.version) {
  throw 'Impossible to read package.json file!';
}
const splittedVersion = package.version.split('-');
if (!splittedVersion || !splittedVersion.length || !splittedVersion[1]) {
  throw 'Impossible to read package version!';
}
const appVersion = splittedVersion[0];

const buildVersion = splittedVersion[1].split('.');
if (!buildVersion || !buildVersion.length > 0 || !buildVersion[1]) {
  throw 'Impossible to read build version number!';
}
const newBuildVersion = parseInt(buildVersion[1]) + 1;
package.version = `${appVersion}-build.${newBuildVersion}`;

console.log('\x1b[33m', 'Rebasing application library...');
execSync('git rebase', { stdio: 'inherit' });

// const prettier = require('prettier');
// if (!prettier) {
//   throw 'Impossible to find prettier api. Try to run <npm install prettier --save-dev>!';
// }
// prettier.format(package, { filepath: packageJsonPath });
fs.writeJsonSync(packageJsonPath, package);

console.log('\x1b[33m', 'Building application library...');
execSync('npx tsc', { stdio: 'inherit' });

console.log('\x1b[33m', 'Adding package.json changes commit...');
execSync(`git add ${packageJsonPath}`, { stdio: 'inherit' });
execSync(`git commit -m "Update build version to "${package.version}`, { stdio: 'inherit' });

console.log('\x1b[33m', 'Rebasing application library...');
execSync('git rebase', { stdio: 'inherit' });

console.log('\x1b[33m', 'Push application library...');
execSync('git push', { stdio: 'inherit' });

console.log('\x1b[33m', 'Publishing application library...');
execSync('npm publish', { stdio: 'inherit' });

console.log('\x1b[33m', 'UPDATE COMPLETED!');
