const config = {
  port: process.env.PORT || 5003,
  mongodbOptions: {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  },
  deployPass: 'deployKey',
  apiKey: 'roshanKey',
  //-----------------
  jwt_secrect_key: 'i love coding',
  jwt_expiresIn: '30d'
};
const development = {
  mongodb: 'mongodb://localhost:27017/crownstack'
};
const production = {
  mongodb: 'mongodb://localhost:27017/crownstack'
};
let environment = process.env.NODE_ENV || 'development';
console.log('Loaded Configs : ' + environment);
module.exports = Object.assign(config, eval(environment));
