function generateManifest() {
  const fs = require('fs');
  const path = require('path');

  const PLUGIN_DIR = path.join(__dirname, '..', 'src', 'features', 'plugins', 'available');
  const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'features', 'plugins', 'utils', 'plugins.manifest.ts');
  fs.mkdirSync(path.dirname(OUTPUT_FILE), {recursive: true});

  try {
    const manifestContent = `export const manifest = [];\n`;
    fs.writeFileSync(OUTPUT_FILE, manifestContent, 'utf-8');
    console.log('✅ Empty manifest file created successfully.');
  } catch (err) {
    console.error('❌ Error while creating empty manifest file:', err);
  }

  function findManifestFiles(dir) {
    let results = [];
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        results = results.concat(findManifestFiles(fullPath));
      } else if (file === 'manifest.ts') {
        results.push(fullPath);
      }
    });
    return results;
  }

  try {
    const manifests = findManifestFiles(PLUGIN_DIR).sort();
    console.log(`Found ${manifests.length} manifest file(s):`, manifests);

    let imports = '';
    let manifestArray = 'export const PLUGINS: PluginManifest[] = [\n';

    manifests.forEach((file, idx) => {
      const relativePath = path.relative(path.dirname(OUTPUT_FILE), file).replace(/\.ts$/, '');
      const importPath = './' + relativePath.split(path.sep).join('/');
      const varName = `manifest${idx}`;
      imports += `import { manifest as ${varName} } from '${importPath}';\n`;
      manifestArray += `  ...${varName},\n`;
    });

    manifestArray += '];\n';

    const fileContent =
      `// Auto-generated file. Do not modify manually.\n` +
      `import { PluginManifest } from '../entities';\n\n` +
      `${imports}\n${manifestArray}`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log('✅ plugins.manifest.ts generated successfully.');
  } catch (error) {
    console.error('❌ Error while generating plugins.manifest.ts:', error);
    process.exit(1);
  }
}

module.exports = {generateManifest};
