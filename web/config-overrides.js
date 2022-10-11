const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@components': 'src/components',
    '@pages': 'src/pages',
    '@datas': 'src/datas',
    '@services': 'src/services'
  })(config);

  return config;
};