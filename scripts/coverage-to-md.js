const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateCoverageReport() {
  try {
    // Ensure coverage is generated
    execSync('pnpm test:coverage', { stdio: 'inherit' });

    // Read the text coverage report from the console
    const coverageText = execSync('pnpm test:coverage', { encoding: 'utf8' });

    // Define the output file path
    const coverageFilePath = path.join(__dirname, '../Docs/testing/coverage.md');

    // Write the coverage report to the file
    fs.writeFileSync(coverageFilePath, coverageText);

    console.log(`Coverage report saved to ${coverageFilePath}`);
  } catch (error) {
    console.error('Failed to generate or save coverage report:', error);
  }
}

generateCoverageReport();
