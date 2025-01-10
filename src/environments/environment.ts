declare const require: any;

export const environment = {
  production: false,
  appName: 'Granatum App',
  home: '/painel/home',
  // instanceCRM: 'teste123',
  // instanceRH: 'teste321',
  instanceCRM: 'escritorio',
  instanceRH: 'mel',
  wsUrl: 'ws://127.0.0.1:6001/app/local',
  api: "https://app.andradeengenhariaeletrica.com.br:3001/api",
  // api: 'http://127.0.0.1:8000/api',
  version: require('../../package.json').version
};
