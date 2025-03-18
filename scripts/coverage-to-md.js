import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import lcovParse from 'lcov-parse';

function generateCoverageReport() {
  try {
    // Ensure coverage is generated and capture the output
    const testCoverageOutput = execSync('pnpm test:coverage', { stdio: 'pipe' }).toString();

    // Read the lcov report
    const lcovPath = path.join(__dirname, '../coverage/lcov.info');
    if (!fs.existsSync(lcovPath)) {
      console.error(`LCOV file not found at ${lcovPath}`);
      return;
    }
    
    const lcovData = fs.readFileSync(lcovPath, 'utf8');

    // Parse the lcov report
    lcovParse(lcovData, (err, data) => {
      if (err) {
        console.error('Failed to parse lcov report:', err);
        return;
      }

      // Check if data is valid
      if (!data || data.length === 0) {
        console.warn('No coverage data found in lcov report');
      }

      // Convert the parsed data to Markdown
      const coverageMarkdown = data.map(entry => {
        return `## ${entry.file}\n\n` +
               `* Lines: ${entry.lines.hit}/${entry.lines.found} (${(entry.lines.hit / entry.lines.found * 100).toFixed(2)}%)\n` +
               `* Functions: ${entry.functions.hit}/${entry.functions.found} (${(entry.functions.hit / entry.functions.found * 100).toFixed(2)}%)\n` +
               `* Branches: ${entry.branches.hit}/${entry.branches.found} (${(entry.branches.hit / entry.branches.found * 100).toFixed(2)}%)\n`;
      }).join('\n');

      // Define the output file path
      const testingDir = path.join(__dirname, '../Docs/testing');
      
      // Ensure directory exists
      if (!fs.existsSync(testingDir)) {
        fs.mkdirSync(testingDir, { recursive: true });
        console.log(`Created directory: ${testingDir}`);
      }
      
      const coverageFilePath = path.join(testingDir, 'coverage.md');
      const testResultFilePath = path.join(testingDir, 'test-result.md');

      // Write the coverage report to the file, including the test output
      fs.writeFileSync(coverageFilePath, `# Coverage Report\n\n${testCoverageOutput}\n\n${coverageMarkdown}`);
      fs.writeFileSync(testResultFilePath, `# Test Results\n\n${testCoverageOutput}\n\n${coverageMarkdown}`);

      console.log(`Coverage report saved to ${coverageFilePath}`);
      console.log(`Test result saved to ${testResultFilePath}`);
    });
  } catch (error) {
    console.error('Failed to generate or save coverage report:', error);
    console.error('Error details:', error.message);
    if (error.stdout) console.log('Process stdout:', error.stdout.toString());
    if (error.stderr) console.log('Process stderr:', error.stderr.toString());
  }
}

generateCoverageReport();
