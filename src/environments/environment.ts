declare const require: any;

export const environment = {
  production: false,
  appName: 'Granatum App',
  home: '/painel/home',
  // api: 'http://127.0.0.1:8000/api',
  api: "https://app.andradeengenhariaeletrica.com.br:3001/api",
  version: require('../../package.json').version
};
