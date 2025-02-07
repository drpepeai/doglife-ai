// craco.config.js
module.exports = {
    webpack: {
      configure: {
        resolve: {
          fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            url: require.resolve('url/'),
            zlib: require.resolve('browserify-zlib'),  
            buffer: require.resolve('buffer/'),  

          },
        },
      },
    },
  };
  