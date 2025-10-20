const { Command } = require('commander');
const fs = require ('fs');
const fsp = require('fs').promises;
const http = require ('http');
const { XMLBuilder } = require('fast-xml-parser');

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

const parser = new XMLBuilder({ ignoreAttributes: false, format: true });

const server = http.createServer(async(req, res) => {
  try{
   const rawData = await fsp.readFile(options.input, 'utf8');
    const lines = rawData.split('\n').filter(line => line.trim() !== '');
    const cars = lines.map(line => JSON.parse(line));

    const url = new URL(req.url, `http://${options.host}:${options.port}`);
    const showCylinders = url.searchParams.get('cylinders') === 'true';
    const maxMpg = parseFloat(url.searchParams.get('max_mpg'));

    let filteredCars = cars;
        if (!isNaN(maxMpg)) {
      filteredCars = filteredCars.filter(car => car.mpg < maxMpg);
    }

    const resultCars = filteredCars.map(car => {
      const obj = { model: car.model, mpg: car.mpg };
      if (showCylinders) obj.cyl = car.cyl;
      return obj;
    });

    const xmlData = parser.build({ cars: { car: resultCars } }); 
    
    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    res.end(xmlData);
  } catch (err){
     res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Помилка при читанні або обробці файлу');
    console.error(err);
  }
 
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`)
})