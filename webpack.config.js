const path = require('path');

module.exports = {
  entry: './js/main.js',
  output: {
    filename: 'generated.js',
    path: path.resolve(__dirname, 'dist'),
  },
  'mode': 'production',
  'cache': {
    'type': 'filesystem'
  }
};