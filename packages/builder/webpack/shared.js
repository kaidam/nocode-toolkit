const babelLoader = {
  test: /\.js$/,
  exclude: /node_modules\/(?!@nocode-works).*/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/env',
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/transform-runtime',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-json-strings',
        [
          '@babel/plugin-proposal-decorators',
          {
            'legacy': true
          },
        ],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
      ],
      env: {
        development: {
          plugins: [
            '@babel/plugin-transform-react-jsx-source',
          ]
        }
      }
    }
  }
}

module.exports = {
  babelLoader
}