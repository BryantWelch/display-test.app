const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(__dirname, '../src/assets/patterns');
const destDir = path.join(__dirname, '../public/patterns');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Get all resolution directories
const resolutionDirs = fs.readdirSync(sourceDir).filter(file => 
  fs.statSync(path.join(sourceDir, file)).isDirectory()
);

// Process each resolution directory
resolutionDirs.forEach(resDir => {
  const sourcePath = path.join(sourceDir, resDir);
  const destPath = path.join(destDir, resDir);
  
  // Create destination resolution directory
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  // Get all PNG files in the source directory
  const files = fs.readdirSync(sourcePath)
    .filter(file => file.toLowerCase().endsWith('.png'));

  // Copy all PNG files
  files.forEach(file => {
    fs.copyFileSync(
      path.join(sourcePath, file),
      path.join(destPath, file)
    );
  });

  // Create index.json with the list of files
  fs.writeFileSync(
    path.join(destPath, 'index.json'),
    JSON.stringify(files, null, 2)
  );

  console.log(`Processed ${resDir}: ${files.length} files`);
});

console.log('Pattern index generation complete!');
