const fs = require('fs');
const path = require('path');

const dirsToDelete = ['node_modules', '.expo', 'dist', 'build'];
const filesToDelete = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

dirsToDelete.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  deleteFolderRecursive(fullPath);
});

filesToDelete.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
});

console.log('Project reset complete.');
