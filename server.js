const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/network/routes');
//require('./src/config/dbConfig');
const config = require('./src/config/config');
const cors = require('cors');
const app = express();
const fs = require('fs');
const https = require('node:https');
const http = require('node:http');
const WebSocket = require('ws');
const crypto = require('crypto');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
 
app.use(express.static('public'));

var server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//const whitelist = ['http://localhost:3030'];
const options = {
  origin: (origin, callback) => {
    callback(null, true)
    /*if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }*/
  }
}
app.use(cors(options));

router(app);

// Manejar el webhook (en este caso, una ruta de ejemplo)
app.post('/webhook', (req, res) => {
  // Procesa la solicitud del webhook aquí y obtén la información necesaria
  const dataFromWebhook = 'Información del webhook';

  var validate = false;

  if(req.headers['mono-signature'] != null ){
    const headerSignature = req.headers['mono-signature'].split(',');
    const headerTimestamp = headerSignature[0].split('=')[1];
    const headerHmac = headerSignature[1].split('=')[1];

    console.log(JSON.stringfy(req.headers['mono-signature']));
   
    const signedPayload = `${headerTimestamp}.${JSON.stringify(req.body)}`;

    const hmac = crypto
      .createHmac('sha256', config.monoSignature)
      .update(signedPayload)
      .digest('hex');

      console.log(headerTimestamp);
    if(hmac === headerHmac){

      const now = Math.floor(Date.now() / 1000);
      
      // Calcular la diferencia de tiempo en milisegundos
      const diferenciaEnSegundos = now - headerTimestamp;
      const diferenciaEnMinutos = diferenciaEnSegundos / 60;
      

      if(diferenciaEnMinutos <= config.maxTimeMin) {
        console.log(req.body);
        validate = true;
        const responseBody = {
          status: req.body.event.data.state,
          reason: req.body.event.data['declination_reason'] ?? "NA"
        }
        console.log(wss.clients);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(responseBody));
          }
        });
      }
    }
  }
  
  if(validate){
    res.status(200).send('OK');
  } else {
    res.status(403).send('Not Authorized');
  }
  
});

if(config.pemPrivateKey != null && config.pemCertificate != null) {

  var optionsSsl = {
    key: fs.readFileSync(config.pemPrivateKey),
    cert: fs.readFileSync(config.pemCertificate),
  };

   server = https.createServer(optionsSsl, app).listen(config.port, function(){
    console.log("Express server listening on port " + config.port);
  });
  

} else {
  server.listen(config.port);
}
