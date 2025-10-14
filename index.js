const { program } = require('commander');

program
  .option('-n, --name <string>', 'User name')
  .option('-a, --age <number>', 'User age');

program.parse(process.argv);

const options = program.opts();
console.log(`Name: ${options.name}, Age: ${options.age}`);
