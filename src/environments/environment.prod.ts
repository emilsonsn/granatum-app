declare const require: any;

export const environment = {
  production: false,
  appName: 'Granatum App',
  home: '/painel',
  api: 'http://127.0.0.1:8000/api',
  instanceCRM: 'teste123',
  //api: "https://app.andradeengenhariaeletrica.com.br:3001/api",
  version: require('../../package.json').version
};
