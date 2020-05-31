const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passGithub = require('./passGithub');
const config = require('./config');
const routes = require('./routes');
const port = config.port;
const app = express();
mongoose.connect(config.mongodb, config.mongodbOptions);
const db = mongoose.connection;

//for successful connection

db.once('open', () => console.log('connected to MongoDB successfully!!!'));

//for error in connection
db.on('error', err => console.log(err));

//using middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.get('/', (req, res) =>
  res.send('Welcome to Ecommerse Management System Made By Roshan')
);

app.post('/deploy', passGithub, (req, res) => {
  res.end('deploying!');
  spawn('sh', ['deploy.sh']).stdout.on('data', data =>
    console.log(`stdout: ${data}`)
  );
});

app.listen(port, () =>
  console.log(`server is running on http://localhost:${port}`)
);

//for testing
module.exports = app;
