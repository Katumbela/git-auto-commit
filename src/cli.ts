// src/cli.ts
import { GitCommitLib } from './index';

const gitLib = new GitCommitLib();

// Lida com argumentos de linha de comando
const [,, command] = process.argv;

if (command === 'run') {
  console.log('Starting to add and commit files...');
  gitLib.addAndCommitFiles();
  console.log('Finished adding and committing files.');
} else {
  console.log('Unknown command. Use "run" to add and commit files.');
}
