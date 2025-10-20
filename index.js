const { Command } = require('commander');
const fs = require ('fs');
const http = require ('http');

const program = new Command();

program
  .option('-i, --input <path>', '(обовʼязковий параметр) шлях до файлу, який даємо для читання')
  .option('-h, --host <host>', '(обовʼязковий параметр) адреса сервера')
  .option('-p, --port <port>', '(обовʼязковий параметр) порт сервера');
  
program.parse(process.argv);

const options = program.opts();

if(!fs.existsSync(options.input)){
  console.error('Cannot find input file');
  process.exit(1);
}

if (!options.input || !options.host || !options.port){
  console.error('Error: Missing required parameter');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Сервер працює успішно!');
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`)
})