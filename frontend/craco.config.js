const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // Wymuszamy użycie pojedynczej instancji 'react' i 'react-dom'
      // dla wszystkich paczek, włącznie z 'react-i18next'.
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
};