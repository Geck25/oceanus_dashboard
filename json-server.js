const { exec } = require('child_process');

//start Json-Server
const jsonServer = exec('json-server --watch src/assets/json-server/configurations.json');

// Attendi che il server JSON sia pronto
jsonServer.stdout.on('data', (data) => {
  if (data.includes('Resources')) {
    // Avvio Angular utilizzando ng serve --open
    const ngServe = exec('ng serve --open');

    
    ngServe.stdout.pipe(process.stdout);
    ngServe.stderr.pipe(process.stderr);
  }
});
