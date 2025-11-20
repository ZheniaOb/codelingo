const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // Принудительно используем единый экземпляр 'react' и 'react-dom'
      // для всех пакетов, включая 'react-i18next'.
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
};