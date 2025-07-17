const fs = require('fs');
const path = require('path');

const pluginsRoot = path.resolve(__dirname, 'src/features/plugins');
const outputJsonFile = path.resolve(__dirname, 'public/plugins-registry.json');

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function pascalCase(str) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function getAllComponentFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, {withFileTypes: true});
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getAllComponentFiles(fullPath));
    } else if (file.isFile() && file.name.endsWith('.component.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Estrae modulo e scope dal percorso
 * Formato atteso: modulo / some-folder / scope / ... / file.component.ts
 * Ritorna { modulo, scope }
 */
function extractModuleAndScope(filePath) {
  const relativePath = path.relative(pluginsRoot, filePath);
  const parts = relativePath.split(path.sep);
  if (parts.length < 4) {
    console.warn(`Percorso file troppo corto per estrarre modulo e scope: ${relativePath}`);
    return null;
  }
  const modulo = parts[0];
  const scope = parts[2];
  return {modulo, scope};
}

function extractComponentName(filePath) {
  // filename: es: admin-calendar.component.ts
  const filename = path.basename(filePath, '.ts'); // rimuovo solo .ts
  // rimuovo .component finale
  const baseName = filename.replace(/\.component$/, '');
  return pascalCase(baseName);
}

/**
 * Genera la chiave unica per il plugin combinando modulo e scope
 */
function generateKey(modulo, scope) {
  return `${modulo}-${scope}`;
}

function main() {
  console.log('Scanning plugin components...');
  const componentFiles = getAllComponentFiles(pluginsRoot);

  const components = [];

  componentFiles.forEach(file => {
    const modScope = extractModuleAndScope(file);
    if (!modScope) return;
    const {modulo, scope} = modScope;
    const fs = require('fs');
    const path = require('path');

    const pluginsRoot = path.resolve(__dirname, 'src/features/plugins');
    const outputJsonFile = path.resolve(__dirname, 'public/plugins-registry.json');

    function toCamelCase(str) {
      return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    }

    function pascalCase(str) {
      const camel = toCamelCase(str);
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    }

    function getAllComponentFiles(dir) {
      let results = [];
      const list = fs.readdirSync(dir, {withFileTypes: true});
      for (const file of list) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
          results = results.concat(getAllComponentFiles(fullPath));
        } else if (file.isFile() && file.name.endsWith('.component.ts')) {
          results.push(fullPath);
        }
      }
      return results;
    }

    /**
     * Extracts module and scope from the path
     * Expected format: module / some-folder / scope / ... / file.component.ts
     * Returns { module, scope }
     */
    function extractModuleAndScope(filePath) {
      const relativePath = path.relative(pluginsRoot, filePath);
      const parts = relativePath.split(path.sep);
      if (parts.length < 4) {
        console.warn(`File path too short to extract module and scope: ${relativePath}`);
        return null;
      }
      const module = parts[0];
      const scope = parts[2];
      return {module, scope};
    }

    function extractComponentName(filePath) {
      // filename example: admin-calendar.component.ts
      const filename = path.basename(filePath, '.ts'); // remove only .ts
      // remove the trailing .component
      const baseName = filename.replace(/\.component$/, '');
      return pascalCase(baseName);
    }

    /**
     * Generates a unique key for the plugin by combining module and scope
     */
    function generateKey(module, scope) {
      return `${module}-${scope}`;
    }

    function main() {
      console.log('Scanning plugin components...');
      const componentFiles = getAllComponentFiles(pluginsRoot);

      const components = [];

      componentFiles.forEach(file => {
        const modScope = extractModuleAndScope(file);
        if (!modScope) return;
        const {module, scope} = modScope;

        const componentName = extractComponentName(file) + 'Component';
        const key = generateKey(module, scope);

        components.push({
          key,
          componentName,
          scope
        });
      });

      // Write the JSON file
      fs.mkdirSync(path.dirname(outputJsonFile), {recursive: true});
      fs.writeFileSync(outputJsonFile, JSON.stringify(components, null, 2), {encoding: 'utf-8'});

      console.log(`Registry JSON generated at ${outputJsonFile}`);
      console.log('Components found:', components.length);
      components.forEach(c => console.log(`- ${c.key}: ${c.componentName} (scope: ${c.scope})`));
    }

    main();

    const componentName = extractComponentName(file) + 'Component';
    const key = generateKey(modulo, scope);

    components.push({
      key,
      componentName,
      scope
    });
  });

  // Scrive il JSON su file
  fs.mkdirSync(path.dirname(outputJsonFile), {recursive: true});
  fs.writeFileSync(outputJsonFile, JSON.stringify(components, null, 2), {encoding: 'utf-8'});

  console.log(`Registry JSON generato in ${outputJsonFile}`);
  console.log('Componenti trovati:', components.length);
  components.forEach(c => console.log(`- ${c.key}: ${c.componentName} (scope: ${c.scope})`));
}

main();
